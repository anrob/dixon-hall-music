#!/usr/bin/env node
/**
 * sync-to-loveable — push this project's site into the Loveable repo.
 *
 * Loveable (anrob/chill-beats-space) is a Vite + TanStack Start React app, NOT a
 * static host. Our whole site lives in ONE file (site/index.html). Loveable renders
 * it by splitting that file into three pieces inside one route:
 *
 *   src/routes/-dixon/dixon-body.html   <- our <body> markup (scripts removed)
 *   src/routes/-dixon/dixon.css         <- our <style> contents
 *   src/routes/-dixon/dixon.js.txt      <- our <script> contents (executed on mount)
 *   public/assets/                      <- our local images
 *
 * This script regenerates those four things from site/index.html and overwrites
 * whatever is in the Loveable repo. It does NOT touch Loveable's scaffold
 * (vite.config, src/router, package.json, .lovable/ ...) — that's the engine that
 * makes it render, and deleting it would break the Loveable project.
 *
 * Usage:
 *   node tools/sync-to-loveable.mjs          # dry run: regenerate + show the diff, no push
 *   node tools/sync-to-loveable.mjs --push   # regenerate, commit, and push to Loveable
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = "https://github.com/anrob/chill-beats-space.git";
const HERE = dirname(fileURLToPath(import.meta.url));
const PROJECT = join(HERE, "..");
const SITE = join(PROJECT, "site");
const INDEX = join(SITE, "index.html");

// Local images we own and copy into the Loveable repo's public/assets.
const ASSETS = ["logo.png", "band.png", "brick.avif", "hero-mock.png", "single-cover.jpg"];

const PUSH = process.argv.includes("--push");

const log = (...a) => console.log(...a);
const die = (m) => {
  console.error(`\n✖ ${m}`);
  process.exit(1);
};
const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** Rewrite our relative "assets/x" refs to Loveable's absolute "/assets/x".
 *  Only touches "assets/ , 'assets/ , (assets/ — leaves external URLs
 *  (assets.cdn.filesafe.space, fonts, cdnjs) untouched. */
const rewriteAssets = (s) => s.replace(/(["'(])assets\//g, "$1/assets/");

function build() {
  if (!existsSync(INDEX)) die(`Can't find ${INDEX}`);
  const html = readFileSync(INDEX, "utf8");

  const styleM = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  if (!styleM) die("No <style> block found in index.html");
  const bodyM = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyM) die("No <body> found in index.html");

  const css = rewriteAssets(styleM[1]).replace(/^\n/, "").trimEnd() + "\n";

  // Pull every <script> out of the body, in document order. Also consume an
  // HTML comment sitting immediately above a script (it describes that script,
  // so it shouldn't be left orphaned once the script is gone).
  const scripts = [];
  // The comment sub-pattern `<!--(?:(?!-->)[\s\S])*?-->` matches exactly ONE
  // comment and can't bridge across a later `-->`, so it only strips a comment
  // that truly sits right on top of the script.
  let body = bodyM[1].replace(
    /[ \t]*(?:<!--(?:(?!-->)[\s\S])*?-->[ \t]*\r?\n)?[ \t]*<script[^>]*>([\s\S]*?)<\/script>[ \t]*\r?\n?/gi,
    (_, inner) => {
      scripts.push(inner.replace(/^\n/, "").replace(/\s+$/, ""));
      return "";
    },
  );
  if (scripts.length === 0) die("No <script> blocks found in body — check index.html structure");

  // Normalize whitespace so diffs stay clean: collapse 3+ blank lines, strip
  // leading blank lines (keep the first line's indent), one leading + one
  // trailing blank line to match the route's expected shape.
  body =
    "\n" +
    rewriteAssets(body).replace(/\n{3,}/g, "\n\n").replace(/^\n+/, "").replace(/\s+$/, "") +
    "\n\n";
  const js = scripts.join("\n\n") + "\n";

  return { body, css, js };
}

function main() {
  const { body, css, js } = build();

  const tmp = mkdtempSync(join(tmpdir(), "loveable-sync-"));
  const clone = join(tmp, "chill-beats-space");
  log(`→ Cloning Loveable repo …`);
  try {
    git(tmp, "clone", "--depth", "1", REPO, clone);
  } catch (e) {
    die(`Clone failed. Are you authed to github.com/anrob?\n${e.stderr || e.message}`);
  }

  const dixon = join(clone, "src", "routes", "-dixon");
  if (!existsSync(dixon)) die(`Loveable repo is missing ${dixon} — its structure changed. Re-check before syncing.`);

  writeFileSync(join(dixon, "dixon-body.html"), body);
  writeFileSync(join(dixon, "dixon.css"), css);
  writeFileSync(join(dixon, "dixon.js.txt"), js);

  const pubAssets = join(clone, "public", "assets");
  for (const a of ASSETS) {
    const from = join(SITE, "assets", a);
    if (!existsSync(from)) {
      log(`  ! skipping ${a} — not found in site/assets`);
      continue;
    }
    copyFileSync(from, join(pubAssets, a));
  }

  // Stage everything first so NEW files (e.g. added assets) show in the summary,
  // not just edits to already-tracked files.
  git(clone, "add", "-A");
  const stat = git(clone, "-c", "color.ui=always", "diff", "--cached", "--stat");
  if (!stat.trim()) {
    log("\n✓ Loveable is already in sync — nothing to copy.");
    rmSync(tmp, { recursive: true, force: true });
    return;
  }

  log("\n── Changes to push to Loveable ──");
  log(stat);

  if (!PUSH) {
    log("Dry run only. Re-run with --push to commit + push these to Loveable.");
    log(`(Regenerated clone left at: ${clone})`);
    return;
  }

  git(clone, "-c", "user.name=Larry Scott", "-c", "user.email=iamjustfresh@gmail.com",
    "commit", "-m", "Sync Dixon site from dixon-hall-music");
  log("→ Pushing …");
  git(clone, "push", "origin", "HEAD");
  log("\n✓ Pushed to Loveable. It'll rebuild the preview shortly.");
  rmSync(tmp, { recursive: true, force: true });
}

main();
