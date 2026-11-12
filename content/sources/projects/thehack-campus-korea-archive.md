# THE해커톤 : CAMPUS 고려대 아카이브 팩트시트

- 조사일: 2026-11-13 (KST)
- 저장소: https://github.com/gaudium1257/TheHack_Campus_Korea_Archive (공개) / 기준 커밋: `fac6054`
- 내 git 신원: 김태호 (Taeho Kim) `<twehokim@gmail.com>`, 그리고 `Claude <noreply@anthropic.com>` (AI 코딩 도구로 본인이 한 작업, 사용자 답변)

## 1. 개요

- 한 줄 소개: THE해커톤 : CAMPUS 고려대학교 지부의 공식 아카이브 웹사이트 ✅ (README.md:1-3)
- 무엇을: 정규 세션 기록과, 학회원이 세션에서 만들고 배포한 결과물을 모읍니다 ✅ (README.md:3, `src/content/site.ts:10-11`)
- 맥락: 학회 활동이고, 운영진으로서 직접 진행한 일입니다 ✅ (사용자 답변)

## 2. 기간·팀

- 기간: 2026-11-10 ~ 진행 중 (첫 커밋 `b5ec814`, 마지막 커밋 2026-11-12 `fac6054`) ✅
- 커밋 (참고용): 전체 37개 중 본인 37개. main 19개는 PR #1–#18 squash merge와 Initial commit입니다 ✅
- 팀: 1인. 기획, 디자인, 개발, Vercel 배포를 모두 본인이 했습니다. 디자인은 세션 PPT를 레퍼런스로 삼았습니다 ✅ (사용자 답변, `git shortlog`)
- 학회 내 직책: 운영진, 담당은 "개발 교육" ✅ (`src/content/members.ts:9`)

## 3. 내가 한 일

- 사이트 기획, 디자인, 개발, Vercel 배포 ✅ (사용자 답변, 전체 커밋)
- 세션 슬라이드 디자인을 참고한 디자인 토큰 기반 CSS, 다크·라이트 테마 ✅ (`src/app/globals.css`, `25db682`, 사용자 답변)
- Next.js App Router 페이지 전체 ✅ (`a2d8247`/PR #1, `1fca580`/PR #10)
- 임베드 판단 로직 ✅ (`src/lib/embed.ts`, `833ef14`, `d7e29a8`)
- 결과물 실행 창과 실제 화면 썸네일 ✅ (`src/components/LiveEmbed.tsx`, `src/components/LiveThumb.tsx`, `43fe1d0`)
- 데이터 모델과 카탈로그 번호 자동 부여 ✅ (`src/content/types.ts`, `src/lib/archive.ts:47-51`)
- 세션 기록 검토: 슬라이드를 바탕으로 AI가 쓴 문안을 본인이 검토했습니다 ✅ (사용자 답변, `src/content/sessions.ts`)
- 세션 3회, 결과물 14개, 학회원 17명의 데이터 정리 ✅ (`src/content/*.ts`)

## 4. 핵심 기능 (구현 확인된 것만)

- 세션 기록과 섹션 메뉴 ✅ (`src/app/sessions/[slug]/page.tsx`, `src/components/SectionNav.tsx`)
- 슬라이드 보기(크게 보기 창, 키보드 ←/→) ✅ (`src/components/SlideStrip.tsx`)
- 결과물 실행 창(데스크톱/모바일 전환, 다시 불러오기, 새 창 열기) ✅ (`src/components/LiveEmbed.tsx`)
- 사이트 상태 자동 판단(4xx·5xx, X-Frame-Options, CSP를 확인하고 한 시간마다 재검증) ✅ (`src/lib/embed.ts`, `src/app/projects/[slug]/page.tsx:15,36-37`)
- 실제 화면 썸네일(화면에 가까워질 때만 로드) ✅ (`src/components/LiveThumb.tsx`)
- 결과물 세션 필터 ✅ (`src/components/ProjectBrowser.tsx`)
- 학회원 목록(운영진은 지정 순서, 학회원은 가나다순, 포트폴리오 링크) ✅ (`src/lib/archive.ts:53-60`, `src/components/PersonCard.tsx`)
- 다크·라이트 테마(첫 화면이 그려지기 전에 적용) ✅ (`src/components/ThemeToggle.tsx`, `src/app/layout.tsx:53`)
- SEO: sitemap, robots, 페이지별 OpenGraph ✅ (`src/app/sitemap.ts`, `src/app/robots.ts`)

## 5. 구조

- 백엔드와 DB 없이, `src/content/*.ts`의 TypeScript 데이터를 정적 생성(SSG)합니다. 페이지는 `src/lib/archive.ts`의 함수로만 데이터를 조회합니다 ✅
- 결과물 페이지만 서버에서 외부 서비스의 응답 코드와 헤더를 확인하고(`server-only`, React `cache`, `revalidate: 3600`), 클라이언트에서 iframe으로 띄웁니다 ✅ (`src/lib/embed.ts:1-2,21-25`)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술        | 근거                                                             |
| -------- | ----------- | ---------------------------------------------------------------- |
| language | TypeScript  | `tsconfig.json`, `src/**`                                        |
| language | CSS         | `src/app/globals.css` (직접 작성, 프레임워크 없음)               |
| frontend | Next.js     | `package-lock.json` 16.4.6, `src/app/**`                         |
| frontend | React       | `package-lock.json` 19.3.1, client 컴포넌트                      |
| infra    | Vercel      | 응답 헤더 `Server: Vercel`, `src/app/layout.tsx:23`, 사용자 답변 |
| AI 도구  | Claude Code | `Co-Authored-By` 커밋, 사용자 답변 → JSON `aiTools`              |

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변). 학회원에게는 아직 공개하지 않았습니다.
- 배포: Vercel / https://the-hack-campus-korea-archive.vercel.app / 2026-11-13에 `/`, `/sessions`, `/projects`, `/members`, `/about`, `/sessions/02` 모두 HTTP 200 ✅

