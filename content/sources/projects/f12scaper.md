# F12scaper 팩트시트

- 조사일: 2026-11-26
- 저장소: https://github.com/KWEB-unstructured/F12scaper (공개, 링크 사용 승인) / 기준 커밋: `85cbfb3` (`origin/main`, Production), 로컬 `dev/gaudium1257` `5ae7350`
- 내 git 신원: `gaudium1257` (같은 이메일의 다른 작성자 이름 1개 포함. 이메일은 이 문서에 적지 않음)

상태 표시: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: 브라우저 개발자 도구로 푸는 웹 방탈출 게임 ✅ (README.md:3)
- 무엇을, 누구를 위해: 개발자 도구 기능을 써야 풀리는 8단계 퍼즐. 대상은 웹 개발을 막 배우는 대학생(1차)과 퍼즐을 좋아하는 개발자·스터디 운영자(2차) ✅ (docs/spec.md:4-6)
- 맥락: KWEB 학회에서 진행하는 웹 개발 프로젝트 ✅ (사용자 답변)

## 2. 기간·팀

- 기간: 2026-11 ~ 진행 중 (첫 커밋 `f738102` 2026-11-03, 마지막 커밋 `5ae7350` 2026-11-26) ✅
- 커밋(참고용): 병합·stash를 뺀 전체 34개 중 내 커밋 15개 ✅ (`git log`)
- 팀 인원·내 역할: 3명, 백엔드·배포 리드 ✅ (CLAUDE.md "담당", prompts/kim-backend.md:1, 사용자 답변). 팀원 이름·GitHub ID 비공개
- AI 도구: Claude Code ✅ (내 커밋 15개 중 11개에 `Co-Authored-By: Claude` 트레일러, 사용자 답변)

## 3. 내가 한 일

모두 ✅ (git 작성자 기록 + 사용자 확인)

