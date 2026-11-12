# SHOWROOMZ 팩트시트

- 조사일: 2026-10-12
- 갱신일: 2026-11-13
- 저장소 (모두 GitHub 공개 저장소, 포트폴리오에는 링크를 넣지 않음 — 사용자 답변)
  - front-end (소비자 앱) / 기준 커밋: 4263ccd → 갱신 기준: 8c583d9 (origin/main, 2026-11-12) (갱신 2026-11-13)
  - front-end-admin (운영자 콘솔) / 기준 커밋: 9a078ee → 갱신 기준: b29d8f8 (2026-11-08) (갱신 2026-11-13)
  - front-end-partners (파트너센터) / 기준 커밋: 9f3209d → 갱신 기준: 80845ed (2026-11-06) (갱신 2026-11-13)
  - front-end-studio (쇼룸 스튜디오) / 기준 커밋: 29e37c6 → 갱신 기준: 88de378 (2026-11-09) (갱신 2026-11-13)
  - front-end-landing (랜딩 페이지, 새 저장소) / 기준 커밋: 23a95e9 (2026-11-08) (갱신 2026-11-13)
  - back-end: 본인 커밋 0건, 담당 아님 → 기여에서 제외 (사용자 답변). 10-12 이후 PR #317~#325도 모두 팀원 작업 (갱신 2026-11-13)
- 내 git 신원: gaudium1257 / 김태호 (Taeho Kim) / 가디 <twehokim@gmail.com> ✅ (사용자 답변, 2026-11-13 재확인) (갱신 2026-11-13)

## 1. 개요

