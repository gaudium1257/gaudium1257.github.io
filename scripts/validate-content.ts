/**
 * Validates everything under `content/` against `src/content/schema.ts`,
 * plus the JSON template embedded in the fact-sheet prompt so that prompt can
 * never drift from the schema.
 *
 *   npm run validate:content          errors fail, warnings are printed
 *   npm run validate:content:strict   warnings fail too (used before deploy)
 */
import fs from "node:fs";
import path from "node:path";
import { collectContent } from "../src/content/collect";
import { Project } from "../src/content/schema";

const strict = process.argv.includes("--strict");
const { content, errors, warnings } = collectContent();

const PROMPT = path.join(process.cwd(), "docs/prompts/project-fact-sheet.md");
if (fs.existsSync(PROMPT)) {
  const md = fs.readFileSync(PROMPT, "utf8");
  const block = md.match(
    /<!-- schema-template:start -->\s*```json\n([\s\S]*?)```\s*<!-- schema-template:end -->/,
  );
  if (!block) {
    errors.push(
      "docs/prompts/project-fact-sheet.md: schema-template block not found",
    );
  } else {
    try {
      const result = Project.safeParse(JSON.parse(block[1]));
      if (!result.success)
        errors.push(
          ...result.error.issues.map(
            (i) =>
              `fact-sheet prompt template: ${i.path.join(".")} — ${i.message} (update the prompt to match the schema)`,
          ),
        );
    } catch (e) {
      errors.push(
        `fact-sheet prompt template: invalid JSON — ${(e as Error).message}`,
      );
    }
  }
}

const counts = [
  `${content.projects.length} projects`,
  `${content.activities.length} activities`,
  `${content.awards.length} awards`,
  `${content.societies.length} societies`,
  `${content.skills.groups.length} skill groups`,
  `${content.education.items.length} education items`,
].join(", ");

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);

const failed = errors.length > 0 || (strict && warnings.length > 0);
console.log(
  `\ncontent: ${counts}\n${errors.length} error(s), ${warnings.length} warning(s)${strict ? " [strict]" : ""}`,
);
process.exit(failed ? 1 : 0);
