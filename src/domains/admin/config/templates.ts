import type { ContentKind } from '@/shared/content';

/** 새 항목의 초기값. 스키마의 필수 필드를 빠짐없이 담는다 (docs/product-specs/content-model.md). */
export const TEMPLATES: Record<ContentKind, string> = {
  profile: `{
  "name": "",
  "headline": "",
  "affiliation": "",
  "summary": "",
  "links": []
}
`,
  project: `{
  "id": "",
  "title": "",
  "role": "",
  "startedOn": "2026-01-01",
  "endedOn": null,
  "summary": "",
  "body": "",
  "stack": [],
  "links": [],
  "outcome": "",
  "order": 0,
  "visibility": "public"
}
`,
  post: `{
  "id": "",
  "title": "",
  "publishedOn": "2026-01-01",
  "category": "review",
  "summary": "",
  "body": "",
  "projectId": null,
  "visibility": "public"
}
`,
};