- 한 줄 소개: 브랜드와 인플루언서가 계약을 맺고 공동구매(공구)를 진행하는 커머스 플랫폼의 프론트엔드 4종(소비자 앱·파트너센터·스튜디오·운영자 콘솔) ✅ (파트너센터 화면 문구 "연결된 인플루언서와 공구 계약을 작성·검토 요청", "체결된 계약에서 생성된 공구" — 2026-10-12 개발 서버 화면 확인 / 각 저장소 `src/common/router/routes.tsx`, `src/common/constants/menu.ts`)
- 여기에 서비스 소개 랜딩 페이지 추가 ✅ (front-end-landing `src/App.tsx:37-39`, https://www.showroomz.co.kr HTTP 200 2026-11-13 / 사용자 답변: 랜딩 넣어도 됨) (갱신 2026-11-13)
- 무엇을, 누구를 위해: ✅
  - 소비자: 쇼룸 팔로우, 게시물 피드, 상품 주문·결제·반품 (`front-end/src/navigators/*`)
  - 브랜드: 상품·연결·소통·계약·공구·주문·클레임 관리 (`front-end-partners/src/common/constants/menu.ts:22-80`)
  - 인플루언서: 연결·소통, 계약 확인, 공구 게시물, 쇼룸 관리 (`front-end-studio/src/common/constants/menu.ts`, `index.html:16`)
  - 운영자: 입점 심사, 계약·공구 승인과 조치, 회원·CS·약관 (`front-end-admin/src/common/router/routes.tsx`)
  - 세 콘솔 공통으로 정산 관리, 운영자 콘솔에 거래 관리·운영 지표 추가 ✅ (admin·studio `menu.ts` "정산 관리"·"거래 관리"·"운영 지표") (갱신 2026-11-13)
  - 방문자(예비 브랜드·인플루언서): 랜딩 페이지에서 서비스 소개, 입점·신청 버튼, 문의하기, 소개서 받기 ✅ (landing 56a9f93, eb67e19, 23a95e9) (갱신 2026-11-13)
- 맥락: 창업팀, 서비스명 SHOWROOMZ 공개 가능 ✅ (사용자 답변)
- 분야 표현: "뷰티" 등 분야는 쓰지 않음 (사용자 답변 (b))

## 2. 기간·팀

- 내 참여 기간: 2026-07 ~ 진행 중 ✅ (첫 커밋 admin 24cb3d3 2026-07-18, 마지막 2026-10-06 / 사용자 답변)
  - 갱신: 마지막 커밋 2026-11-12 (front-end 8c583d9), 여전히 개발 진행 중 ✅ (사용자 답변 2026-11-13) (갱신 2026-11-13)
- 프로젝트 전체: 2025-10-27 ~ ✅ (front-end 첫 커밋 fd61aa5)
- 커밋(머지 제외, 참고용): front-end 35/697 · admin 35/149 · partners 48/240 · studio 32/64 ✅
  - 10-12 이후 새 커밋(머지 제외, 본인/전체): front-end 58/58 · admin 11/11 · partners 14/14 · studio 13/13 · landing 10/10 ✅ (`git log <기준>..origin/main --no-merges`) (갱신 2026-11-13)
  - 별도: front-end `feat/web` 브랜치 6/6, main 미병합 → 14번 참고 (갱신 2026-11-13)
- PR(참고용): 웹 3종에서 본인 PR 102건 머지 (admin 28, partners 45, studio 29), 사람 리뷰 기록 없음(댓글은 Vercel 봇) ✅ (gh pr list)
  - 10-12 이후 본인 PR 35건 머지(admin #32~#40 9건, partners #46~#58 13건, studio #30~#42 13건) → 누적 137건. front-end·landing은 main 직접 푸시 ✅ (gh pr list --search "updated:>=2026-10-12") (갱신 2026-11-13)
- 팀: 현재 3명 — 기획·디자인 1, 백엔드 1, 프론트엔드 1(본인) ✅ (사용자 답변, 2026-11-13 변동 없음) (갱신 2026-11-13)
- 참고: git 기록상 본인 합류 전 다른 프론트엔드 작업자들이 소비자 앱·파트너센터·운영자 콘솔 초기 코드를 작성 ✅ → "이어받아 확장"으로 표기

## 3. 내가 한 일

- 스튜디오 웹: 파트너센터의 설정·구조를 바탕으로 시작해 기능 전체 구축 — 소셜 로그인 4종(Kakao·Naver·Apple·Google), 연결·소통, 계약, 공구, 게시물, 쇼룸 관리, Vercel Functions, FCM ✅ (a450f34 첫 커밋에서 partners 설정 파일 복사 확인, 이후 f4fe65d, 0f557fb, dbe8607, a432aec, 6615b8d, 4afd63a, db8f15e / 사용자 답변으로 표현 확인)
- 계약·공구 관리를 3개 콘솔에 구현 ✅ (partners a3df729·d88fefe, studio 0f557fb·dbe8607, admin c0d81e3·b443a9f)
- 파트너센터: 연결·소통(61071fd), 기본정보 관리(feb833e), 상품 문의(ce244df), 주문·클레임·정산 화면(0826742), 온보딩 일부(6c3fb7a), 상품 관리 일부(e2fa1eb) ✅
- 운영자 콘솔: 정보 변경 요청(81f1593), 1:1 문의(bf4f3e1), 상품 문의·약관·공지(47e38b0), 소비자 회원(d0b6b32) 신규 / 입점 심사(de0e022, 4aa3519)·상품(c013839)·FAQ(4e3f030) 재작성 / 사이드바·레이아웃·Tiptap 에디터 ✅ — 참고: 현재 src 줄의 약 72%가 본인 작성(git blame)
- 소비자 앱: 주문·결제·반품/교환 `features/order` 34개 파일(4263ccd), 게시물 피드·쇼룸·4탭 재편(78713bd, e4d88fe, 3dfb0c3), 약관·FAQ·본인인증 결과 화면(ab2b203), 상품/1:1 문의 분리(776d701, 8a63ed6), 공용 컴포넌트 26개 ✅
- 401 토큰 갱신 개선: admin 9a078ee·528344d, partners 4fd3e4c·4b5d82a, studio faabfdd, front-end f4977ec ✅ (이후 front-end 2ba7a8d에서 네트워크 오류 시 로그아웃되던 문제 추가 수정) (갱신 2026-11-13)
- 서버 API 미제공 화면의 UI + DEV 전용 목업: 파트너센터 정산·배송 정책·탈퇴(`common/utils/devMock.ts`), 소비자 앱 주문 취소 요청(`cancelRequestService.ts:19`) ✅ (사용자 답변: 기여에 포함)
  - 이후 실제 API로 연동: 파트너센터 정산·배송 정책 086a4c6, 목업 층(callOrMock·devMock.ts) 삭제 c766128, 소비자 앱 취소 요청 56950b4 ✅ → JSON 문장을 "당시 … 없던 … (이후 실제 API로 연동)"으로 수정 (사용자 답변 2026-11-13) (갱신 2026-11-13)
- 소비자 앱 빌드 설정: 스플래시 config plugin(f4977ec, cd15f1a, 3876c98), Pretendard 폰트(31e6bf6), Google·Naver 로그인 스킴(9672371, b3b0bd9), TestFlight 설정(e913519), APK 워크플로(9822879, 2574766) ✅
  - 스플래시 config plugin(`plugins/withSplashBranding.js`)은 본인이 90cdd6c(2026-11-09)에서 삭제하고 `expo-splash-screen` 설정 + JS 오버레이 워드마크로 교체 ✅ → JSON에서 "스플래시 config plugin"을 "스플래시 화면 설정"으로 수정 (갱신 2026-11-13)
  - TestFlight 비대화형 제출용 App Store Connect 앱 ID 추가(7b86042) ✅. 실제 TestFlight 업로드 여부는 코드로 확인 불가 (갱신 2026-11-13)
- 정산 관리 3개 콘솔 구현·실제 API 연동: partners ec6034d·086a4c6(`settlementService.ts:24` `/seller/settlements`), studio 9a664cc·1e090ca(`/creator/settlements`), admin 10a6224·8777b2e(`adminSettlementService.ts:30` `/admin/settlements`) ✅ (갱신 2026-11-13)
- 운영자 콘솔: 거래 관리(주문 조회·반품·교환·환불·예외, 8777b2e), 홈·운영 지표·회원 상세 3종·일반 게시물·계약 해지·변경 요청(23f34c2), 소통 스레드(운영팀 채널·정산 조정 이슈, fe0eaa6), 운영 지표 503 처리(157c84a) ✅. 자리표시 화면 20개 → 2개(`routes.tsx:179,370`) (갱신 2026-11-13)
- 파트너센터: 홈·성과·계정 이용 정지·계약 해지·검수 3갈래(e485461), 계약 상품 옵션가(59b071e), 알림에서 주문·반품교환 상세 열기(c56fd2a) ✅ (갱신 2026-11-13)
- 스튜디오: 홈·알림·계정 이용 정지·기본정보·성과(3729c65), 공구 종료 화면(e2d01d3), 자리표시 화면 0개 ✅ (갱신 2026-11-13)
- 랜딩 페이지: 메인·브랜드·인플루언서 3페이지, PC 1440·모바일 390(9580a35), 신청 버튼 연결(56a9f93, e6e30bf), 문의하기 모달(eb67e19, ed9378a), 하단 사업자 정보(79760be), 소개서 받기(23a95e9) ✅ — 저장소 커밋 10개 모두 본인 (갱신 2026-11-13)
- 배포 워크플로: partners·admin main 푸시 → S3 + CloudFront, OIDC 역할(f20290a, 43d3af5, 3b15629, 299ecf5 / PR partners #57, admin #39), 실행 기록 2026-11-06·11-07 success ✅. 랜딩 워크플로(cfb56b4)는 변수 미설정으로 건너뜀(실행 기록 skipped) (갱신 2026-11-13)
- 소비자 앱: iOS Sign in with Apple·오픈소스 라이선스 목록(67162bd), 공구 게시물을 서버 공구 블록으로 표시하고 목업 삭제(950becb), 쇼룸 진행 중 공구 전용 API(b3f1b3d), 상품 공개 문의(c4a494b), 스켈레톤·모션·누름 피드백(16fef89, ebcecd0, 0a378f4, 8e1c2cb, 4ca4d11, 2065090, 62bdd01) ✅ (갱신 2026-11-13)
- 서버 시각 규약 반영: front-end c6b1f4c·28f058e·33af4a7, admin 5f28861, partners 96d1e67, studio e0a14d4·e33de15 ✅ (갱신 2026-11-13)

## 4. 핵심 기능 (구현 확인된 것만)

- 계약 관리: 작성 → 운영자 검토 → 양측 서명 → 체결 문서 ✅ (`partners/src/features/contracts/services/contractService.ts:22-139`, `studio/.../creatorContractService.ts:17-79`, `admin/src/features/contract/` / 2026-10-12 화면 확인) — 이후 계약 해지 추가(e485461, 23f34c2) (갱신 2026-11-13)
- 공구 관리: 준비 조건 3개(물량 확보·게시물 등록·운영자 승인)와 상태를 3개 콘솔에서 처리 ✅ (`groupBuyService.ts:21-120`, `creatorGroupBuyService.ts:16-96`, `adminGroupBuyService.ts` / 2026-10-12 화면 확인) — 2026-11-13 재확인 `partners ProgressSection.tsx:100,125`, `history.ts:20-22` (갱신 2026-11-13)
- 연결·소통 메시지: 스레드, 읽음, S3 presigned 업로드(진행률), 서명 URL 다운로드 ✅ (`partners/.../threadService.ts:113-174`, `attachmentUploader.ts:36-75`, `studio/.../threadService.ts:117-178`)
- 주문·반품 처리(파트너): 9개 탭, 발주서 xlsx, 송장 일괄 업로드, 취소 승인/거절, 반품 검수 ✅ (`orderService.ts:23-202`, `claimService.ts:18-147`) — 개발 서버 주문 0건이라 화면 미확인
- 소비자 주문·결제: 체크아웃 → PortOne 결제 → 주문 상세·배송 조회·반품/교환 ✅ (`front-end/src/features/order/`, `PortOnePaymentModal.tsx`)
- 게시물 작성(스튜디오): 사진·본문·미리보기·인사이트 ✅ (`postService.ts:172-232`, `postInsightService.ts:65` / 2026-10-12 화면 확인)
- 입점·변경 요청 심사(운영자) ✅ (`admin/src/common/router/routes.tsx`)
- 정산 관리: 브랜드·인플루언서는 정산 내역·명세 조회와 내려받기(브랜드: 명세 xlsx·세금계산서 PDF / 인플루언서: 명세 xlsx·원천징수영수증 PDF·연간 지급 내역 xlsx, 사업자 세금계산서 제출), 브랜드는 정산 조정 요청, 운영자는 정산 목록·상세·재분배·세금계산서 대조·브랜드 발행본 등록 ✅ (partners `settlementService.ts:104-180`, studio `settlementService.ts:167-203`, admin `adminSettlementService.ts:79-158`) (갱신 2026-11-13)
- 공구 게시물(소비자 앱): 서버 공구 블록을 변환해 공구 제목·마감까지 남은 일수·상태·상품과 공구가 표시 ✅ (`front-end/src/features/post/services/postService.ts:16-52`, `post/types/post.ts:48-59`, 950becb) (갱신 2026-11-13)

## 5. 구조

- 웹 3종(React + Vite)과 소비자 앱(React Native + Expo)이 하나의 백엔드 `/v1` REST API를 역할별 경로(/user, /seller, /creator, /admin)로 호출 ✅ (각 저장소 `src/common/lib/apiInstance.ts`) — 2026-11-13 재확인: `/user` 49, `/seller` 53, `/creator` 35, `/admin` 47곳 (갱신 2026-11-13)
- 인증: 웹은 쿠키, 앱은 expo-secure-store에 Bearer 토큰. 401 시 refresh 1회 공유·재시도 ✅ (`admin/apiInstance.ts:24-65`, `partners/apiInstance.ts:24-65`, `front-end/apiInstance.ts:44-81`)
- 데이터: TanStack Query(요약 배지 refetchInterval 폴링), Zustand(소비자 앱·파트너센터) ✅
- 파일: S3 presigned URL 직접 업로드, Content-Disposition 서명 URL 다운로드 ✅
- 스튜디오: Vercel Functions(`api/kakao-token.ts`, `api/image-proxy.ts`), FCM 웹 푸시(`src/common/lib/firebase.ts`) ✅
- 랜딩: React + Vite 정적 페이지 3개, 문의하기·소개서 받기는 Google Apps Script 웹앱으로 전송(Apps Script 코드는 저장소에 없음) ✅ (`landing/src/features/inquiry/inquiry.ts:1-6`, `features/deck/deck.ts:1-2`) (갱신 2026-11-13)
- 배포: partners·admin은 GitHub Actions → S3 + CloudFront(OIDC 역할), studio·랜딩은 Vercel ✅ (`.github/workflows/deploy.yml`, 응답 헤더 `Server: AmazonS3` / `Server: Vercel` 2026-11-13) (갱신 2026-11-13)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                     | 근거                                                                                              |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| language | TypeScript               | 4개 저장소 tsconfig(strict) + landing (갱신 2026-11-13)                                           |
| frontend | React                    | 4개 저장소 + landing (갱신 2026-11-13)                                                            |
| frontend | Vite                     | 웹 3종 vite.config.ts + landing (갱신 2026-11-13)                                                 |
| frontend | Tailwind CSS             | 웹 3종 @tailwindcss/vite, index.css + landing (갱신 2026-11-13)                                   |
| frontend | shadcn/ui                | components.json, src/components/ui                                                                |
| frontend | Radix UI                 | src/components/ui/*.tsx                                                                           |
| frontend | React Router             | 웹 3종 App.tsx:1 + landing App.tsx (갱신 2026-11-13)                                              |
| frontend | TanStack Query           | 4개 저장소 (admin src/common/lib/queryClient.ts:1 등)                                             |
| frontend | Zustand                  | front-end src/common/stores/createStore.ts:1, partners createStore.ts:1                           |
| frontend | React Hook Form          | partners Form.tsx:9, studio OnboardingPage.tsx:2                                                  |
| frontend | Tiptap                   | admin Editor.tsx:3-14, partners Editor.tsx:1-8                                                    |
| frontend | Axios                    | 4개 저장소 apiInstance.ts                                                                         |
| mobile   | React Native, Expo       | front-end index.ts:4                                                                              |
| mobile   | React Navigation         | front-end src/App.tsx:1                                                                           |
| mobile   | NativeWind               | front-end babel.config.js:4                                                                       |
| backend  | Vercel Functions         | studio api/kakao-token.ts, api/image-proxy.ts                                                     |
| infra    | Vercel                   | 웹 3종 vercel.json, GitHub Deployments(vercel[bot]) + landing(`Server: Vercel`) (갱신 2026-11-13) |
| infra    | AWS S3                   | partners·admin `.github/workflows/deploy.yml` `aws s3 sync`, `Server: AmazonS3` (갱신 2026-11-13) |
| infra    | CloudFront               | partners·admin `deploy.yml` `aws cloudfront create-invalidation` (갱신 2026-11-13)                |
| infra    | EAS Build                | front-end eas.json                                                                                |
| infra    | GitHub Actions           | front-end .github/workflows/*.yml, 실행 기록 + partners·admin deploy.yml (갱신 2026-11-13)        |
| other    | PortOne                  | front-end PortOnePaymentModal.tsx:1                                                               |
| other    | Firebase Cloud Messaging | studio src/common/lib/firebase.ts                                                                 |
| tooling  | ESLint, Prettier         | 4개 저장소 설정 파일 + landing (갱신 2026-11-13)                                                  |

- 새 보조 라이브러리(JSON 미포함): front-end `expo-apple-authentication`(`useAppleLogin.ts:1`), `patch-package`(`patches/react-native+0.81.0.patch`) ✅ (갱신 2026-11-13)
- AI 코딩 도구: Claude Code (사용자 답변)
- 제외(선언만 있고 미사용): admin의 zustand·remeda·date-fns·react-day-picker·react-hook-form, partners의 remeda, studio의 @radix-ui/react-label, front-end의 @portone/browser-sdk

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변, 2026-11-13 재확인) (갱신 2026-11-13)
- 배포: 개발 단계, 실제 운영 중인 서비스 없음 → deployment.status는 not-deployed 유지 ✅ (사용자 답변 2026-11-13) (갱신 2026-11-13)
  - 파트너센터 https://seller.showroomz.co.kr/ — HTTP 200, S3+CloudFront (2026-11-13) (갱신 2026-11-13)
  - 파트너센터 https://front-end-partners-one.vercel.app/ — HTTP 200이나 번들이 부르는 옛 API 도메인이 DNS에 없음(NXDOMAIN, 2026-11-13) → 서버 호출 불가로 보고 링크에서 교체 (갱신 2026-11-13)
  - 쇼룸 스튜디오 https://front-end-studio-one.vercel.app — HTTP 200 (2026-11-13) (갱신 2026-11-13)
  - 랜딩 페이지 https://www.showroomz.co.kr — HTTP 200, Vercel (2026-11-13). showroomz.co.kr은 www로 이동 (갱신 2026-11-13)
  - 운영자 콘솔도 HTTP 200(S3+CloudFront, 2026-11-13)이나 내부 도구라 포트폴리오에서 제외 (갱신 2026-11-13)
- 소비자 앱: EAS 개발용 APK 빌드(GitHub Actions, 마지막 성공 2026-10-06)까지 확인, 스토어 출시 없음 ✅
  - 갱신: APK 빌드 마지막 성공 2026-11-04(846988c). 11-09 이후 실행은 EAS 무료 Android 빌드 소진으로 실패(로그 "reset … on Tue Dec 01 2026") ✅ (gh run list / gh run view --log-failed) (갱신 2026-11-13)

## 8. 결과

- 없음 — 개발 중 (사용자 답변)
- 2026-11-13: 새 결과 없음, 여전히 개발 진행 중 (사용자 답변) (갱신 2026-11-13)
- 참고: JSON outcomes의 LOOKIE 2026 START-UP DEMODAY 우수상은 포트폴리오 저장소가 관리하는 항목(awards/lookie-2026-startup-demoday.json, date 2026-07-08) — 손대지 않음 (갱신 2026-11-13)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 토큰 만료 시 동시 요청이 각자 refresh → 서버의 refresh 토큰 회전으로 첫 요청 외 모두 401 → 해결: 진행 중인 refresh promise 공유 + `_retry` 가드 (admin 9a078ee, partners 4fd3e4c, studio faabfdd)
- 문제: 경로 없이 저장된 인증 쿠키가 `/group-buy`에 남아 새 토큰을 가림 → 해결: 루트 경로 저장, 하위 경로 사본 삭제 (admin 9a078ee, partners 4fd3e4c)
- 문제: 응답 없는 네트워크·CORS 오류에서 인터셉터 크래시, 401 무한 재시도 → 해결: optional chaining, 원래 오류 reject, 대체 메시지 (admin 528344d, partners 4b5d82a)
- 문제: 교차 출처 첨부가 새 탭으로 열려 SPA 상태 손실 → 해결: Content-Disposition 서명 URL 매번 발급(5분 만료), 400ms 간격 순차 저장 (partners 02610e2 → 3a5637f, studio 6b4d8e7·d749f6c·1c6fefd)
- 문제: CloudFront 원본을 canvas가 CORS로 읽지 못해 재크롭 불가 → 해결: 허용 호스트·https·크기 상한이 있는 같은 출처 Vercel 이미지 프록시 (studio 4afd63a) — 이후 ESM import 확장자 누락으로 함수가 실패하던 것을 310a8ab에서 수정 (갱신 2026-11-13)
- 문제: Naver 팝업을 닫으면 로딩이 끝나지 않음 → 해결: 팝업 closed 폴링 + 타임아웃 (studio 1bd0ea0)
- 문제: iOS 글자가 Android보다 작게 보임 → 해결: Pretendard 정적 폰트 번들, 굵기별 fontFamily 매핑 (front-end 31e6bf6)
- 문제: 스플래시 수정 후 APK 빌드 연속 실패(AAPT) → 해결: `android:` 접두어 누락 수정 (front-end cd15f1a 실패 → 3876c98 성공, Actions 기록 2026-09-24) — 해당 플러그인은 이후 90cdd6c에서 삭제 (갱신 2026-11-13)
- 문제: Google 로그인 계정 선택 후 멈춤 / Naver 클라이언트 ID 밑줄로 App Store 업로드 거부 위험(ITMS-90158) → 해결: 리다이렉트 스킴 등록 / 고정 URL 스킴 (front-end 9672371, b3b0bd9)
- 문제: 실서버 CORS가 Content-Disposition을 숨겨 다운로드 파일명이 비어 있음 → 해결: 서버 규칙과 같은 기본 파일명 (partners 9f3209d)
- 문제: 서버가 모든 LocalDateTime 뒤에 'Z'를 붙여, 한국 시각(KST 벽시계) 기한이 UTC로 읽혀 정지·이의 신청·조정 합의 기한이 9시간(하루) 밀리고, 한국 0~9시 주문의 주문일이 전날로 보임 → 해결: 처음에는 KST 벽시계 값을 'Z'를 떼고 읽다가(studio e0a14d4, front-end 28f058e), 백엔드가 시각을 UTC로 통일(BE 8c2afcec)한 뒤 네 앱 모두 UTC 순간으로 읽어 한국 날짜로 변환(front-end c6b1f4c·33af4a7, admin 5f28861, partners 96d1e67, studio e33de15) ✅ (갱신 2026-11-13)

## 10. 링크

- demo: 파트너센터 (개발·검수 서버) https://seller.showroomz.co.kr/ (이전 https://front-end-partners-one.vercel.app/ — 번들 API 도메인 소멸로 교체) (갱신 2026-11-13)
- demo: 쇼룸 스튜디오 (개발·검수 서버) https://front-end-studio-one.vercel.app
- demo: 랜딩 페이지 https://www.showroomz.co.kr (사용자 답변: 랜딩 넣어도 됨) (갱신 2026-11-13)
- GitHub 링크는 넣지 않음 (사용자 답변)

## 11. 이미지 후보 (경로)

`portfolio-export/screenshots/` — 2026-10-12 개발 서버에서 1440×900으로 캡처. 쇼룸 이름은 캡처 직전 화면에서 「테스트쇼룸」으로 바꿈(사용자 요청).

- `partners-contract-detail.png` — 파트너센터 계약 상세(서명 진행·체결 문서·이력)
- `partners-group-buy-detail.png` — 파트너센터 공구 상세(준비 조건 3개·상태)
- `partners-contract-list.png` — 파트너센터 계약 목록
- `studio-group-buy-detail.png` — 스튜디오 공구 상세
- `studio-post-editor.png` — 스튜디오 게시물 작성·미리보기

캡처하지 않은 화면: 연결·소통(무작위 테스트 메시지), 쇼룸 관리(계정 연결코드 노출), 주문 관리(데이터 0건), 소비자 앱(크롬으로 캡처 불가).
사용 금지: `front-end/photo-drop/**`, `front-end/src/features/post/mocks/images/*.jpg` (제3자 이미지로 보임).

**2026-11-13 재캡처** (사용자 요청, 갱신 2026-11-13) — `portfolio-export/images/`, 모두 1440×900 PNG, 원본 그대로(크기 변경·자르기 없음) (갱신 2026-11-13)

- 대상: 파트너센터 https://seller.showroomz.co.kr (브랜드 테스트 계정 「수정테스트」, 사용자가 로그인), 스튜디오 https://front-end-studio-one.vercel.app (인플루언서 테스트 계정, 사용자가 로그인), 랜딩 https://www.showroomz.co.kr (갱신 2026-11-13)
- 방법: 별도 크롬에서 조회(GET)만 하고 쓰기 요청은 차단. 서버 데이터는 바꾸지 않음 (갱신 2026-11-13)
- 가림 처리: 상대 쇼룸 이름에 본인 실명이 들어 있어(예: 「김태호네이버쇼룸」) 캡처 직전 **화면 표시만** 「테스트쇼룸」으로 바꿈 — 지난번(서버의 쇼룸 이름을 바꿈)과 방식이 다름 (갱신 2026-11-13)
- 확인: 화면에 보이는 글자에서 대표자·사업자등록번호·전화번호·주소·실명 패턴 0건, 이미지 9장 직접 확인 (갱신 2026-11-13)
- 기존 4장 교체용(파일 이름 같음) — 1021 디자인 반영(e485461·59b071e·e2d01d3) 뒤 화면이 달라짐 (갱신 2026-11-13)
  - `partners-contract-detail.png` — 파트너센터 계약 상세: 서명 진행 4단계, 체결 문서(서명 완료 계약서·감사추적인증서), 상태, 이력 (계약 CTR-20261006-002) (갱신 2026-11-13)
  - `partners-group-buy-detail.png` — 파트너센터 공구 상세: 진행 상황 5단계, 종료 후 남은 일, 공구 정보, 이력 (GB-20260927-001) (갱신 2026-11-13)
  - `studio-group-buy-detail.png` — 스튜디오 공구 상세: 진행 상황, 판매 실적, 상태, 이력 (갱신 2026-11-13)
  - `studio-post-editor.png` — 스튜디오 새 게시물: 사진·본문 입력과 소비자 쇼룸 미리보기(빈 작성 화면) (갱신 2026-11-13)
- 기존 후보 교체: `partners-contract-list.png` — 파트너센터 계약 목록 17건(테스트용 이름 「qwq」「wfefww」 등이 보임) (갱신 2026-11-13)
- 새 후보(정산 관리) (갱신 2026-11-13)
  - `partners-settlement-detail.png` — 파트너센터 정산 상세: 조정 협의 내역, 정산 금액 분해(위쪽만, 공급자 사업자 정보 줄은 화면 밖) (갱신 2026-11-13)
  - `studio-settlement-detail.png` — 스튜디오 정산 상세: 조정 협의 안내, 조정 내역, 합의 기한, 리워드 분해 (갱신 2026-11-13)
  - `partners-settlement-list.png` — 파트너센터 정산 목록: 요약 카드 3개, 상태 필터, 1건 (갱신 2026-11-13)
  - `studio-settlement-list.png` — 스튜디오 정산 목록: 요약 카드 4개, 원천징수·실지급액 열, 1건 (갱신 2026-11-13)
- 새 후보(랜딩): `landing-brand.png` — 랜딩 브랜드 페이지 상단(파트너센터 홈 예시 카드, 화면에 「화면 예시 · 가상 데이터」 표기). 얼굴 사진·하단 사업자 정보 없음. 예시 카드 안 작은 상품 썸네일과 「뷰티 브랜드 전용」 문구가 보임 (갱신 2026-11-13)
- 제외: 랜딩 메인·인플루언서 페이지 — 휴대폰 목업 안 인물 얼굴 사진 (갱신 2026-11-13)
- 아이콘·로고: 원본(`Showroomz logo/`, 2026-07-22) 이후 변화 없음 (갱신 2026-11-13)

## 12. 관련 활동·수상·경력 (사용자 답변)

- 팀이 모두의창업(modoo.or.kr)에 지원, 심사 중 (사용자 답변)
- 2026-11-13: 새 결과 없음 (사용자 답변) 🟡 (갱신 2026-11-13)

## 13. 배운 점 (사용자 답변)

- 프론트엔드와 백엔드 저장소를 나눠 협업한 첫 프로젝트였다.
- 커밋·PR·머지를 잘 모르는 상태에서 시작해, 작업 브랜치 → PR → 머지 흐름을 이 프로젝트에서 익혔다.
- API 응답 형태를 짐작해 타입을 썼다가 화면에 잘못된 값이 나온 뒤로, 백엔드 DTO와 컨트롤러를 먼저 읽고 프론트엔드 타입을 작성하게 됐다. — 사용자가 판단을 위임(2026-11-13), 근거: 사용자가 정한 작업 규칙 기록(FAQ 탭 배지 `0[object Object]` 노출 사례, 2026-09-25)과 커밋 메시지의 백엔드 커밋 참조(56950b4 "BE 230e4e28", 4813486 "BE c0466721", c6b1f4c "BE 8c2afcec") (갱신 2026-11-13)

## 14. 제외한 내용과 이유

- ~~소비자 앱 공구 게시물 표시~~ — 이전 사유: `postService.ts:19-42`가 `__DEV__` 조건 없이 가짜 게시물·공구 필드를 덧씌움. → 950becb(2026-10-14)에서 목업을 지우고 서버 공구 블록으로 변환해 해소, 4번 기능으로 이동 (갱신 2026-11-13)
- 상품 상세 공구 묶음, 상품·재고 조회 실패 시 목업 대체 — `productService.ts:22-41`, `ProductDetailView.tsx:281` → 갱신: 지금은 `__DEV__`이면서 번호 990001일 때만 목업(`devMockIds.ts:15`, 6d29c24) (갱신 2026-11-13)
- PASS 본인인증 — 소비자 앱 `identityVerificationService.ts:22-27`(항상 성공), 스튜디오 `mockIdentity.ts`, 운영자 콘솔 더미 값
  - 갱신: 소비자 앱은 시작·완료 API에 연결(4813486)됐지만, 서버가 채널 계약 전이라 가짜 게이트웨이로 고정 인물을 통과시킴(`identityVerificationService.ts:12-13,38`) → 계속 제외 (갱신 2026-11-13)
- 스텁 화면 — 운영자 콘솔 PlaceholderPage 20개, 파트너센터 홈·성과 관리 ComingSoon과 `<div>aasdf</div>` 30개(대부분 다른 작업자), 스튜디오 홈·정산·성과·기본정보
  - 갱신: 운영자 콘솔 2개(공구 게시물·운영자 계정 목록), 파트너센터 ComingSoon 13개(인플루언서용 옛 경로·추첨·부가세 등, `aasdf` 없음), 스튜디오 0개 (갱신 2026-11-13)
- 소비자 앱 데모 버전 — ab2cede에서 추가, 4b83311에서 삭제
- 테스트 — 4개 저장소 모두 0개, LICENSE 없음 → 2026-11-13 landing 포함 5개 저장소 모두 0개 (갱신 2026-11-13)
- 수치(커밋·PR·줄 수) — 기여도가 아니라 참고 자료라 JSON에 넣지 않음
- 모두의창업 지원 — 심사 중이라 결과가 아니므로 outcomes에서 제외
- 소비자 앱 웹(PWA) — `feat/web` 6커밋(9c2b000~f475928, 2026-11-12), main 미병합 → 넣지 않음 (사용자 답변 2026-11-13) (갱신 2026-11-13)
- 배포 상태 live — seller.·admin.·www.showroomz.co.kr이 열리지만 실제 운영 서비스가 아님 → not-deployed 유지 (사용자 답변 2026-11-13) (갱신 2026-11-13)
- 랜딩 메인·인플루언서 페이지 캡처 — 휴대폰 목업 안에 인물 얼굴 사진(`landing/src/assets/images/avatar-jiyoo.jpg` 등)이 크게 보여 후보에서 제외 (갱신 2026-11-13)
- 랜딩 하단 사업자 정보(상호·대표자·사업자등록번호·주소·대표번호) — 캡처에 넣지 않음 (사용자 요청 2026-11-13) (갱신 2026-11-13)
- back-end PR #317~#325 — 팀원(hc784) 작업이라 기여에서 제외 (갱신 2026-11-13)
- 7번의 이전 문장 「배포: Vercel, 개발·검수용 ✅ (사용자 답변)」 — 파트너센터·운영자 콘솔 배포가 S3+CloudFront로 옮겨 가(f20290a, 43d3af5) 「개발 단계, 실제 운영 중인 서비스 없음」(사용자 답변 2026-11-13)으로 바꿈 (갱신 2026-11-13)
- 10번의 이전 링크 https://front-end-partners-one.vercel.app/ — 번들이 부르는 옛 API 도메인이 사라져(NXDOMAIN, 2026-11-13) https://seller.showroomz.co.kr/ 로 교체 (갱신 2026-11-13)
- 참고(포트폴리오와 무관, 수정하지 않음): studio favicon이 없는 `/vite.svg`를 가리킴, studio 계약 상세 "공구 관리 열기" 버튼이 아직 「준비 중」 토스트, partners `claimService.saveBlob`이 object URL을 즉시 revoke(실행 미확인)
  - 2026-11-13: favicon은 그대로 / "공구 관리 열기"는 3729c65부터 공구 상세로 이동(`studio ContractDetailPage.tsx:139`) — 「준비 중」 문장은 이제 틀림 / saveBlob은 다시 보지 않음 / 파트너센터 Vercel 배포본의 API 환경 변수가 옛 도메인 (갱신 2026-11-13)

## 포트폴리오 반영 메모 (2026-11-13, 포트폴리오 저장소)

- 링크 이름: 파트너센터·쇼룸 스튜디오 「(개발·검수 서버)」 → 「(개발 중)」 — 7번 「개발 단계, 실제 운영 중인 서비스 없음」, 이전 「Vercel, 개발·검수용」 문장 폐기(위 7번 끝)에 맞춤
- techNotes.Vercel: 「웹 콘솔 3종의 개발·검수 배포」 → 랜딩 배포와 파트너센터·운영자 콘솔의 S3·CloudFront 이전을 함께 적음 (5번 배포 줄)
- contributions 랜딩 줄 en: "forms" → "connected its inquiry and brochure-request actions" (ko 「연결」과 맞춤)
- features 공구 게시물: 「쇼룸 게시물에서」 → 「소비자 앱의 공구 게시물에서」 (4번 공구 게시물 줄)
- 스크린샷: 기존 4장은 새 캡처로 교체, 정산 상세 2장·브랜드 랜딩 1장 추가. 목록 화면 3장은 제외(상세와 겹치거나 테스트 입력값이 보임)
- LOOKIE 2026 START-UP DEMODAY 우수상(2026-07-08)이 첫 커밋(2026-07-18)보다 앞서는 점: 상장에 본인 이름이 있음 (사용자 답변 2026-11-13) → 수상·outcomes 그대로 유지