## 8. 결과

- 없음 (아직 공개 전, 사용자 답변)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 임베드를 막았거나 오류를 내는 결과물 사이트가 빈 화면으로 보임 → 해결: 서버에서 응답 코드와 X-Frame-Options·CSP를 확인해 표지로 대신하고, 한 시간마다 다시 확인 (`833ef14`, `d7e29a8`)
- 문제: 아이폰 Safari가 iframe을 안쪽 사이트 폭만큼 늘려 가로 스크롤이 생기고, 맨 위로 버튼이 반쯤 가려짐 → 해결: iframe에 `width: 1px; min-width: 100%`를 주고 감싸는 요소를 `overflow`·`clip-path`로 제한, body는 `overflow-x: clip` (`45a7bcc`)
- 문제: 하이드레이션 전에 iframe이 먼저 로드되면 `onLoad`를 놓침 → 해결: 마운트 후에 iframe을 붙이고, 8초 뒤에는 그대로 표시 (`src/components/LiveEmbed.tsx:12-20`)
- 문제: 홈에서 로고를 누르면 머리글 높이만큼 덜 올라감 → 해결: `scrollToPageTop()`으로 직접 0까지 스크롤 (`e10ff39`, `src/lib/scroll.ts`)

## 10. 링크

- GitHub: https://github.com/gaudium1257/TheHack_Campus_Korea_Archive (공개)
- 사이트: https://the-hack-campus-korea-archive.vercel.app (사용자 답변: 넣기로 함)

## 11. 이미지 (`images/`)

캡처는 2026-11-13에 배포 사이트를 헤드리스 Chrome으로 찍었습니다(데스크톱 1440×900 화면을 2배 해상도로).

