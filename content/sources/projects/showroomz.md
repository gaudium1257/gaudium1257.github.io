# SHOWROOMZ 팩트시트

- 조사일: 2026-10-12
- 저장소 (모두 GitHub 공개 저장소, 포트폴리오에는 링크를 넣지 않음 — 사용자 답변)
  - front-end (소비자 앱) / 기준 커밋: 4263ccd
  - front-end-admin (운영자 콘솔) / 기준 커밋: 9a078ee
  - front-end-partners (파트너센터) / 기준 커밋: 9f3209d
  - front-end-studio (쇼룸 스튜디오) / 기준 커밋: 29e37c6
  - back-end: 본인 커밋 0건, 담당 아님 → 기여에서 제외 (사용자 답변)
- 내 git 신원: gaudium1257 / 김태호 (Taeho Kim) / 가디 <twehokim@gmail.com> ✅ (사용자 답변)

## 1. 개요

- 한 줄 소개: 브랜드와 인플루언서가 계약을 맺고 공동구매(공구)를 진행하는 커머스 플랫폼의 프론트엔드 4종(소비자 앱·파트너센터·스튜디오·운영자 콘솔) ✅ (파트너센터 화면 문구 "연결된 인플루언서와 공구 계약을 작성·검토 요청", "체결된 계약에서 생성된 공구" — 2026-10-12 개발 서버 화면 확인 / 각 저장소 `src/common/router/routes.tsx`, `src/common/constants/menu.ts`)
- 무엇을, 누구를 위해: ✅
  - 소비자: 쇼룸 팔로우, 게시물 피드, 상품 주문·결제·반품 (`front-end/src/navigators/*`)
  - 브랜드: 상품·연결·소통·계약·공구·주문·클레임 관리 (`front-end-partners/src/common/constants/menu.ts:22-80`)
  - 인플루언서: 연결·소통, 계약 확인, 공구 게시물, 쇼룸 관리 (`front-end-studio/src/common/constants/menu.ts`, `index.html:16`)
  - 운영자: 입점 심사, 계약·공구 승인과 조치, 회원·CS·약관 (`front-end-admin/src/common/router/routes.tsx`)
- 맥락: 창업팀, 서비스명 SHOWROOMZ 공개 가능 ✅ (사용자 답변)
- 분야 표현: "뷰티" 등 분야는 쓰지 않음 (사용자 답변 (b))

## 2. 기간·팀

- 내 참여 기간: 2026-07 ~ 진행 중 ✅ (첫 커밋 admin 24cb3d3 2026-07-18, 마지막 2026-10-06 / 사용자 답변)
- 프로젝트 전체: 2025-10-27 ~ ✅ (front-end 첫 커밋 fd61aa5)
- 커밋(머지 제외, 참고용): front-end 35/697 · admin 35/149 · partners 48/240 · studio 32/64 ✅
- PR(참고용): 웹 3종에서 본인 PR 102건 머지 (admin 28, partners 45, studio 29), 사람 리뷰 기록 없음(댓글은 Vercel 봇) ✅ (gh pr list)
- 팀: 현재 3명 — 기획·디자인 1, 백엔드 1, 프론트엔드 1(본인) ✅ (사용자 답변)
- 참고: git 기록상 본인 합류 전 다른 프론트엔드 작업자들이 소비자 앱·파트너센터·운영자 콘솔 초기 코드를 작성 ✅ → "이어받아 확장"으로 표기

## 3. 내가 한 일

