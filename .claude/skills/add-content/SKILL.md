---
name: add-content
description: Add or update portfolio content (projects, activities, awards, skills, education & career, profile) from a project fact sheet or from the owner's answers, without inventing anything. Use whenever the user pastes a fact sheet / JSON from docs/prompts/project-fact-sheet.md or an update from docs/prompts/project-update.md, or says "프로젝트 추가", "프로젝트 업데이트", "수상 추가", "활동 추가", "경력 추가", "내용 수정".
---

# add-content

Content is the owner's public record. **Nothing goes in that the owner or a fact sheet did not state.** When something is missing, ask; never fill gaps with plausible text.

## Where things go

| Kind               | File                                                                              | Schema      |
| ------------------ | --------------------------------------------------------------------------------- | ----------- |
| Project            | `content/projects/<id>.json` (+ fact sheet in `content/sources/projects/<id>.md`) | `Project`   |
| 활동               | `content/activities/<id>.json`                                                    | `Activity`  |
| 수상               | `content/awards/<id>.json`                                                        | `Award`     |
| 개발 역량          | `content/skills.json`                                                             | `Skills`    |
| 학력 및 경력사항   | `content/education.json` (`items` = 학력, `career` = 경력)                        | `Education` |
| 자기소개 / connect | `content/profile.json`                                                            | `Profile`   |

Schemas: `src/content/schema.ts` — read it before writing JSON. Ids are global kebab-case and must equal the file name.

## Project (from the fact-sheet prompt)

1. Require **both** outputs of `docs/prompts/project-fact-sheet.md`: the Markdown fact sheet and the JSON. If only one is given, ask for the other. If the user has neither, give them that prompt file and stop.
2. Save the fact sheet verbatim to `content/sources/projects/<id>.md` (the audit trail; not rendered on the site).
3. Save the JSON to `content/projects/<id>.json`. The post-edit hook validates it; fix any schema errors by asking or by correcting obvious format mistakes only (never by changing facts).
4. Run the `content-fact-checker` subagent on the pair. Resolve every finding: remove unsupported claims or ask the user — do not reword them to sound safer.
5. Images: if the fact sheet lists candidates and the user provides files, copy to `public/images/projects/<id>/` and set `thumbnail` / `screenshots` with real alt text (`logo`: a square app icon or logo mark, PNG/WebP/SVG ≥256px — the validator rejects non-square files; `thumbnail`: a 16:10 lead image that leads alone on cards and the detail header). Give each screenshot its `kind` (`web` 16:10 · `mobile` 6:13 · `photo` 4:3). Boxes never crop and the validator rejects a ratio off by more than 1%, so pad (don't crop) files to the exact ratio first.
6. Relations: map section 12 of the fact sheet ("관련 활동·수상·경력") to existing ids and fill `related` (one side is enough; the loader links both ways). If the target doesn't exist yet, offer to add it.
7. `techNotes` (where each tech was used, keyed by the exact `techStack` name): keep only notes the fact sheet supports; the validator rejects keys that are not in `techStack`. Ask for missing ones rather than inventing.
8. AI coding assistants (Claude Code, Copilot, Cursor…) go in `aiTools`, never in `techStack` or `skills.json` (owner decision 2026.10: they are shown on a separate line so the stack doesn’t read as AI-dependent).
9. Skills: for each `techStack` item not in `content/skills.json` (validator warns), ask whether to add it to 개발 역량 and under which group. Keep spelling identical. Also ask whether it is **core** or **supporting**: supporting libraries / SDKs / small tools (e.g. React Router, React Hook Form, Axios, shadcn/ui, social-login SDKs, esbuild — owner decision 2026.10) get `"home": false` — hidden from the home stack, the list filter and the cards, and listed on the project page under 라이브러리 with their `techNotes`. Every supporting tech needs a `techNotes` entry, since the detail page is the only place it is explained.
10. Ask where it goes in `content/project-order.json` (the owner's order for home and the list; unlisted projects follow, newest first).

## Project update (from the update prompt)

For a project already on the site, the owner runs `docs/prompts/project-update.md` in that project and brings back `portfolio-export/<id>.factsheet.md`, `<id>.json`, `<id>.changes.md` (+ `images/`).

1. The update JSON was built from the site's current JSON, so compare it with `content/projects/<id>.json` field by field (`changes.md` lists the intended edits). Anything changed that `changes.md` doesn't explain — especially a sentence that undoes an earlier fact-check fix — is a mistake: keep the current text.
2. Keep the portfolio-owned fields as they are: `related`, `logo`, `thumbnail`, `screenshots` (and the project's place in `project-order.json`). New images from `images/` are prepared and added here, as in step 5 above.
3. Replace `content/sources/projects/<id>.md` with the updated fact sheet (it keeps the earlier dates and marks new lines `(갱신 …)`).
4. Run the `content-fact-checker` on the changed fields. Resolve every finding as in step 4 above.
5. From `changes.md`: add any new award (and its logo) under `content/awards/` with the award also in the project's `outcomes` first line; add or update the related activity; ask core-vs-supporting for new techs (step 9); fix stale "결과 대기 중" text in activities too. A club/program project: relate it to the activity, give a club activity a short `shortTitle` (filter chip name, e.g. "KWEB"), and set `activity` on the matching `education.json` career item so the 경력 row links its projects (one → the project, two or more → the list filtered by `?activity=<id>`).

## Other kinds (from the owner's answers)

Interview with short, concrete questions — only the fields the schema needs, both languages. Offer an English translation for the owner to approve rather than asking them to write it. Examples:

- 수상: 대회/상 이름, 상 등급, 주최, 날짜(YYYY-MM), 관련 프로젝트, 증빙 링크, 대회 로고(있으면 정사각형으로 맞춰 `public/images/awards/<id>.png`, `logo`에 경로 — 없으면 메달 아이콘이 대신 보임). 상장 사진은 팀원 실명·직인이 있으면 올리지 않습니다. **관련 프로젝트가 있으면 그 프로젝트의 `outcomes` 첫 줄에도 같은 수상을 적습니다**(예: "2026 InThon 해커톤(고려대학교 정보대학 주최) 대상 수상, 발표 및 시연", 주인 규칙 2026.11) — 상세 "결과" 아래에 수상 링크가 자동으로 붙고, 카드에 보이게 하려면 `highlights` 첫 줄에도 넣습니다. 결과 대기 중이라고 적어 둔 `outcomes`·활동 설명도 함께 고칩니다
- 활동: 활동명, 기관, 유형, 기간, 역할, 한 일, 관련 프로젝트 (필수 — 활동은 홈 섹션이 없고(주인 결정 2026.10) 관련 프로젝트 상세 머리에 "…에서 만든 프로젝트" 표지로만 보입니다. 관련 프로젝트가 없으면 어디에도 안 보이고 검사기가 경고합니다)
- 학력: 학교, 전공, 학위, 재학 상태, 기간 (모르는 항목은 비워 둠)
- 경력: 기관·단체, 역할, 기간 (모르는 항목은 비워 둠)

Numbers (participants, users, ranks) only when the owner states them.

## Finish

1. `npm run validate:content` → 0 errors. Warnings about TODO / skills must be explained to the user.
2. `npm run build`, then use the `verify` skill to look at the affected pages in ko and en.
3. Commit on the current `dev/` branch: `content: add <kind> <id>`.
