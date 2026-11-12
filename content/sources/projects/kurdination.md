# KUrdination 팩트시트

- 조사일: 2026-11-12
- 저장소: https://github.com/ritsucord/kweb-when-to-meet (공개) / 기준 커밋: `e76a5c2` (origin/main)
- 내 git 신원: gaudium1257, 김태호 (Taeho Kim) (사용자 답변)

상태 표시: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: 조직 멤버의 일정을 주간 캘린더로 조율하는 웹앱 ✅ (`frontend/src/App.tsx`, `shared/src/schemas.ts`)
- 목적: When2meet을 보완하는 일정 조율 사이트 ✅ (사용자 답변). 로그인 화면 문구 "조직을 만들고 초대한다 / 각자 되는 시간을 올린다 / 겹치는 시간을 확정한다"와 맞음
- 맥락: 웹 개발 학회 KWEB 활동 ✅ (사용자 답변, 루트 `package.json`의 `"author": "KWEB"`)

## 2. 기간·팀

- 기간: 2026-10 ~ 진행 중 (첫 커밋 `6c3477e` 2026-10-13, main 마지막 머지 `e76a5c2` 2026-11-09) ✅
- 내 작업 기간: 2026-11-08 ~ 2026-11-09 ✅
- 커밋(참고용, 기여도 아님): 전체 23 / 내 커밋 13 (머지 커밋 5개 포함) ✅ (`git rev-list --all --count`)
- 팀 인원·내 역할: 5명, 프론트엔드 ✅ (사용자 답변). 팀원 이름과 GitHub 아이디는 비공개 (사용자 답변)

## 3. 내가 한 일 (사용자 확인 ✅)

