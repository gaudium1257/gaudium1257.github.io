# KUrdination 팩트시트

- 조사일: 2026-11-12
- 갱신일: 2026-11-26
- 저장소: https://github.com/ritsucord/kweb-when-to-meet (공개) / 기준 커밋: `e76a5c2` (origin/main)
- 저장소: https://github.com/ritsucord/kweb-when-to-meet (공개) / 이번 기준 커밋: `35189f6` (origin/main, PR #11 머지) (갱신 2026-11-26)
- 내 git 신원: gaudium1257, 김태호 (Taeho Kim) (사용자 답변)
- 내 git 신원: gaudium1257 · 김태호 (Taeho Kim) · twehokim@gmail.com, 지금도 맞음 (사용자 답변 2026-11-26) (갱신 2026-11-26)

상태 표시: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: 조직 멤버의 일정을 주간 캘린더로 조율하는 웹앱 ✅ (`frontend/src/App.tsx`, `shared/src/schemas.ts`)
- 목적: When2meet을 보완하는 일정 조율 사이트 ✅ (사용자 답변). 로그인 화면 문구 "조직을 만들고 초대한다 / 각자 되는 시간을 올린다 / 겹치는 시간을 확정한다"와 맞음
- 맥락: 웹 개발 학회 KWEB 활동 ✅ (사용자 답변, 루트 `package.json`의 `"author": "KWEB"`)

## 2. 기간·팀