| 파일 (`images/` 사본)                      | 종류            | 크기                 | 무엇을 보여주는지                                                       | 원본 경로          |
| ------------------------------------------ | --------------- | -------------------- | ----------------------------------------------------------------------- | ------------------ |
| `images/icon.svg`                          | 아이콘          | 벡터 (viewBox 64×64) | 검붉은 정사각형 위 분홍 T자와 크림슨 밑줄                               | `src/app/icon.svg` |
| `images/thumbnail.png`                     | 가로 대표       | 2880×1800            | 홈 첫 화면 ("고려대, 만드는 사람들"과 세션·결과물·학회원 수, 01과 같음) | 캡처               |
| `images/01-home-hero.png`                  | 웹 화면         | 2880×1800            | 홈 첫 화면, 어두운 테마                                                 | 캡처               |
| `images/02-home-hero-light.png`            | 웹 화면         | 2880×1800            | 홈 첫 화면, 밝은 테마                                                   | 캡처               |
| `images/03-home-works.png`                 | 웹 화면         | 2880×1800            | 홈의 결과물 섹션과 실제 화면 썸네일 (학회원 실명 2명 보임)              | 캡처               |
| `images/04-session-detail.png`             | 웹 화면         | 2880×1800            | 3회차 세션 상세: 표지, 섹션 메뉴, 일시·진행·결과물 수                   | 캡처               |
| `images/05-session-slides.png`             | 웹 화면         | 2880×1800            | 세션 슬라이드 목록과 회차 안내 문구                                     | 캡처               |
| `images/06-projects-list.png`              | 웹 화면         | 2880×1800            | 결과물 목록: 세션 필터와 실제 사이트 썸네일                             | 캡처               |
| `images/07-project-detail.png`             | 웹 화면         | 2880×1800            | 결과물 상세의 실행 창, 데스크톱 보기 (화면 안은 학회원 서비스)          | 캡처               |
| `images/08-project-detail-mobile-view.png` | 웹 화면         | 2880×1800            | 같은 실행 창을 모바일 보기로 전환한 화면                                | 캡처               |
| `images/09-members.png`                    | 웹 화면         | 2880×1800            | 학회원 페이지 (운영진 3명의 실명과 학과 보임)                           | 캡처               |
| `images/10-phone-home.png`                 | 앱 화면(휴대폰) | 1170×2532            | 휴대폰 세로 화면의 홈                                                   | 캡처               |
| `images/og-slide-cover.jpg`                | 사진            | 1600×900             | OT 슬라이드 표지 (THE해커톤 로고, 옛 문구 "고대, 만드는 사람들")        | `public/og.jpg`    |

- 03·09의 실명은 사용자 허락("사진은 다 넣어")에 따라 넣었습니다. 캡처에 토큰이나 연락처는 보이지 않습니다.
- 학회 이름과 로고는 공개해도 된다고 확인받았습니다 (사용자 답변).

## 12. 관련 활동·수상·경력 (사용자 답변)

- THE해커톤 : CAMPUS 고려대학교 지부 운영진 (개발 교육), 2026년 2학기

## 13. 배운 점

사용자가 작성을 맡겨서, 커밋 근거와 사용자 답변("다른 사람 사이트를 띄워 보는 게 처음")을 바탕으로 썼습니다.

- 다른 사람이 만든 사이트를 페이지 안에 띄워 본 것은 처음이었고, 사이트마다 X-Frame-Options·CSP로 임베드를 막을 수 있어 먼저 확인하고 대체 화면을 준비해야 한다는 것 (`833ef14`, `d7e29a8`)
- 아이폰 Safari는 iframe을 안쪽 사이트 폭만큼 늘리기 때문에, 모바일 레이아웃은 실제 기기 동작을 기준으로 확인해야 한다는 것 (`45a7bcc`)
- AI 코딩 도구와 작업할 때 디자인 규칙과 사실관계를 CLAUDE.md에 적어 두면 작업마다 같은 기준을 지킬 수 있다는 것 (CLAUDE.md를 24번 수정)

## 14. 제외한 내용과 이유

