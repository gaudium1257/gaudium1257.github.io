# gaudium1257.github.io — 포트폴리오

Bilingual (ko/en) personal portfolio. Next.js 16 (App Router, static export) + TypeScript + Tailwind CSS v4, deployed to GitHub Pages.

@AGENTS.md

## Non-negotiables

1. **Facts only.** Content is the owner's public record. Never invent or embellish projects, numbers, roles, awards or dates. Missing info → ask the owner, or leave the field out. Project content comes from `docs/prompts/project-fact-sheet.md` (run in that project's folder) and is ingested with the `add-content` skill + `content-fact-checker` agent.
2. **Both languages, always.** Every user-facing string exists in ko and en: content uses `Localized` (`{ ko, en }`), UI strings live in `src/i18n/dictionaries/{ko,en}.ts` (tsc enforces identical shape). No hard-coded UI text in components.
3. **Findability over length.** Every section reachable in one click from persistent navigation; long lists collapse; detail lives on detail pages. Don't add anything that makes the home page a long scroll.
4. **Design tokens only.** Colors/spacing come from tokens in `src/app/globals.css` (`bg-primary`, `text-muted`…). No raw hex in components. Theme: purple. The visual design comes from the owner's chosen mockup (made with `docs/prompts/design.md`) — do not invent a new visual direction; ask when the mockup doesn't cover a case.
5. **Responsive.** Must work at 375px with no horizontal scroll; verify with screenshots.

## Commands

|                                     |                                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run dev`                       | dev server                                                                                   |
| `npm run check`                     | lint + typecheck + content validation (run before every commit; the commit hook enforces it) |
| `npm run build`                     | static export to `out/` (fails on invalid content)                                           |
| `npm run validate:content[:strict]` | content report; strict also fails on TODO placeholders (used by deploy)                      |
| `npm run screenshot -- /ko/ /en/…`  | 375/768/1440 screenshots of `out/` into `screenshots/`                                       |
| `npm run format`                    | prettier (also runs automatically after every edit)                                          |

## Layout

```
content/                    ← all portfolio data (JSON), validated by src/content/schema.ts
  profile.json              자기소개 + connect (GitHub, email, Instagram, Discord)
  projects/<id>.json        프로젝트          sources/projects/<id>.md = fact sheet (audit trail)
  activities/<id>.json      활동
  awards/<id>.json          수상경력
  skills.json               기술 스택 (names must match projects' techStack)
  education.json            학력 및 경력사항 (items = 학력, career = 경력)
  project-order.json        프로젝트 순서 (홈·목록 공통, 소유자가 직접 지정; 빠진 건 최신순으로 뒤에)
src/content/schema.ts       zod schemas (single source of truth)
src/content/collect.ts      reads + validates content, builds the global id index and relation graph
src/content/load.ts         getContent() / getRelated() for pages (throws on invalid content)
src/i18n/                   locales, t(), dictionaries
src/config/sections.ts      section registry → drives nav order and home sections
src/app/[locale]/…          pages (/ko/, /en/, /ko/projects/<id>/)
src/app/(root)/             "/" → redirects to saved or browser language
docs/prompts/               project-fact-sheet.md (for other project sessions), design.md (/design prompt), handoff.md (cloud → local session)
```

- Ids are global kebab-case and equal the file name. `related: [ids]` may point to any collection; declaring one side is enough (relations are undirected).
- Files starting with `_` in content folders are ignored.
- Schema change ⇒ update the JSON template in `docs/prompts/project-fact-sheet.md` (validator checks it) and the tables in this file and the `add-content` skill.
- Static export limits: no server features (no cookies, redirects, rewrites, server actions, default image loader). Dynamic routes need `generateStaticParams` + `dynamicParams = false`.

## Workflow

- **Branches:** `dev/<kebab-description>` only (e.g. `dev/first-develop`, `dev/design-impl`). Reuse an existing dev branch for related work instead of creating many. Never push to `main`; merge via PR. The `guard-bash` hook enforces this.
- **Commits:** small, imperative, prefixed: `feat:`, `fix:`, `content:`, `style:`, `chore:`, `docs:`, `harness:`.
- **Before saying done:** use the `verify` skill (check → build → screenshots you actually look at).
- **Skills:** `add-content` (any content change), `add-section` (new section type), `verify`.
- **Agent:** `content-fact-checker` (read-only truthfulness audit of content JSON).
- **Hooks** (`.claude/settings.json`): session-start installs deps; post-edit runs prettier and re-validates content; guard-bash enforces branch/push rules and runs `npm run check` before `git commit`.

## Deploy

Push/merge to `main` → `.github/workflows/deploy.yml` (strict validation → build → GitHub Pages). One-time setup: repo Settings → Pages → Source = **GitHub Actions**. CI (`ci.yml`) runs on PRs and `dev/**` pushes.
