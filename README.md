# gaudium1257.github.io

개인 포트폴리오 사이트 (한국어 / English). Next.js · TypeScript · Tailwind CSS, GitHub Pages 배포.

## 빠른 시작

```bash
npm install
npm run dev          # http://localhost:3000 → /ko/
npm run check        # lint + typecheck + 콘텐츠 검증
npm run build        # out/ 정적 빌드
```

## 콘텐츠 추가

사이트 내용은 전부 `content/` 폴더의 JSON입니다. 직접 수정하기보다는 아래 흐름을 권장합니다.

1. **프로젝트**: 해당 프로젝트 폴더에서 Claude 세션을 열고 [`docs/prompts/project-fact-sheet.md`](docs/prompts/project-fact-sheet.md)의 프롬프트를 붙여넣습니다 → 질문에 답합니다 → 나온 팩트시트와 JSON을 이 저장소의 Claude 세션에 주고 "프로젝트 추가해줘".
2. **수상 · 활동 · 학력 및 경력 · 역량 · 자기소개**: 이 저장소의 Claude 세션에서 "수상 추가해줘"처럼 말하면 필요한 항목을 물어보고 채웁니다.

모든 내용은 `src/content/schema.ts` 스키마로 검증되고, 검증에 실패하면 빌드·배포가 막힙니다. `TODO`가 남아 있으면 배포 단계(strict)에서 막힙니다.

## 디자인

[`docs/prompts/design.md`](docs/prompts/design.md) — `/design` 명령으로 시안을 뽑기 위한 프롬프트입니다.

## 배포

`main`에 머지되면 GitHub Actions가 GitHub Pages로 배포합니다. 최초 1회: **Settings → Pages → Source = GitHub Actions**.

작업 규칙과 구조는 [`CLAUDE.md`](CLAUDE.md)를 참고하세요.