- 스튜디오 웹: 파트너센터의 설정·구조를 바탕으로 시작해 기능 전체 구축 — 소셜 로그인 4종(Kakao·Naver·Apple·Google), 연결·소통, 계약, 공구, 게시물, 쇼룸 관리, Vercel Functions, FCM ✅ (a450f34 첫 커밋에서 partners 설정 파일 복사 확인, 이후 f4fe65d, 0f557fb, dbe8607, a432aec, 6615b8d, 4afd63a, db8f15e / 사용자 답변으로 표현 확인)
- 계약·공구 관리를 3개 콘솔에 구현 ✅ (partners a3df729·d88fefe, studio 0f557fb·dbe8607, admin c0d81e3·b443a9f)
- 파트너센터: 연결·소통(61071fd), 기본정보 관리(feb833e), 상품 문의(ce244df), 주문·클레임·정산 화면(0826742), 온보딩 일부(6c3fb7a), 상품 관리 일부(e2fa1eb) ✅
- 운영자 콘솔: 정보 변경 요청(81f1593), 1:1 문의(bf4f3e1), 상품 문의·약관·공지(47e38b0), 소비자 회원(d0b6b32) 신규 / 입점 심사(de0e022, 4aa3519)·상품(c013839)·FAQ(4e3f030) 재작성 / 사이드바·레이아웃·Tiptap 에디터 ✅ — 참고: 현재 src 줄의 약 72%가 본인 작성(git blame)
- 소비자 앱: 주문·결제·반품/교환 `features/order` 34개 파일(4263ccd), 게시물 피드·쇼룸·4탭 재편(78713bd, e4d88fe, 3dfb0c3), 약관·FAQ·본인인증 결과 화면(ab2b203), 상품/1:1 문의 분리(776d701, 8a63ed6), 공용 컴포넌트 26개 ✅
- 401 토큰 갱신 개선: admin 9a078ee·528344d, partners 4fd3e4c·4b5d82a, studio faabfdd, front-end f4977ec ✅
- 서버 API 미제공 화면의 UI + DEV 전용 목업: 파트너센터 정산·배송 정책·탈퇴(`common/utils/devMock.ts`), 소비자 앱 주문 취소 요청(`cancelRequestService.ts:19`) ✅ (사용자 답변: 기여에 포함)
- 소비자 앱 빌드 설정: 스플래시 config plugin(f4977ec, cd15f1a, 3876c98), Pretendard 폰트(31e6bf6), Google·Naver 로그인 스킴(9672371, b3b0bd9), TestFlight 설정(e913519), APK 워크플로(9822879, 2574766) ✅

## 4. 핵심 기능 (구현 확인된 것만)

- 계약 관리: 작성 → 운영자 검토 → 양측 서명 → 체결 문서 ✅ (`partners/src/features/contracts/services/contractService.ts:22-139`, `studio/.../creatorContractService.ts:17-79`, `admin/src/features/contract/` / 2026-10-12 화면 확인)
- 공구 관리: 준비 조건 3개(물량 확보·게시물 등록·운영자 승인)와 상태를 3개 콘솔에서 처리 ✅ (`groupBuyService.ts:21-120`, `creatorGroupBuyService.ts:16-96`, `adminGroupBuyService.ts` / 2026-10-12 화면 확인)
- 연결·소통 메시지: 스레드, 읽음, S3 presigned 업로드(진행률), 서명 URL 다운로드 ✅ (`partners/.../threadService.ts:113-174`, `attachmentUploader.ts:36-75`, `studio/.../threadService.ts:117-178`)
- 주문·반품 처리(파트너): 9개 탭, 발주서 xlsx, 송장 일괄 업로드, 취소 승인/거절, 반품 검수 ✅ (`orderService.ts:23-202`, `claimService.ts:18-147`) — 개발 서버 주문 0건이라 화면 미확인
- 소비자 주문·결제: 체크아웃 → PortOne 결제 → 주문 상세·배송 조회·반품/교환 ✅ (`front-end/src/features/order/`, `PortOnePaymentModal.tsx`)
- 게시물 작성(스튜디오): 사진·본문·미리보기·인사이트 ✅ (`postService.ts:172-232`, `postInsightService.ts:65` / 2026-10-12 화면 확인)
- 입점·변경 요청 심사(운영자) ✅ (`admin/src/common/router/routes.tsx`)

## 5. 구조