1. `shared` 계약에서 타입을 추론하는 oRPC 클라이언트, 전역 401 처리, 상태 코드별 한국어 오류 문구, UTC↔로컬 시간 변환, Vite `/api` 프록시 (`00c26fc`, PR #1)
2. 가입·로그인·로그아웃, 세션 복원, 로그인 여부에 따른 라우트 보호 (`d9a4035`)
3. 조직 목록·생성, 멤버 목록·내보내기·탈퇴, 조직 삭제 (`77d9ec7`)
4. 초대 보내기·취소·대기 목록, 받은 초대 수락·거절과 취소된 초대(409) 안내 (`62e1051`)
5. 주간 캘린더(겹치는 일정 열 배치, 여러 날 일정 분할), 일정 생성, 상태 변경, 필터, "내 가능 시간" 프리셋 (`5e72451`, `frontend/src/events/week.ts`)
6. shadcn/ui + Tailwind CSS 디자인 시스템과 문서 페이지, 3단계 반응형, 라이트/다크 테마 (`37e49e8`, PR #5)
7. 버그 수정 3건 (`ac70623`, `37e49e8`), 앱 이름을 KUrdination으로 변경 (`a0566f5`), PR #1~#5 머지
8. 헤드리스 Chromium E2E로 동작 검증: PR #2는 인증 8·조직 16·초대 17·일정 16단계, PR #5는 회귀 19개 항목과 4개 너비 × 6개 페이지 가로 넘침 0 (PR 본문, 사용자 확인. 스크립트는 저장소에 없음)

- AI 도구: Claude Code ✅ (내 커밋 8개 모두 `Co-Authored-By: Claude` 트레일러, PR #2~#5 본문, 사용자 답변)

## 4. 핵심 기능 (main에 구현된 것만)

- 계정과 세션: 가입·로그인·로그아웃, 새로고침 시 복원, 만료되면 로그인 화면으로 이동 ✅ (`frontend/src/auth/AuthProvider.tsx`, `frontend/src/api/client.ts`)
- 조직과 멤버: 만든 사람이 관리자. 관리자는 멤버를 내보내거나 조직을 삭제할 수 있고, 마지막 관리자는 탈퇴할 수 없음 ✅ (`frontend/src/org/MembersPage.tsx`, `shared/FRONTEND_GUIDE.md` 5장)
- 이메일 초대: 관리자가 보내고 취소함. 받은 사람은 수락하거나 거절함. 유효 기간 7일 ✅ (`frontend/src/org/InvitesPage.tsx`, `frontend/src/pages/MyInvitesPage.tsx`, `FRONTEND_GUIDE.md` 5장)
- 주간 일정 캘린더: 빈 칸을 눌러 생성, 겹치는 일정은 나란히 표시, 상태와 "내 참여만" 필터 ✅ (`frontend/src/events/*`)
- 미확정·확정 상태: 만든 사람이나 관리자가 변경. "내 가능 시간" 프리셋은 나만 참여하는 미확정 일정을 만듦 ✅ (`EventForm.tsx:48-53`, `EventsPage.tsx:101`)
- 반응형(~767 / 768~1279 / 1280px~)과 다크 모드 ✅ (`EventsPage.tsx:30-35`, `frontend/src/components/theme.tsx`)

## 5. 구조

- npm workspaces 모노레포(`shared` / `backend` / `frontend`)입니다. `shared`의 oRPC 계약과 Zod 스키마를 백엔드와 프론트엔드가 함께 import합니다. ✅
- React 클라이언트가 `/api`를 호출하면 Express 위의 oRPC 핸들러(`backend/src/app.ts`)가 도메인 정책(`util.ts`)과 저장소 계층(`registry.ts`)을 거쳐 SQLite(`db.ts`)에 저장합니다. ✅
- 개발 중에는 Vite 프록시가 `/api`를 `localhost:3000`으로 넘깁니다(백엔드에 CORS 설정 없음). 외부 API는 없습니다. ✅ (`frontend/vite.config.ts:15-17`)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술           | 근거                                                                               |
| -------- | -------------- | ---------------------------------------------------------------------------------- |
| language | TypeScript     | 전 패키지                                                                          |
| frontend | React          | `frontend/src/*`                                                                   |
| frontend | Vite           | `frontend/vite.config.ts` (앱 + 디자인 문서 두 entry)                              |
| frontend | Tailwind CSS   | `frontend/vite.config.ts`, `frontend/src/index.css:1`                              |
| frontend | shadcn/ui      | `frontend/components.json`, `frontend/src/components/ui/*`                         |
| frontend | React Router   | `frontend/src/App.tsx`                                                             |
| frontend | Radix UI       | `frontend/src/components/ui/*` 11개 파일                                           |
| backend  | Node.js        | `backend/src/index.ts`, `node:test` 테스트                                         |
| backend  | Express        | `backend/src/app.ts`                                                               |
| backend  | oRPC           | `shared/src/schemas.ts`, `backend/src/app.ts`, `frontend/src/api/client.ts`        |
| database | SQLite         | `backend/src/db.ts`, `registry.ts` (better-sqlite3)                                |
| other    | Zod            | `shared/src/schemas.ts`, `EventForm.tsx`의 `safeParse`, `frontend/src/lib/form.ts` |
| tooling  | npm workspaces | 루트 `package.json`                                                                |

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변). 팀원 PR 3개(#6~#8)가 열려 있음
- 배포: 미배포 ✅ (사용자 답변, 배포 설정 파일 없음)
- 테스트: 백엔드 38개 통과 ✅ (2026-11-12 `node --harmony-temporal --import tsx --test src/*.test.ts`로 직접 실행, 팀원 작성). 기본 `npm test`는 Node 24에서 `Temporal is not defined`로 실패 ✅
- CI 없음, 프론트엔드 린트 크래시 ✅ (2026-11-12 직접 실행), LICENSE 파일 없음(`package.json`에 ISC)

## 8. 결과

- 없음. 진행 중 ✅ (사용자 답변)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 조직 탭 옆 세로 스크롤바 → 해결: 음수 margin을 `box-shadow: inset`으로 바꾸고 `overflow-y: hidden` 적용 ✅ (`ac70623`, PR #3)
- 문제: 조직 ID의 콜론이 `%3A`로 인코딩되면 현재 탭 표시가 사라짐 → 해결: 경로를 디코딩한 뒤 비교 ✅ (`37e49e8`, `frontend/src/org/OrgLayout.tsx:83-86`)
- 문제: 긴 조직 이름 때문에 사이드바에 가로 스크롤 → 해결: `min-w-0`과 말줄임 처리 ✅ (`37e49e8`, `frontend/src/components/Layout.tsx:88,131`)
- 문제: 서버의 400 응답이 틀린 필드를 알려주지 않음 → 해결: 보내기 전에 `shared` Zod 스키마로 검증해 필드별 오류 표시 ✅ (`frontend/src/lib/form.ts`, `EventForm.tsx:68-78`)
- 문제: 새로고침 때 다크 테마가 깜빡임 → 해결: React보다 먼저 인라인 스크립트로 테마 적용 ✅ (`frontend/index.html:9-13`)

## 10. 링크

- GitHub: https://github.com/ritsucord/kweb-when-to-meet (사용자 허락)
  - 🟡 주의: 링크 주소에 저장소 주인인 팀원의 GitHub 아이디가 들어 있습니다. 팀원 아이디를 비공개로 하기로 한 답변과 충돌하므로, 사이트에 올리기 전에 링크를 유지할지 다시 확인하세요.

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

## 12. 관련 활동·수상·경력 (사용자 답변)

- 웹 개발 학회 KWEB

## 13. 배운 점 (사용자 답변)

- 비움. 아래는 기록에 근거한 초안이고, 본인이 고르거나 고친 뒤에만 사용하세요. 🟡
  - "서버와 공유하는 API 계약에서 타입을 추론하니, 백엔드 명세가 바뀌면 프론트엔드에서 컴파일 오류로 바로 드러났다." (근거: `frontend/src/api/client.ts`)
  - "디자인을 전면 개편할 때 기능 회귀를 E2E로 확인하면서 바꾸니 기능을 깨지 않고 바꿀 수 있었다." (근거: PR #5)
  - "서버 동작을 정리한 가이드 문서를 기준으로 화면의 예외 처리(409, 401)를 설계했다." (근거: `frontend/src/pages/MyInvitesPage.tsx:84`)

## 14. 제외한 내용과 이유

- 가능 시간 선택·겹침 화면: PR #8 미병합, mock 데이터 기반, 팀원 작업
- 백엔드 공통 가능 시간 계산: 브랜치만 있고 PR이 없어 미병합, 팀원 작업
- 프론트엔드 Vitest 테스트, 프론트엔드 CI: PR #6·#7 미병합, 팀원 작업
- 역할 관리, 비밀번호 변경, 계정 삭제: `backend/src/util.ts`에만 있고 API로 노출되지 않음
- 일정 수정·삭제, 조직 정보 수정: 엔드포인트 없음 (`FRONTEND_GUIDE.md` 6장)
- ESLint: 설정은 있지만 실행이 크래시해서 기술 스택에서 제외
- 백엔드 권한 모델·세션 해시 등: 구현은 확인했지만 팀원 작업이라 "내가 한 일"과 하이라이트에서 제외
- 팀원 이름과 GitHub 아이디: 비공개 요청
- 줄 수 통계: lockfile이 섞여 있고 기여도를 보여주지 않음

## 포트폴리오 저장소 반영 기록 (2026-11-13)

- 사실 확인 후 수정: 이메일 "발송"으로 읽히던 초대를 "이메일 주소로 초대"로, 근거 없던 태블릿 주간 보기를 "3단계 반응형·휴대폰 하루 보기"로, techNotes의 세부 목록을 근거 범위로 줄임, 영문 "club"→"society"(KWEB 표기 통일), "멤버 관리"→"멤버 목록·내보내기"
- GitHub 링크: 10번 🟡(주소에 팀원 아이디 포함)라 주인 확인 전까지 JSON에서 뺌
- 이미지: 02(날짜 입력칸 깨짐)는 넣지 않음. 아이콘 없음(영문 첫 글자 칸)
- 활동 표지: `content/activities/kweb.json` (학회원, 2026-09~)
