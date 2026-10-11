#!/usr/bin/env node
// PostToolUse(Edit|Write|MultiEdit): format the edited file, and re-validate
// content immediately when a file under content/ changed. Exit 2 sends the
// failure back to Claude so it fixes the problem in the same turn.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const input = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
const file = input.tool_input?.file_path;
const root = process.env.CLAUDE_PROJECT_DIR || process.cwd();
if (!file || !fs.existsSync(file)) process.exit(0);

const relPath = path.relative(root, path.resolve(file));
if (
  relPath.startsWith("..") ||
  relPath.split(path.sep).includes("node_modules")
)
  process.exit(0);

const bin = (name) => path.join(root, "node_modules", ".bin", name);

if (
  /\.(tsx?|mjs|js|json|css|md)$/.test(relPath) &&
  fs.existsSync(bin("prettier"))
) {
  try {
    execFileSync(bin("prettier"), ["--write", "--log-level", "warn", relPath], {
      cwd: root,
      stdio: "pipe",
    });
  } catch (e) {
    process.stderr.write(
      `prettier failed on ${relPath}:\n${e.stderr?.toString() ?? e.message}\n`,
    );
    process.exit(2);
  }
}

const touchesContent =
  (relPath.startsWith(`content${path.sep}`) && relPath.endsWith(".json")) ||
  relPath === path.join("src", "content", "schema.ts") ||
  relPath === path.join("docs", "prompts", "project-fact-sheet.md");
if (touchesContent) {
  try {
    execFileSync("npm", ["run", "--silent", "validate:content"], {
      cwd: root,
      stdio: "pipe",
    });
  } catch (e) {
    process.stderr.write(
      `content validation failed after editing ${relPath}:\n${e.stdout ?? ""}${e.stderr ?? ""}`,
    );
    process.exit(2);
  }
}