- 웹 3종(React + Vite)과 소비자 앱(React Native + Expo)이 하나의 백엔드 `/v1` REST API를 역할별 경로(/user, /seller, /creator, /admin)로 호출 ✅ (각 저장소 `src/common/lib/apiInstance.ts`)
- 인증: 웹은 쿠키, 앱은 expo-secure-store에 Bearer 토큰. 401 시 refresh 1회 공유·재시도 ✅ (`admin/apiInstance.ts:24-65`, `partners/apiInstance.ts:24-65`, `front-end/apiInstance.ts:44-81`)
- 데이터: TanStack Query(요약 배지 refetchInterval 폴링), Zustand(소비자 앱·파트너센터) ✅
- 파일: S3 presigned URL 직접 업로드, Content-Disposition 서명 URL 다운로드 ✅
- 스튜디오: Vercel Functions(`api/kakao-token.ts`, `api/image-proxy.ts`), FCM 웹 푸시(`src/common/lib/firebase.ts`) ✅

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                     | 근거                                                                    |
| -------- | ------------------------ | ----------------------------------------------------------------------- |
| language | TypeScript               | 4개 저장소 tsconfig(strict)                                             |
| frontend | React                    | 4개 저장소                                                              |
| frontend | Vite                     | 웹 3종 vite.config.ts                                                   |
| frontend | Tailwind CSS             | 웹 3종 @tailwindcss/vite, index.css                                     |
| frontend | shadcn/ui                | components.json, src/components/ui                                      |
| frontend | Radix UI                 | src/components/ui/*.tsx                                                 |
| frontend | React Router             | 웹 3종 App.tsx:1                                                        |
| frontend | TanStack Query           | 4개 저장소 (admin src/common/lib/queryClient.ts:1 등)                   |
| frontend | Zustand                  | front-end src/common/stores/createStore.ts:1, partners createStore.ts:1 |
| frontend | React Hook Form          | partners Form.tsx:9, studio OnboardingPage.tsx:2                        |
| frontend | Tiptap                   | admin Editor.tsx:3-14, partners Editor.tsx:1-8                          |
| frontend | Axios                    | 4개 저장소 apiInstance.ts                                               |
| mobile   | React Native, Expo       | front-end index.ts:4                                                    |
| mobile   | React Navigation         | front-end src/App.tsx:1                                                 |
| mobile   | NativeWind               | front-end babel.config.js:4                                             |
| backend  | Vercel Functions         | studio api/kakao-token.ts, api/image-proxy.ts                           |
| infra    | Vercel                   | 웹 3종 vercel.json, GitHub Deployments(vercel[bot])                     |
| infra    | EAS Build                | front-end eas.json                                                      |
| infra    | GitHub Actions           | front-end .github/workflows/*.yml, 실행 기록                            |
| other    | PortOne                  | front-end PortOnePaymentModal.tsx:1                                     |
| other    | Firebase Cloud Messaging | studio src/common/lib/firebase.ts                                       |
| tooling  | ESLint, Prettier         | 4개 저장소 설정 파일                                                    |

- AI 코딩 도구: Claude Code (사용자 답변)
- 제외(선언만 있고 미사용): admin의 zustand·remeda·date-fns·react-day-picker·react-hook-form, partners의 remeda, studio의 @radix-ui/react-label, front-end의 @portone/browser-sdk

## 7. 현재 상태·배포

- 개발 상태: 진행 중 ✅ (사용자 답변)
- 배포: Vercel, 개발·검수용 ✅ (사용자 답변)
  - 파트너센터 https://front-end-partners-one.vercel.app/ — HTTP 200 (2026-10-12)
  - 쇼룸 스튜디오 https://front-end-studio-one.vercel.app — HTTP 200 (2026-10-12)
  - 운영자 콘솔도 HTTP 200이나 내부 도구라 포트폴리오에서 제외
- 소비자 앱: EAS 개발용 APK 빌드(GitHub Actions, 마지막 성공 2026-10-06)까지 확인, 스토어 출시 없음 ✅

## 8. 결과

- 없음 — 개발 중 (사용자 답변)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 토큰 만료 시 동시 요청이 각자 refresh → 서버의 refresh 토큰 회전으로 첫 요청 외 모두 401 → 해결: 진행 중인 refresh promise 공유 + `_retry` 가드 (admin 9a078ee, partners 4fd3e4c, studio faabfdd)
- 문제: 경로 없이 저장된 인증 쿠키가 `/group-buy`에 남아 새 토큰을 가림 → 해결: 루트 경로 저장, 하위 경로 사본 삭제 (admin 9a078ee, partners 4fd3e4c)
- 문제: 응답 없는 네트워크·CORS 오류에서 인터셉터 크래시, 401 무한 재시도 → 해결: optional chaining, 원래 오류 reject, 대체 메시지 (admin 528344d, partners 4b5d82a)
- 문제: 교차 출처 첨부가 새 탭으로 열려 SPA 상태 손실 → 해결: Content-Disposition 서명 URL 매번 발급(5분 만료), 400ms 간격 순차 저장 (partners 02610e2 → 3a5637f, studio 6b4d8e7·d749f6c·1c6fefd)
- 문제: CloudFront 원본을 canvas가 CORS로 읽지 못해 재크롭 불가 → 해결: 허용 호스트·https·크기 상한이 있는 같은 출처 Vercel 이미지 프록시 (studio 4afd63a)
- 문제: Naver 팝업을 닫으면 로딩이 끝나지 않음 → 해결: 팝업 closed 폴링 + 타임아웃 (studio 1bd0ea0)
- 문제: iOS 글자가 Android보다 작게 보임 → 해결: Pretendard 정적 폰트 번들, 굵기별 fontFamily 매핑 (front-end 31e6bf6)
- 문제: 스플래시 수정 후 APK 빌드 연속 실패(AAPT) → 해결: `android:` 접두어 누락 수정 (front-end cd15f1a 실패 → 3876c98 성공, Actions 기록 2026-09-24)
- 문제: Google 로그인 계정 선택 후 멈춤 / Naver 클라이언트 ID 밑줄로 App Store 업로드 거부 위험(ITMS-90158) → 해결: 리다이렉트 스킴 등록 / 고정 URL 스킴 (front-end 9672371, b3b0bd9)
- 문제: 실서버 CORS가 Content-Disposition을 숨겨 다운로드 파일명이 비어 있음 → 해결: 서버 규칙과 같은 기본 파일명 (partners 9f3209d)

## 10. 링크

- demo: 파트너센터 (개발·검수 서버) https://front-end-partners-one.vercel.app/
- demo: 쇼룸 스튜디오 (개발·검수 서버) https://front-end-studio-one.vercel.app
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

## 12. 관련 활동·수상·경력 (사용자 답변)

- 팀이 모두의창업(modoo.or.kr)에 지원, 심사 중 (사용자 답변)

## 13. 배운 점 (사용자 답변)

- 프론트엔드와 백엔드 저장소를 나눠 협업한 첫 프로젝트였다.
- 커밋·PR·머지를 잘 모르는 상태에서 시작해, 작업 브랜치 → PR → 머지 흐름을 이 프로젝트에서 익혔다.

## 14. 제외한 내용과 이유

- 소비자 앱 공구 게시물 표시 — `postService.ts:19-42`가 `__DEV__` 조건 없이 모든 빌드에서 가짜 게시물 7개·가짜 공구 필드를 덧씌움. 서버에 GROUP_BUY 타입이 없어 기능에서 제외
- 상품 상세 공구 묶음, 상품·재고 조회 실패 시 목업 대체 — `productService.ts:22-41`, `ProductDetailView.tsx:281`
- PASS 본인인증 — 소비자 앱 `identityVerificationService.ts:22-27`(항상 성공), 스튜디오 `mockIdentity.ts`, 운영자 콘솔 더미 값
- 스텁 화면 — 운영자 콘솔 PlaceholderPage 20개, 파트너센터 홈·성과 관리 ComingSoon과 `<div>aasdf</div>` 30개(대부분 다른 작업자), 스튜디오 홈·정산·성과·기본정보
- 소비자 앱 데모 버전 — ab2cede에서 추가, 4b83311에서 삭제
- 테스트 — 4개 저장소 모두 0개, LICENSE 없음
- 수치(커밋·PR·줄 수) — 기여도가 아니라 참고 자료라 JSON에 넣지 않음
- 모두의창업 지원 — 심사 중이라 결과가 아니므로 outcomes에서 제외
- 참고(포트폴리오와 무관, 수정하지 않음): studio favicon이 없는 `/vite.svg`를 가리킴, studio 계약 상세 "공구 관리 열기" 버튼이 아직 「준비 중」 토스트, partners `claimService.saveBlob`이 object URL을 즉시 revoke(실행 미확인)