1. Vite·Vercel Functions·Supabase 프로젝트 뼈대, 팀 작업 규칙(CLAUDE.md), 팀원별 Claude Code 작업 프롬프트 (`d6c1e49`)
2. API 요청·응답 명세 작성과 관리 (docs/contracts.md, `3341ed7` `0ecb501` `be37311`)
3. 세션 시작 API와 닉네임 검증(길이·비속어·보이지 않는 문자) (api/start.js, api/_lib/profanity.js, `cbf6903`)
4. 최종 키 검증 API와 PL/pgSQL 함수 `finish_session`: 멱등 처리, 오답 50회 제한, 행 잠금, 한 트랜잭션 (api/verify.js, supabase/migrations/002_finish_session.sql, `3526f12` `e524905`)
5. 랭킹 API, 같은 기록은 같은 순위 (api/ranking.js)
6. DB 스키마, RLS, 함수 실행 권한 회수 (supabase/schema.sql, migrations/002)
7. 5·8단계 퍼즐의 서버 API와 화면 (api/stage5.js, src/stages/stage5.js, src/stages/stage8.js, `2c23903` `69e155c` `1b34c18`)
8. Vercel 런타임을 흉내 내는 로컬 개발용 Vite API 플러그인 (vite.config.js, `d6c1e49` `38f8b4c` `e524905`)
9. Vercel 배포 설정(서울 리전, 매일 Cron, rewrite), 배포·운영·호환성 문서, 기록 분석·정리 SQL (vercel.json, docs/deploy.md, docs/operations.md, docs/compat-checklist.md, supabase/queries/, `0ecb501` `03666cb`)
10. 팀원 담당 코드에서 요청 필드가 정답을 덮어쓰던 버그 수정 (`6a003d3`, PR #17)

## 4. 핵심 기능 (구현 확인된 것만, 팀 전체)

- 개발자 도구 퍼즐 8단계 ✅ (src/stages/stage1~8.js)
- 프롤로그와 단계 사이 이야기 장면 ✅ (src/screens/prologue.js, src/ui/interlude.js)
- 단계별 힌트 3개와 시간 감점 ✅ (src/core/rules.js)
- 서버 시각 기준 기록, 상위 50명 랭킹, 노힌트 표시 ✅ (migrations/002, api/ranking.js, src/screens/ranking.js:30)
- 정답 보호: 1~7단계는 해시만, 최종 키는 서버 환경변수에만 ✅ (src/core/hash.js, api/verify.js)
- 진행 저장(localStorage) ✅ (src/core/state.js)

## 5. 구조

- Vanilla JavaScript 클라이언트 → Vercel Functions(서울 `icn1`) → Supabase PostgreSQL(서버 전용 키, RPC `finish_session`) ✅ (src/core/api.js, vercel.json, api/_lib/supabase.js)
- 점수 규칙 파일을 브라우저와 서버가 같이 import ✅ (src/core/rules.js, api/verify.js)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술             | 근거                                                              |
| -------- | ---------------- | ----------------------------------------------------------------- |
| language | JavaScript       | src/, api/ (ES 모듈, JSDoc)                                       |
| language | SQL              | supabase/schema.sql, migrations/002 (PL/pgSQL), supabase/queries/ |
| frontend | HTML             | index.html, 퍼즐 마크업                                           |
| frontend | CSS              | src/styles/                                                       |
| backend  | Vercel Functions | api/*.js                                                          |
| backend  | Node.js          | `node:crypto` (api/start.js), `Buffer` (api/_lib/http.js)         |
| database | Supabase         | api/_lib/supabase.js (`@supabase/supabase-js` import)             |
| database | PostgreSQL       | supabase/schema.sql, migrations/002                               |
| infra    | Vercel           | vercel.json (regions, rewrites, crons)                            |
| tooling  | Vite             | vite.config.js, package.json                                      |

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변. 8단계 조합 규칙 TODO `src/stages/stage8.js:13`)
- 배포: Vercel / https://f12scaper.vercel.app / 2026-11-26 접속 확인 ✅
  - `/` 200, `/api/ranking` 200(mock 아님 → 실제 DB 연결)

## 8. 결과

- 아직 없음 (개발 중, 사용자 답변)

## 9. 문제와 해결 (근거 있는 것만)

- 같은 세션의 제출이 겹치거나 처리 중간에 실패하면 기록이 어긋날 수 있음 → PL/pgSQL 함수 하나로 묶고 행 잠금, 이미 클리어한 세션에는 저장된 결과 반환 ✅ (`3526f12`)
- Content-Type 없이 보낸 요청 본문이 문자열로 도착 → 문자열도 JSON으로 해석, 로컬 서버도 같은 규칙 적용 ✅ (`e524905`, api/_lib/http.js)
- Supabase 무료 프로젝트는 7일 동안 요청이 없으면 일시정지 → 매일 Vercel Cron ✅ (`0ecb501`)
- 브라우저용 키로 DB 함수 호출 가능 → 실행 권한 회수 ✅ (migrations/002)
- 광고 차단 확장이 이름 때문에 요청을 막을 수 있음 → 이름 규칙, 필터 목록 대조 자동 점검에서 막히는 요청 0개 ✅ (CLAUDE.md 규칙 8, docs/compat-checklist.md 1절. Claude 자동 점검 결과이며 넣기로 사용자 승인)

## 10. 링크

- GitHub: https://github.com/KWEB-unstructured/F12scaper ✅ (사용자 승인)
- 데모: https://f12scaper.vercel.app ✅ (사용자 승인, 2026-11-26 접속 확인)

## 11. 이미지 후보

로컬 개발 서버를 DB 없는 mock 모드로 띄워 2026-11-26에 캡처했습니다. 퍼즐 정답과 풀이 단서가 보이는 화면은 뺐습니다.

| 파일 (`images/` 사본)                | 종류    | 크기     | 무엇을 보여주는지                                                            | 원본 경로                          |
| ------------------------------------ | ------- | -------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| `images/01-start.png`                | 웹 화면 | 1440×900 | 시작 화면: 제목, 접속하기·랭킹 보기 버튼, 윤리 안내 문구                     | 로컬 캡처 `/`                      |
| `images/02-prologue-library.png`     | 웹 화면 | 1440×900 | 프롤로그: 도서관 PC 앞 장면과 대사창                                         | 로컬 캡처 `/?scene=library`        |
| `images/03-prologue-archive.png`     | 웹 화면 | 1440×900 | 프롤로그: 모니터 속 2016년에 멈춘 블로그 "THE ARCHIVE"                       | 로컬 캡처 `/?scene=archive`        |
| `images/04-stage-screen.png`         | 웹 화면 | 1440×900 | 단계 화면 구성: 진행 표시, 타이머, 퍼즐 영역, 대사창, 정답 입력창, 힌트 버튼 | 로컬 캡처 `/?stage=1`              |
| `images/05-stage-server-request.png` | 웹 화면 | 1440×900 | 5단계: 열람 요청이 거부된 단말기 화면                                        | 로컬 캡처 `/?stage=5`              |
| `images/06-clear-record.png`         | 웹 화면 | 1440×500 | 클리어 화면: 최종 기록과 단계별 소요 시간 (테스트 데이터)                    | 로컬 캡처, 테스트 진행 데이터 주입 |
| `images/07-ranking.png`              | 웹 화면 | 1440×420 | 랭킹 표: 순위, 닉네임, 기록, 힌트 수, 노힌트 표시 (mock 데이터)              | 로컬 캡처, mock API 응답           |

- 06·07번의 기록과 닉네임은 실제 플레이 결과가 아닙니다. 대체 텍스트에 "테스트 데이터"라고 밝혀 주세요.
- 🟡 01~03번 배경은 팀원이 올린 `public/prologue/library-bg.png`(1672×941)입니다. 출처(직접 제작, AI 생성, 스톡)를 확인하기 전에는 공개하지 마세요. 원본 파일은 복사하지 않았습니다.
- 아이콘·로고·가로 대표 이미지: 없음 (사용자 답변으로 비워 둠)

## 12. 관련 활동·수상·경력 (사용자 답변)

- KWEB 학회 활동

## 13. 배운 점 (사용자 답변 "백엔드 처음, SQL 처음"을 바탕으로 작성. 🟡 문장 확인 필요)

- 첫 백엔드 프로젝트로 API 명세 작성부터 서버리스 함수 구현, 배포까지 경험
- 처음 써 본 SQL로 테이블 스키마와 트랜잭션 함수를 작성하며 동시 요청 처리를 다룸

## 14. 제외한 내용과 이유

- 퍼즐 정답, 단계별 풀이 방식, 최종 요청 주소, 응답 헤더 이름: 공개하지 않기로 함(사용자 요청). 단계 번호와 개발자 도구도 짝지어 적지 않음
- 4단계 반전 장면 캡처, 클리어 화면 아래쪽 기능 카드: 풀이 단서가 보임
- 8단계 화면 캡처: 개발용 안내 문구와 TODO 상태의 조합 규칙이 보임
- 직접 플레이한 기록(docs/operations.md): 쓰지 말라는 사용자 요청
- 랭킹 제외 기준 5분, 소스맵 끄기: PR #19 미병합이라 Production에 없음
- 클리어 기록 공유, `/api/hint`, 영어 지원: 주석이나 계획 문서에만 있음(미구현)
- PGlite 19개 시나리오 테스트: PR #10 본문에만 있고 저장소에 테스트가 없음

## 포트폴리오 저장소 반영 기록 (2026-11-26)

- 사실 확인(content-fact-checker) 지적 반영: 핵심 기능에서 개발자 도구 이름 삭제(풀이 단서·근거 없음), 프롤로그 설명을 시트 표현으로, 5단계 서버 API·5·8단계 화면으로 정정, 버그 수정 en "correct answer"로, Cron 호출 대상·Supabase 기본 설정·역할 세부 삭제, 광고 차단 점검을 "Claude Code 자동 점검"으로 명시, 테이블 이름·"프레임워크 없이" 삭제, 한 줄 소개를 1절 표현으로, 요약에 "API 4개"
- 배운 점 2문장: 사용자 확인 ✅ ("좋네", 2026-11-26)
- 이미지: 01~03 배경 이미지 사용 허락 ✅ (사용자 답변 2026-11-26). 01 = 대표 이미지(thumbnail), 02·03·04·05·07 = 화면. 06 클리어 화면은 단계 제목이 풀이 단서가 될 수 있어 제외(사용자 답변). 07은 1440×420 → 배경색으로 위아래를 채워 1440×900(16:10, 자르지 않음)
- 새 기술 JavaScript·SQL·HTML·Vercel Functions·Supabase·PostgreSQL: 모두 핵심 기술 (사용자 답변)
- 순서: KUrdination 바로 뒤 (사용자 답변)
- 관련 활동: KWEB (`related: ["kweb"]`), KWEB 활동 설명에 F12scaper 백엔드·배포 추가