- 기간: 2026-10 ~ 진행 중 (첫 커밋 `6c3477e` 2026-10-13, main 마지막 머지 `e76a5c2` 2026-11-09) ✅
- 기간: 2026-10 ~ 진행 중 (main 마지막 머지 `35189f6` 2026-11-25, 진행 중은 사용자 답변 2026-11-26) ✅ (갱신 2026-11-26)
- 내 작업 기간: 2026-11-08 ~ 2026-11-09 ✅
- 내 작업 기간(추가): 2026-11-24 ~ 2026-11-25 ✅ (`ec51bd4`, `037580a`, `00a5d51`, PR #9~#11 머지) (갱신 2026-11-26)
- 커밋(참고용, 기여도 아님): 전체 23 / 내 커밋 13 (머지 커밋 5개 포함) ✅ (`git rev-list --all --count`)
- 커밋(참고용, 기여도 아님): 전체 34 / 내 커밋 24 (머지 커밋 13개 포함) ✅ (2026-11-26 `git rev-list --all --count`, `--author` 신원 3개) (갱신 2026-11-26)
  - 기준 커밋 이후 origin/main에 새 커밋 14개: 내 커밋 11개(머지 8개), 팀원 3개 (`git log e76a5c2..origin/main`) (갱신 2026-11-26)
- 팀 인원·내 역할: 5명, 프론트엔드 ✅ (사용자 답변). 팀원 이름과 GitHub 아이디는 비공개 (사용자 답변)
- 역할 변화: 프론트엔드 그대로. CI·린트·README 작업은 "도움을 준 정도"로 반영 ✅ (사용자 답변 2026-11-26) (갱신 2026-11-26)

## 3. 내가 한 일 (사용자 확인 ✅)

1. `shared` 계약에서 타입을 추론하는 oRPC 클라이언트, 전역 401 처리, 상태 코드별 한국어 오류 문구, UTC↔로컬 시간 변환, Vite `/api` 프록시 (`00c26fc`, PR #1)
2. 가입·로그인·로그아웃, 세션 복원, 로그인 여부에 따른 라우트 보호 (`d9a4035`)
3. 조직 목록·생성, 멤버 목록·내보내기·탈퇴, 조직 삭제 (`77d9ec7`)
4. 초대 보내기·취소·대기 목록, 받은 초대 수락·거절과 취소된 초대(409) 안내 (`62e1051`)
5. 주간 캘린더(겹치는 일정 열 배치, 여러 날 일정 분할), 일정 생성, 상태 변경, 필터, "내 가능 시간" 프리셋 (`5e72451`, `frontend/src/events/week.ts`)
6. shadcn/ui + Tailwind CSS 디자인 시스템과 문서 페이지, 3단계 반응형, 라이트/다크 테마 (`37e49e8`, PR #5)
7. 버그 수정 3건 (`ac70623`, `37e49e8`), 앱 이름을 KUrdination으로 변경 (`a0566f5`), PR #1~#5 머지
8. 헤드리스 Chromium E2E로 동작 검증: PR #2는 인증 8·조직 16·초대 17·일정 16단계, PR #5는 회귀 19개 항목과 4개 너비 × 6개 페이지 가로 넘침 0 (PR 본문, 사용자 확인. 스크립트는 저장소에 없음)
9. ESLint 크래시 해결: 루트로 올라간 `ts-api-utils`가 루트의 TypeScript 7(JS API 없음)을 잡아 크래시 → 루트 `package.json`에 `typescript ~6.0.2` 고정. 이어서 드러난 린트 오류 수정(`useApi`·`AuthProvider`의 effect 안 setState, shadcn 파일의 export 규칙) (`ec51bd4`, PR #9). 2026-11-26 `npm run lint -w frontend` 오류 없음 ✅ (갱신 2026-11-26)
10. 프론트엔드 CI에 단위 테스트 단계(`npm test -w frontend`) 추가, `frontend/README.md`를 Vite 템플릿에서 프로젝트 안내로 교체, `rm -rf dist`를 Node 한 줄 명령으로 바꿔 Windows에서도 동작 (`037580a`, PR #10). CI 워크플로 자체는 팀원 작업(PR #6) ✅ (갱신 2026-11-26)
11. 가능 시간 탭 구간 변환: 선택한 30분 칸 ↔ `[start, end)` UTC 구간 변환(인접 칸 병합, 빈칸 분할, 자정 넘김 병합), 칸별 가능한 사람 계산 (`frontend/src/availability/slots.ts`, `00a5d51`). 단위 테스트 12개 작성, 2026-11-26 `TZ=UTC / America/New_York / Asia/Kolkata npx vitest run src/availability/slots.test.ts` 모두 12/12 통과 ✅ (갱신 2026-11-26)
12. 가능 시간 탭 화면 완성: 데이터 경계 `AvailabilitySource`와 메모리 mock(예상 백엔드 계약을 주석으로 정리), 주별 임시 저장·저장·되돌리기, 디자인 토큰 기반 겹침 농도, "모두 가능·가장 많이 겹침" 구간, 누른 칸의 가능한 사람 표시, #8 리뷰 사항(다크 모드 글자색, 하드코딩 색상·인원) 수정 (`frontend/src/availability/source.ts`, `AvailabilityPage.tsx`, `00a5d51`, PR #11). 드래그 선택 로직은 팀원 PR #8의 것을 유지 ✅ (갱신 2026-11-26)
13. PR #6~#11 머지 (PR API, 머지 커밋 작성자 김태호) ✅ (갱신 2026-11-26)

- AI 도구: Claude Code ✅ (내 커밋 8개 모두 `Co-Authored-By: Claude` 트레일러, PR #2~#5 본문, 사용자 답변)
- AI 도구: 새 내 커밋 3개(`ec51bd4`, `037580a`, `00a5d51`)에도 `Co-Authored-By: Claude` 트레일러 ✅ (갱신 2026-11-26)

### 팀원 작업 (기준 커밋 이후, "내가 한 일"에 넣지 않음) (갱신 2026-11-26)

- 프론트엔드 CI 워크플로 (`3249387`, PR #6) (갱신 2026-11-26)
- Vitest 환경과 단위 테스트 10개(`week` 3, `form` 3, `time` 4) (`6a73eb9`, PR #7) (갱신 2026-11-26)
- 가능 시간 선택·겹침 UI 초안, 드래그 선택 (`eeafde6`, PR #8) (갱신 2026-11-26)

## 4. 핵심 기능 (main에 구현된 것만)

- 계정과 세션: 가입·로그인·로그아웃, 새로고침 시 복원, 만료되면 로그인 화면으로 이동 ✅ (`frontend/src/auth/AuthProvider.tsx`, `frontend/src/api/client.ts`)
- 조직과 멤버: 만든 사람이 관리자. 관리자는 멤버를 내보내거나 조직을 삭제할 수 있고, 마지막 관리자는 탈퇴할 수 없음 ✅ (`frontend/src/org/MembersPage.tsx`, `shared/FRONTEND_GUIDE.md` 5장)
- 이메일 초대: 관리자가 보내고 취소함. 받은 사람은 수락하거나 거절함. 유효 기간 7일 ✅ (`frontend/src/org/InvitesPage.tsx`, `frontend/src/pages/MyInvitesPage.tsx`, `FRONTEND_GUIDE.md` 5장)
- 주간 일정 캘린더: 빈 칸을 눌러 생성, 겹치는 일정은 나란히 표시, 상태와 "내 참여만" 필터 ✅ (`frontend/src/events/*`)
- 미확정·확정 상태: 만든 사람이나 관리자가 변경. "내 가능 시간" 프리셋은 나만 참여하는 미확정 일정을 만듦 ✅ (`EventForm.tsx:48-53`, `EventsPage.tsx:101`)
- 반응형(~767 / 768~1279 / 1280px~)과 다크 모드 ✅ (`EventsPage.tsx:30-35`, `frontend/src/components/theme.tsx`)
- 2026-11-26 대조: 위 6개 모두 그대로. 기준 커밋 이후 `events/*`, `org/*`, `pages/*`, `api/client.ts`, 백엔드·`shared` 코드는 바뀌지 않았고, `AuthProvider.tsx`는 setState 위치만 바뀜(`ec51bd4`) ✅ (갱신 2026-11-26)
- 가능 시간 탭(`/orgs/:orgId/availability`)은 main에 있지만 서버 API 없이 메모리 mock으로 동작하므로 기능 목록에서 제외 (14번, 사용자 답변 2026-11-26) (갱신 2026-11-26)

## 5. 구조

- npm workspaces 모노레포(`shared` / `backend` / `frontend`)입니다. `shared`의 oRPC 계약과 Zod 스키마를 백엔드와 프론트엔드가 함께 import합니다. ✅
- React 클라이언트가 `/api`를 호출하면 Express 위의 oRPC 핸들러(`backend/src/app.ts`)가 도메인 정책(`util.ts`)과 저장소 계층(`registry.ts`)을 거쳐 SQLite(`db.ts`)에 저장합니다. ✅
- 개발 중에는 Vite 프록시가 `/api`를 `localhost:3000`으로 넘깁니다(백엔드에 CORS 설정 없음). 외부 API는 없습니다. ✅ (`frontend/vite.config.ts:15-17`)
- 가능 시간 탭은 `AvailabilitySource` 인터페이스(`load`, `saveMine`)를 거쳐 데이터를 읽고 씁니다. 지금 구현은 메모리 mock 하나이고, 백엔드 API가 생기면 이 파일만 바꾸도록 되어 있습니다. ✅ (`frontend/src/availability/source.ts`) (갱신 2026-11-26)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술           | 근거                                                                                                     |
| -------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| language | TypeScript     | 전 패키지                                                                                                |
| frontend | React          | `frontend/src/*`                                                                                         |
| frontend | Vite           | `frontend/vite.config.ts` (앱 + 디자인 문서 두 entry)                                                    |
| frontend | Tailwind CSS   | `frontend/vite.config.ts`, `frontend/src/index.css:1`                                                    |
| frontend | shadcn/ui      | `frontend/components.json`, `frontend/src/components/ui/*`                                               |
| frontend | React Router   | `frontend/src/App.tsx`                                                                                   |
| frontend | Radix UI       | `frontend/src/components/ui/*` 11개 파일                                                                 |
| backend  | Node.js        | `backend/src/index.ts`, `node:test` 테스트                                                               |
| backend  | Express        | `backend/src/app.ts`                                                                                     |
| backend  | oRPC           | `shared/src/schemas.ts`, `backend/src/app.ts`, `frontend/src/api/client.ts`                              |
| database | SQLite         | `backend/src/db.ts`, `registry.ts` (better-sqlite3)                                                      |
| infra    | GitHub Actions | `.github/workflows/frontend.yml`, 2026-11-25 main `35189f6` 실행 성공 (갱신 2026-11-26)                  |
| other    | Zod            | `shared/src/schemas.ts`, `EventForm.tsx`의 `safeParse`, `frontend/src/lib/form.ts`                       |
| tooling  | npm workspaces | 루트 `package.json`                                                                                      |
| tooling  | Vitest         | `frontend/package.json` `"test": "vitest run"`, 테스트 파일 4개, 2026-11-26 22/22 통과 (갱신 2026-11-26) |
| tooling  | ESLint         | `frontend/eslint.config.js`, CI의 `npm run lint -w frontend`, 2026-11-26 오류 없음 (갱신 2026-11-26)     |

- 새 기술 3개는 모두 보조 도구 (갱신 2026-11-26)

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변). 팀원 PR 3개(#6~#8)가 열려 있음
- 개발 상태: 진행 중 ✅ (사용자 답변 2026-11-26). 팀원 PR #6~#8은 2026-11-24~25에 모두 머지됨, 열린 PR 없음 (PR API) (갱신 2026-11-26)
- 배포: 미배포 ✅ (사용자 답변, 배포 설정 파일 없음)
- 배포(갱신 2026-11-26): https://ku.hydv.kr/ 가 열림 ✅ (2026-11-26 `curl` 200, `/api/sessions/current` 401로 백엔드 응답). 사용자가 알려 준 주소
  - 응답이 빌드 결과물이 아니라 Vite 개발 서버(`/@vite/client`, `/@react-refresh`)이고, 서비스 중인 `source.ts`가 현재 main과 같은 mock 버전 ✅ (갱신 2026-11-26)
  - 그래서 `deployment.status`는 `not-deployed`로 두고 `links`에 "데모 (개발 중)"으로 넣음. 개발 중 주소를 다룬 포트폴리오 showroomz 항목과 같은 방식 (갱신 2026-11-26)
  - 누가 어디에 띄웠는지는 저장소에 근거가 없음 ❓ (배포 설정 파일 없음) (갱신 2026-11-26)
- 테스트: 백엔드 38개 통과 ✅ (2026-11-12 `node --harmony-temporal --import tsx --test src/*.test.ts`로 직접 실행, 팀원 작성). 기본 `npm test`는 Node 24에서 `Temporal is not defined`로 실패 ✅
- 테스트(갱신 2026-11-26): 백엔드 38개 통과(같은 명령 재실행), 기본 `npm test -w backend`는 여전히 `Temporal is not defined`로 실패 ✅. 프론트엔드 22개 통과(`npx vitest run`, 내가 작성 12 · 팀원 작성 10) ✅
- CI 없음, 프론트엔드 린트 크래시 ✅ (2026-11-12 직접 실행), LICENSE 파일 없음(`package.json`에 ISC)
- CI(갱신 2026-11-26): GitHub Actions "Frontend CI"(tsc → ESLint → Vitest → build) 있음, 최근 8번 모두 성공 ✅ (Actions API). 프론트엔드 린트 통과 ✅ (직접 실행). LICENSE 파일은 여전히 없음 ✅
- 릴리스 0개, 이슈 0개 ✅ (GitHub API, 2026-11-26) (갱신 2026-11-26)

## 8. 결과

- 없음. 진행 중 ✅ (사용자 답변)
- 2026-11-26 다시 확인: 결과 없음, 개발 중 ✅ (사용자 답변) (갱신 2026-11-26)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 조직 탭 옆 세로 스크롤바 → 해결: 음수 margin을 `box-shadow: inset`으로 바꾸고 `overflow-y: hidden` 적용 ✅ (`ac70623`, PR #3)
- 문제: 조직 ID의 콜론이 `%3A`로 인코딩되면 현재 탭 표시가 사라짐 → 해결: 경로를 디코딩한 뒤 비교 ✅ (`37e49e8`, `frontend/src/org/OrgLayout.tsx:83-86`)
- 문제: 긴 조직 이름 때문에 사이드바에 가로 스크롤 → 해결: `min-w-0`과 말줄임 처리 ✅ (`37e49e8`, `frontend/src/components/Layout.tsx:88,131`)
- 문제: 서버의 400 응답이 틀린 필드를 알려주지 않음 → 해결: 보내기 전에 `shared` Zod 스키마로 검증해 필드별 오류 표시 ✅ (`frontend/src/lib/form.ts`, `EventForm.tsx:68-78`)
- 문제: 새로고침 때 다크 테마가 깜빡임 → 해결: React보다 먼저 인라인 스크립트로 테마 적용 ✅ (`frontend/index.html:9-13`)
- 문제: ESLint가 "Cannot read properties of undefined (reading 'Intrinsic')"로 크래시 → 해결: 루트로 올라간 `ts-api-utils`가 TypeScript 7을 잡는 것을 찾아 워크스페이스 루트에 TypeScript 6 고정 ✅ (`ec51bd4` 커밋 메시지, 루트 `package.json`, 2026-11-26 린트 통과) (갱신 2026-11-26)
- 참고: `OrgLayout.tsx`의 디코딩 줄은 지금 87번 줄 (2026-11-26 확인) (갱신 2026-11-26)

## 10. 링크

- GitHub: https://github.com/ritsucord/kweb-when-to-meet (사용자 허락)
  - 🟡 주의: 링크 주소에 저장소 주인인 팀원의 GitHub 아이디가 들어 있습니다. 팀원 아이디를 비공개로 하기로 한 답변과 충돌하므로, 사이트에 올리기 전에 링크를 유지할지 다시 확인하세요.
  - 2026-11-26: 이 질문에 대한 새 답이 없어 JSON에서는 계속 뺌 🟡 (갱신 2026-11-26)
- 데모: https://ku.hydv.kr/ ✅ (사용자 답변 2026-11-26, 2026-11-26 접속 확인). 개발 서버라 "개발 중"으로 표기 (갱신 2026-11-26)

## 11. 이미지 후보

2026-11-12에 로컬 개발 서버를 띄워 헤드리스 Chromium으로 캡처했습니다(Asia/Seoul, 가짜 계정과 `example.com` 이메일만 사용). 웹 화면은 1440×900 뷰포트의 2배, 휴대폰은 390×844의 2배입니다. 크기 조정이나 자르기는 하지 않았습니다.

| 파일 (`images/` 사본)         | 종류          | 크기      | 무엇을 보여주는지                                         | 원본 경로                               |
| ----------------------------- | ------------- | --------- | --------------------------------------------------------- | --------------------------------------- |
| `images/01-events-week.png`   | 웹 화면       | 2880×1800 | 주간 캘린더(확정·미확정 블록, 겹친 일정)와 일정 상세 패널 | 로컬 캡처 (`/orgs/:orgId/events`)       |
| `images/02-event-create.png`  | 웹 화면       | 2880×1800 | "내 가능 시간으로 설정"을 누른 일정 만들기 패널           | 로컬 캡처 (`/orgs/:orgId/events`)       |
| `images/03-members.png`       | 웹 화면       | 2880×1800 | 멤버 목록과 역할, 내보내기, 조직 나가기·삭제              | 로컬 캡처 (`/orgs/:orgId/members`)      |
| `images/04-org-invites.png`   | 웹 화면       | 2880×1800 | 멤버 초대 폼과 대기 중인 초대(만료일) 목록                | 로컬 캡처 (`/orgs/:orgId/invites`)      |
| `images/05-events-dark.png`   | 웹 화면       | 2880×1800 | 다크 모드의 주간 캘린더와 일정 상세                       | 로컬 캡처 (`/orgs/:orgId/events`, 다크) |
| `images/06-events-mobile.png` | 앱 화면(세로) | 780×1688  | 휴대폰 날짜 선택 줄과 하루 보기, 겹친 미확정 일정 3개     | 로컬 캡처 (390px 너비)                  |
| `images/07-login.png`         | 웹 화면       | 2880×1800 | 로그인 화면과 "모두가 되는 시간을, 한 번에." 소개 문구    | 로컬 캡처 (`/login`)                    |
| `images/08-design-system.png` | 웹 화면       | 2880×1800 | 디자인 시스템 문서 페이지(원칙, 토큰)                     | 로컬 캡처 (`/design-system.html`)       |

- `02-event-create.png`: 날짜 입력칸이 `11/13/2026, 03…`처럼 영어식으로 잘려 보입니다. 헤드리스 Chromium이 그리는 방식 때문이니 거슬리면 빼거나 다시 찍으세요.
- 아이콘: 비움 (사용자 답변). `frontend/public/favicon.svg`는 Vite 기본 로고라 제외했습니다.
- 가로 대표 이미지(스토어 그래픽, OG 이미지, 배너): 저장소에 없음.
- 2026-11-26: 조직 화면 탭 줄에 "가능 시간" 탭이 생겨(`OrgLayout.tsx:71`) 01·03·04·05·06의 탭 줄은 지금 앱과 다릅니다. 내용은 그대로입니다 🟡 (갱신 2026-11-26)
- 2026-11-26: 새 캡처는 하지 못했습니다. Chromium은 받았지만 실행에 필요한 시스템 라이브러리(apt) 설치가 권한 단계에서 막혔습니다. 새 이미지 파일 없음 (갱신 2026-11-26)
- 다시 찍는다면 가능 시간 탭 화면은 "※ 시범 화면" 안내와 "예시 팀원 A·B" 이름이 보입니다(`AvailabilityPage.tsx:272-274`, `source.ts`). 실명은 아님 (갱신 2026-11-26)
- 아이콘: 변화 없음. `favicon.svg`는 여전히 Vite 기본 로고 (기준 커밋 이후 `frontend/public` 변경 없음) (갱신 2026-11-26)

## 12. 관련 활동·수상·경력 (사용자 답변)

- 웹 개발 학회 KWEB
- 2026-11-26: 새 수상·활동 없음 (사용자 답변) (갱신 2026-11-26)

## 13. 배운 점 (사용자 답변)

- 비움. 아래는 기록에 근거한 초안이고, 본인이 고르거나 고친 뒤에만 사용하세요. 🟡
  - "서버와 공유하는 API 계약에서 타입을 추론하니, 백엔드 명세가 바뀌면 프론트엔드에서 컴파일 오류로 바로 드러났다." (근거: `frontend/src/api/client.ts`)
  - "디자인을 전면 개편할 때 기능 회귀를 E2E로 확인하면서 바꾸니 기능을 깨지 않고 바꿀 수 있었다." (근거: PR #5)
  - "서버 동작을 정리한 가이드 문서를 기준으로 화면의 예외 처리(409, 401)를 설계했다." (근거: `frontend/src/pages/MyInvitesPage.tsx:84`)
- 2026-11-26: 사용자가 "추가할 게 있다면 너가 추가해"라고 맡김. 기록에 근거해 아래 2개를 JSON에 넣음 ✅ (사용자 답변) (갱신 2026-11-26)
  - "서버와 공유하는 API 계약에서 타입을 추론하면 백엔드 명세 변경이 프론트엔드에서 컴파일 오류로 바로 드러난다는 것을 배웠다." (근거: `frontend/src/api/client.ts`, 위 첫 초안) (갱신 2026-11-26)
  - "백엔드 API가 없어도 데이터 경계를 먼저 정해 두면 화면과 변환 로직을 미리 만들고 테스트할 수 있다는 것을 배웠다." (근거: `frontend/src/availability/source.ts`, `slots.test.ts`, `00a5d51`) (갱신 2026-11-26)

## 14. 제외한 내용과 이유

- 가능 시간 선택·겹침 화면: PR #8 미병합, mock 데이터 기반, 팀원 작업
  - 2026-11-26: PR #8과 내 후속 PR #11이 main에 병합됨. 그래도 서버 API가 없고(백엔드·`shared`에 availability 0건) 메모리 mock으로만 동작해서 features에서 제외(사용자 답변 a). 내 작업은 contributions에만 "백엔드 연동 전"을 붙여 넣음 (갱신 2026-11-26)
- 백엔드 공통 가능 시간 계산: 브랜치만 있고 PR이 없어 미병합, 팀원 작업
  - 2026-11-26: 그대로(`feature/availability-overlap` 브랜치만 있음, PR 없음) (갱신 2026-11-26)
- 프론트엔드 Vitest 테스트, 프론트엔드 CI: PR #6·#7 미병합, 팀원 작업
  - 2026-11-26: 둘 다 병합되어 실제로 쓰이므로 기술 스택에 추가. 테스트 10개와 CI 워크플로는 팀원 작업이라 "내가 한 일"에서는 제외 (갱신 2026-11-26)
- 역할 관리, 비밀번호 변경, 계정 삭제: `backend/src/util.ts`에만 있고 API로 노출되지 않음
- 일정 수정·삭제, 조직 정보 수정: 엔드포인트 없음 (`FRONTEND_GUIDE.md` 6장)
- ESLint: 설정은 있지만 실행이 크래시해서 기술 스택에서 제외
  - 2026-11-26: `ec51bd4`로 고쳐져 CI에서 실행되므로 기술 스택에 추가 (갱신 2026-11-26)
- 백엔드 권한 모델·세션 해시 등: 구현은 확인했지만 팀원 작업이라 "내가 한 일"과 하이라이트에서 제외
- 팀원 이름과 GitHub 아이디: 비공개 요청
- 줄 수 통계: lockfile이 섞여 있고 기여도를 보여주지 않음
- `deployment.status: live`: ku.hydv.kr은 Vite 개발 서버라 정식 배포로 보지 않음 (갱신 2026-11-26)
- 가능 시간 테스트의 "3개 시간대": 커밋 메시지(`00a5d51`)만 근거였는데, 2026-11-26 직접 재실행으로 확인해서 넣음 (갱신 2026-11-26)

## 포트폴리오 저장소 반영 기록 (2026-11-13)

- 사실 확인 후 수정: 이메일 "발송"으로 읽히던 초대를 "이메일 주소로 초대"로, 근거 없던 태블릿 주간 보기를 "3단계 반응형·휴대폰 하루 보기"로, techNotes의 세부 목록을 근거 범위로 줄임, 영문 "club"→"society"(KWEB 표기 통일), "멤버 관리"→"멤버 목록·내보내기"
- GitHub 링크: 10번 🟡(주소에 팀원 아이디 포함)라 주인 확인 전까지 JSON에서 뺌
- 이미지: 02(날짜 입력칸 깨짐)는 넣지 않음. 아이콘 없음(영문 첫 글자 칸)
- 활동 표지: `content/activities/kweb.json` (학회원, 2026-09~)

## 포트폴리오 저장소 반영 기록 (2026-11-26)

- contributions ESLint 줄·CI 줄: 단독 작업처럼 읽혀서 2번의 사용자 답변(「CI·린트·README 작업은 도움을 준 정도」)에 맞춰 「…을 도움」 / "Helped …"로 바꿈
- 기술: ESLint는 처음 들어오는 기술이라 보조 도구(`skills.json` `home: false`)로 추가. GitHub Actions는 이미 보조, Vitest는 이미 핵심
- 스크린샷: 새 캡처 없음 → 사이트의 7장 그대로(탭 줄에 「가능 시간」 탭이 빠져 있음)
- 데모 링크 https://ku.hydv.kr/ 는 넣지 않음 (사용자 답변 2026-11-26 「링크는 빼고」 — 누가 띄운 서버인지 근거 없음, 팀원 비공개 원칙)
