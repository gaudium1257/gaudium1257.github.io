# EP-0001: 애플리케이션 스캐폴드 부트스트랩

- **상태**: ACTIVE
- **시작**: 2026-09-06
- **관련**: [ADR-0004](../../design-docs/adr/0004-single-app-admin-mode.md), [ADR-0003](../../design-docs/adr/0003-content-store.md), [ADR-0002](../../design-docs/adr/0002-layered-architecture.md), [ARCHITECTURE.md](../../../ARCHITECTURE.md)

## 목표

**공개 사이트가 뜨고, GitHub 인증으로 관리자 모드가 열리고, 편집한 글이 커밋되어 공개되는 것**까지
한 바퀴를 완주한다.

## 완료 조건 (Acceptance)

- [x] `npm install` 성공, `npm run dev` 로 사이트가 뜬다
- [x] `npm run verify`의 모든 단계(typecheck · lint · lint:arch · lint:docs · test)가 통과한다
- [x] `lint:arch`가 의도적으로 만든 위반을 실제로 잡는지 확인한다 (가짜 통과 방지)
- [x] shadcn 초기화 완료, 컴포넌트가 `src/shared/ui`를 통해 렌더된다
- [x] `content/` 의 샘플 JSON 이 Zod 파싱을 거쳐 공개 화면에 표시된다
- [x] 인증 실패 경로가 실제로 동작한다 (GitHub 401 → 화면에 사유 표시)
- [x] 프로덕션 빌드 성공, 관리자 청크 분리, 딥링크 404 폴백 생성
- [ ] **실제 토큰으로 편집 → 커밋 → 공개 반영까지 확인** (사용자만 가능 — 아래 참고)
- [ ] Pages 배포 성공 및 공개 URL 확인 (원격 푸시 후)
- [x] `ARCHITECTURE.md` 도메인 표와 `QUALITY_SCORE.md` 갱신 (INV-9)

> 마지막 두 항목은 **사용자의 자격 증명과 원격 푸시가 필요**하다.
> 에이전트는 토큰을 대신 입력하지 않는다 (docs/SECURITY.md §8).

## 범위 밖

- 실제 포트폴리오 콘텐츠 작성 (샘플 2건으로 충분)
- 이미지 업로드·리사이즈 (별도 계획)
- 다국어

## 단계

- [x] 1. `git init` + main 브랜치
- [x] 2. Vite + React 19 + TS strict + Tailwind v4 초기화, `npm install`
- [x] 3. `src/shared/content` 스키마 + `content/` 샘플 JSON
- [x] 4. `src/shared/ui` — shadcn 초기화 (생성물은 CLI 로만, INV-6)
- [x] 5. `src/domains/portfolio` — 빌드타임 로드 + 파싱 + 표시
- [x] 6. `src/shared/providers/session` — 토큰 보관(sessionStorage)
- [x] 7. `src/domains/admin` — 인증 게이트 + 편집기 + Contents API 커밋
- [x] 8. Vitest 스키마/쓰기경로 테스트 (16건)
- [x] 9. Pages 배포 워크플로 작성 (`.github/workflows/deploy.yml`)
- [x] 10. 딥링크 404 폴백 (`tools/scripts/make-404.mjs`)
- [ ] 11. 원격 연결 + 푸시 + Pages 설정 (Settings → Pages → Source: GitHub Actions)
- [ ] 12. 문서 갱신 후 이 계획을 `completed/`로 이동

## 미해결 질문

- **관리자 모드 진입점** — 현재 `/admin` + 푸터 링크. 링크를 감출지 사용자 확인 필요
  (감추는 것은 보안이 아니다 — INV-11)
- **콘텐츠 1차 엔티티 확정** — [content-model.md](../../product-specs/content-model.md) 가 DRAFT.
  현재 Profile / Project / Post 최소 3종으로 진행 중
- **편집 UX** — 현재 편집기는 JSON 직접 편집이다. 필드별 폼이 필요한지 사용자 확인 필요

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-06 | 애플리케이션 코드보다 하네스를 먼저 만든다 | 빈 저장소에서 시작할 때 환경이 먼저 갖춰져야 에이전트가 속도를 낸다 (CB-6) |
| 2026-09-06 | viewer/admin 분리를 폐기하고 단일 앱 + 관리자 모드로 전환 | 기획 변경 → [ADR-0004](../../design-docs/adr/0004-single-app-admin-mode.md) |
| 2026-09-06 | 자체 인증을 만들지 않고 GitHub 을 인증 주체로 삼는다 | 정적 사이트에서 클라이언트 판정 인증은 보안이 아니다 |
| 2026-09-06 | **TanStack Query 를 도입하지 않는다** | 콘텐츠는 빌드타임 상수라 서버 상태가 없고, 관리자 호출은 일회성 명령 3개뿐이다. 캐싱·무효화의 이득이 없어 의존성만 늘린다 (CB-7). ADR-0001 스택 목록에서 제외 |
| 2026-09-06 | 마크다운은 react-markdown 으로 렌더하고 raw HTML 플러그인을 쓰지 않는다 | 기본적으로 HTML 을 렌더하지 않아 XSS 경로가 닫힌다. XSS = 토큰 탈취 (SECURITY §4) |
| 2026-09-06 | 딥링크는 해시 라우팅 대신 404.html 폴백으로 처리 | URL 이 깔끔하게 유지된다 (스펙 P-8) |
| 2026-09-06 | shadcn CLI 의 잘못된 import 를 스크립트로 교정한다 (`npm run ui:add`) | 손으로 고치면 INV-6 을 깨므로 교정을 기계화했다 (CB-9). 무관한 `cn` 패키지 제거 |

## 잔여 작업

_(완료 시 작성)_