- Supabase 결과물 제출 폼, 운영진 페이지, 학회원 개인 페이지, Heat Project 리더보드: CLAUDE.md "다음 단계 (예정)"에만 있어 미구현으로 제외. Supabase는 기술 스택에도 넣지 않았습니다.
- 맨 위로 버튼의 읽은 만큼 채워지는 원: 추가(`e10ff39`)했다가 제거(`a3eaebd`, PR #12)
- "Atlas Univ" 문구: 사용자 요청으로 제외 (학회 이름이 바뀜). 사이트 코드 `src/app/page.tsx:123`에는 아직 남아 있습니다.
- `pdftoppm`: 슬라이드 PDF를 쪽별 이미지로 바꾸는 일회성 도구라 기술 스택에서 제외
- 글꼴(Pretendard, IBM Plex Mono)과 `server-only`: 프로젝트를 설명하는 기술이 아니라 제외
- 테스트, CI, 라이선스: 저장소에 없음. `npm run lint`는 `tsc --noEmit` 타입 검사입니다. 조사 중 빌드는 실행하지 않았습니다(읽기 전용).
- 본인 외 학회원 실명: 팩트시트와 JSON 본문에는 넣지 않았습니다 (캡처 03·09는 위 11번 참고).
- 커밋 메시지 안의 Claude 세션 URL: 내부 링크라 제외

## 자체 점검

- [x] JSON의 모든 문장이 팩트시트 ✅ 항목이나 사용자 답변에 근거가 있다 (`learnings`는 사용자가 작성을 맡김)
- [x] 🟡/❓ 상태로 남은 내용은 JSON에 들어가지 않았다
- [x] 숫자는 모두 측정값이거나 코드에 있는 값이다 (3·14·17, 8초, 한 시간)
- [x] 금지어가 없다 (스크립트로 검사)
- [x] ko와 en의 내용이 같다
- [x] 기술 스택은 실제로 코드에서 쓰인다 (techNotes 키가 techStack과 일치)
- [x] 비밀값, 내부 URL, 허락 없는 실명이 없다 (캡처 속 실명은 허락받음, 토큰·연락처 없음)
- [x] JSON이 템플릿과 같은 구조이고 유효한 JSON이다 (`JSON.parse` 통과)
- ⚠️ 영문 제목의 "THE해커톤"은 공식 영문 표기를 확인하지 못해 한글 그대로 썼습니다.

## 포트폴리오 저장소 확인 기록 (2026-11-13)

- 사실 확인 통과. 팩트시트 근거가 얇은 문장은 저장소(`fac6054`)에서 확인함:
  - 세션의 "다룬 내용·실습·확인 기준": `src/app/sessions/[slug]/page.tsx:68-70` 섹션 이름
  - 슬라이드 "가로 목록": `src/app/globals.css:1274-1280` `.slides__track`
  - 썸네일 "첫 화면을 줄여": `src/components/LiveThumb.tsx`의 `scale()`·`IntersectionObserver`(`rootMargin: 300px`)
  - 학회원별 결과물·"본인이 공개한 포트폴리오": `getProjectsByMember`, `src/content/types.ts:52`
  - 테마 저장: `src/components/ThemeToggle.tsx:10,26` (`localStorage`)
  - CSS 반응형: `globals.css`의 960px·640px `@media`
- 이미지: 학회원 실명이 보이는 03·06·09는 주인 결정으로 넣지 않음. 01은 대표 이미지와 같은 화면이라 화면 목록에서 뺌.
- 활동 표지: `content/activities/thehack-campus-korea-university.json` (운영진, 개발 교육, 2026-09~)

## 갱신 (2026-11-13, 사용자 답변)

- 학회원에게 사이트를 공개함 → 7번 "학회원에게는 아직 공개하지 않았습니다"를 대신함. JSON `outcomes`에 "2026-11 학회원에게 사이트 공개" 추가
- THE해커톤 : CAMPUS 공식 인스타그램: https://www.instagram.com/thehack_campus/ (활동 표지 링크)
