import "server-only";
import { collectContent, type Content } from "./collect";

let cached: Content | undefined;

/**
 * Validated content for pages. Fails the build on any content error so broken
 * data can never be deployed; run `npm run validate:content` for the full report.
 */
export function getContent(): Content {
  if (cached) return cached;
  const { content, errors } = collectContent();
  if (errors.length > 0) {
    throw new Error(
      `Invalid content (${errors.length}):\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
  cached = content;
  return content;
}

/** Related items of `id`, in both directions, with their kind and title. */
export function getRelated(id: string) {
  const { relations, index } = getContent();
  return [...(relations.get(id) ?? [])].map((rid) => ({
    id: rid,
    ...index.get(rid)!,
  }));
}
