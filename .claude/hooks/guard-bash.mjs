#!/usr/bin/env node
// PreToolUse(Bash): enforce the repo's git rules before the command runs.
//  - new branches must be named dev/<kebab-case-description>
//  - no pushing to main/master, no plain force-push (--force-with-lease is ok)
//  - `git commit` only after `npm run check` passes
// Exit 2 blocks the command and shows the reason to Claude.
import { execSync } from "node:child_process";
import fs from "node:fs";

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const cmd = input.tool_input?.command ?? "";
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();

const block = (msg) => {
  process.stderr.write(`Blocked by .claude/hooks/guard-bash.mjs: ${msg}\n`);
  process.exit(2);
};

// Split chained commands so each git invocation is checked on its own.
// Separators inside quotes (e.g. a commit message) are neutralised first.
const unquoted = cmd.replace(/(["'])(?:\\.|(?!\1)[^\\])*\1/g, (q) =>
  q.replace(/&&|\|\||;|\n/g, " "),
);
const parts = unquoted.split(/&&|\|\||;|\n/).map((s) => s.trim());
const unquote = (s) => s.replace(/^["']|["']$/g, "");
const BRANCH_OK = /^dev\/[a-z0-9]+(?:-[a-z0-9]+)*$/;

for (const part of parts) {
  const create =
    part.match(
      /^git\s+(?:checkout\s+-[bB]|switch\s+(?:-c|--create|-C))\s+(\S+)/,
    ) ?? part.match(/^git\s+branch\s+(?!-)(\S+)\s*$/);
  if (create && !BRANCH_OK.test(unquote(create[1])))
    block(
      `branch "${unquote(create[1])}" must be named dev/<kebab-case-description> (e.g. dev/first-develop). Reuse an existing dev/ branch when the work is related.`,
    );

  if (/^git\s+push\b/.test(part)) {
    if (/\s(--force|-f)(\s|$)/.test(part))
      block(
        "plain force-push is not allowed; use --force-with-lease only if truly needed.",
      );
    if (
      /\s(origin\s+)?(HEAD:)?(main|master)(\s|$)/.test(part) ||
      /:(main|master)(\s|$)/.test(part)
    )
      block("never push to main directly; push the dev/ branch and open a PR.");
    let current = "";
    try {
      current = execSync("git rev-parse --abbrev-ref HEAD", { cwd: root })
        .toString()
        .trim();
    } catch {}
    if (
      /^git\s+push(\s+-u)?(\s+origin)?\s*$/.test(part) &&
      (current === "main" || current === "master")
    )
      block("you are on main; switch to a dev/ branch before pushing.");
  }

  if (
    /^git\s+commit\b/.test(part) &&
    !/--allow-empty-message|--dry-run/.test(part)
  ) {
    try {
      execSync("npm run --silent check", { cwd: root, stdio: "pipe" });
    } catch (e) {
      block(
        `\`npm run check\` failed — fix before committing:\n${(e.stdout ?? "").toString().slice(-4000)}${(e.stderr ?? "").toString().slice(-4000)}`,
      );
    }
  }
}
