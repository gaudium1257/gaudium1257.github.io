# GUDORY (구도리) 팩트시트

- 조사일: 2026-11-02
- 저장소: https://github.com/Gaslighteam/GUDORY (공개, `gh repo view` → `PUBLIC`) / 기준 커밋: `4e3dce8` (origin/main, PR #72). 앱 코드는 릴리스 커밋 `7313e2f`와 같음(`app/` 트리 동일 확인)
- 내 git 신원: `gaudium1257 <twehokim@gmail.com>`, `김태호 (Taeho Kim) <twehokim@gmail.com>` (사용자 답변)
- 로컬 폴더 `GUDORY`, `GUDORY-apk`, `GUDORY-debugpose`, `GUDORY-docs`, `GUDORY-layout`, `GUDORY-lead`는 저장소 하나와 그 worktree → 저장소 1개로 조사 ✅
- 팀원 이름: 사용자 요청에 따라 넣지 않음

## 1. 개요

- 한 줄 소개: 다른 사람에게 폰을 맡겨 찍을 때, 찍는 사람에게 한 번에 한 문장씩 구도 교정을 알려 주는 Android 카메라 앱 ✅ (README.md:3)
- 무엇을, 누구를 위해, 어떤 문제를 푸는지: 폰을 받은 사람은 주인의 "감각"을 모르고, 격자나 오버레이로는 무엇을 얼마나 고칠지 알 수 없음. 목표 구도와의 차이를 4축(수평·거리·좌우·높이)으로 재고, 교정 하나만 문장으로 보여 줌. 셔터는 사람이 누름 ✅ (README.md "Problem", "Solution"; `app/lib/features/feedback/instruction_text.dart`)
  - README는 "가장 큰 교정(biggest correction)"이라고 쓰지만, 코드는 정해진 순서로 처음 벗어난 축을 고름(`coach_engine.dart:165` `_firstOutside`). 그래서 코드 기준으로 적음
- 맥락: 해커톤. 2026 InThon, 24시간 무박 2일, 고려대학교 정보대학 주최, 주제 "감각", 팀 Gaslighteam ✅ (사용자 답변, README.md:5)

## 2. 기간·팀

- 기간: 2026-10-31 ~ 2026-11-01 (첫 커밋 `ac20cd6` 10-31 17:01, 마지막 커밋 `4e3dce8` 11-01 08:34) ✅
- 커밋(참고용, 전체 브랜치): 전체 171개(merge 제외 91개). 내 커밋은 merge 제외 66개이고, 그중 main에 들어간 것은 59개 ✅ (`git rev-list`)
- 팀 인원·내 역할: 4명, 팀장. 카메라 앱·통합·릴리스 담당 ✅ (사용자 답변, README "Team")

## 3. 내가 한 일

근거: origin/main 기준 `git blame` 줄 수(내 줄 / 전체 줄)와 내 커밋·PR. 팀원 커밋과 merge 커밋은 제외.

- 모듈 간 인터페이스와 공통 모델 설계 ✅
  - `core/contracts.dart` 57/57, `core/models.dart` 186/186, `core/orientation.dart` 87/87
  - 커밋 `94e281f`, `fe6805b`, `848ac05`, `9833355`
- 카메라 화면 UI(모드 전환, 5단계 바, 레퍼런스 시트, 줌 룰러, 스와이프 전환, 안내 말풍선) ✅
  - `camera_screen.dart` 785/785, `widgets/controls.dart` 557/557, `widgets/mode_controls.dart` 594/594, `widgets/reference_sheet.dart` 166/166
  - PR #6, #13, #55, #57, #58, #71
- 카메라 서비스와 분석 프레임 스트림 ✅ (`camera_service.dart` 210/210, 커밋 `3095326`)
- 원본 해상도 촬영, 미리보기 영역 저장, 가로 사진 회전, EXIF 처리, 앨범 저장 ✅
  - `framing.dart` 159/159, `exif_orientation.dart` 74/74
  - 커밋 `976c063`, `e280cb2`
- 거리 비프, 완료음, 진동, 시스템 셔터음 ✅ (`sensory_feedback.dart` 106/106, `MainActivity.kt`, PR #5, #58, #62)
- 안내 문구 한국어·영어·일본어 ✅ (`instruction_text.dart` 200/200, PR #21, #52)
- 설정 화면, 앱 안 사용법 투어, 데이터 라이선스 화면 ✅
  - `settings_screen.dart` 313/313, `tutorial/camera_tour.dart` 357/357, `data_licenses.dart` 46/46
  - PR #61, #70
- 팀원 모듈(포즈 소스, 코칭 엔진, 레퍼런스 분석기, 장면 추천기)을 앱에 통합 ✅
  - `app/providers.dart` 67/67, `camera/coaching.dart` 200/226
  - 커밋 `0e5cf39`, `71af6a7`, `65936d6`
- 추천기 v2(CADB 학습 선형 모델, 학습 스크립트와 앱 내 추론, 학습 데이터 필터 강화) ✅
  - `tools/train_recommender_v2.py` 276/276, `scene/composition_model.dart` 163/163
  - 커밋 `8399f12` (PR #64). v2를 기여로 넣는 것은 사용자 확인
- Android 릴리스 빌드 오류 수정과 v0.1.0 APK 배포 ✅ (PR #2, #4, #23, 릴리스 작성자 `gaudium1257`)
- 로고 SVG로 런처 아이콘·앱 내 로고를 만드는 스크립트 ✅ (`tools/brand/make_icons.py` 151/151). 로고 디자인은 팀원 몫(사용자 답변)이라 제외
- Claude Code와 함께 작업 ✅ (내 커밋 66개 중 65개에 `Co-Authored-By: Claude …` 트레일러)

## 4. 핵심 기능 (구현 확인된 것만)

- 추천 모드: 사람을 가린 배경을 기기 안의 CLIP으로 임베딩하고, `recommend.json`(v1)과 `recommend_v2.json`(v2)으로 목표 구도를 정함. 5단계 바로 인물↔배경 비중을 고름 ✅ (`scene/recommender.dart:55-66`, `scene/composition_model.dart`)
- 맞춤 모드: 레퍼런스 사진 여러 장 중 선택한 사진의 구도를 목표로 삼음 ✅ (`camera/widgets/reference_sheet.dart`, `camera/shot_state.dart`)
- 한 문장 코칭: 지시 하나와 방향 화살표. 히스테리시스와 1.5초 유지 시간 적용 ✅ (`instruction_text.dart`, `app/providers.dart:38`)
  - 순서: 수평 → 거리 → 좌우 → 높이로 검사해 처음 벗어난 축 하나를 안내 ✅ (`core/models.dart:4` `enum CoachAxis { level, distance, horizontal, height }`, `coach_engine.dart:165-168`)
  - 수평 허용 범위 ±3° ✅ (`core/models.dart` `tolRollDeg = 3`)
  - 단위: 걸음 0.6 m, 주먹 10 cm. 카메라 화각으로 환산 ✅ (`coach/axes.dart` `_fovSpan`, `/ 0.6`, `/ 0.1`)
  - 이 부분은 코칭 엔진(팀원 담당)의 기능이라 "내가 한 일"에는 넣지 않음
- 사진가 규칙: 추천 모드의 1–3단계에서 머리 위 여백, 관절에서 잘리지 않는 프레임, 바라보는 방향 여백을 반영 ✅ (`coach/photo_rules.dart:1-3`, `camera/coaching.dart:88`). 규칙 본체는 팀원 커밋 `187e6eb`이고, 내 커밋 `ac7d181`과 `177306c`는 보는 방향 여백을 보완함
- 소리·진동 피드백: 비프 간격 1000ms→150ms, 정렬 시 띵·진동·노란 셔터 링 ✅ (`sensory_feedback.dart:101-104`, `camera_screen.dart:131-134`)
- 안내 언어 KO/EN/JA ✅ (`instruction_text.dart:8`)
- 세로·가로 자동 판별, 원본 해상도로 미리보기 그대로 GUDORY 앨범에 저장 ✅ (`camera/shot_orientation.dart`, `camera_service.dart:79`, `camera_screen.dart:140-184`)
- 첫 실행 시 사용법 투어, 설정(언어, 비프, 완료음, 진동, 격자, 가운데 표시) ✅ (`camera_screen.dart:371`, `settings_screen.dart:64-107`)
- 줌 룰러, 핀치 줌, 스와이프 카메라 전환. 전면 카메라는 코칭 없는 일반 카메라 ✅ (`camera_screen.dart:327-351`, PR #46)

## 5. 구조

- Flutter 앱 하나에 `camera`·`feedback`·`coach`·`scene` 모듈이 `core/contracts.dart` 인터페이스로 연결되고, Riverpod provider로 조립됨 ✅ (`app/lib/app/providers.dart`)
- 카메라 NV21 프레임(`FrameBus`) → ML Kit 포즈 → 코칭 엔진이 목표 구도와 비교 → 문구와 피드백 ✅
- 목표 구도의 두 경로 ✅
  - 추천 모드: 셀피 분할로 인물을 가림 → CLIP ONNX → 추천 데이터
  - 맞춤 모드: 레퍼런스 사진 → ML Kit 포즈
- 서버 없음, 모든 추론이 기기 안에서 실행 ✅ (`http` import 0건, `api/`에는 README만 있음)
- 오프라인 Python 파이프라인(`tools/`)이 학습 사진으로 추천 데이터를 만듦 ✅
- 추천 데이터 v1 규모: 5,603장 중 3,233장 통과, 배경 클러스터 103개 ✅ (README 기재, 사용자 확인). 팀원 작업이라 "내가 한 일"에는 넣지 않음

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술          | 근거                                                                                                                    |
| -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------- |
| language | Dart          | `app/lib/**`                                                                                                            |
| language | Python        | `tools/*.py`                                                                                                            |
| mobile   | Flutter       | `app/pubspec.yaml`, `flutter test` 실행                                                                                 |
| mobile   | Riverpod      | `app/lib/app/providers.dart` 외 15개 파일 import                                                                        |
| ai-ml    | Google ML Kit | Pose Detection `coach/pose_source.dart`, `coach/reference_analyzer.dart` / Selfie Segmentation `scene/person_mask.dart` |
| ai-ml    | ONNX Runtime  | `scene/clip_runner.dart`, `tools/background_clip.py:110`                                                                |
| ai-ml    | CLIP          | `scene/clip_runner.dart`, `tools/fetch_models.py`                                                                       |
| ai-ml    | scikit-learn  | `tools/train_recommender_v2.py:57-58`, `tools/recommendation_assets.py:68`                                              |
| ai-ml    | MediaPipe     | `tools/pose_analysis.py:338`, `tools/background_clip.py:73`                                                             |

- JSON에서 뺀 실사용 기술(설명하는 비중이 작음): Kotlin(`MainActivity.kt` 셔터음 채널), go_router, camera plugin, audioplayers, vibration, sensors_plus, gal, image_picker, NumPy, Pillow
- AI 코딩 도구: Claude Code (사용자 답변, 커밋 트레일러)

## 7. 현재 상태·배포

- 개발 상태: 종료(completed) ✅ (사용자 답변)
- 배포: GitHub Releases / https://github.com/Gaslighteam/GUDORY/releases/tag/v0.1.0 ✅
  - `GUDORY-0.1.0.apk`, 156,388,180 bytes, arm64-v8a, `7313e2f`에서 빌드
  - 2026-11-02 확인: 릴리스 페이지와 APK 다운로드 URL 모두 HTTP 200
  - 로컬 `apk-release/GUDORY-0.1.0.apk`의 SHA-256이 릴리스 노트와 같음
- 지원 플랫폼: Android만. `ios/` 폴더 없음 ✅

## 8. 결과

- 2026 InThon에서 발표와 시연 ✅ (사용자 답변)
- 수상: 미정. 결과가 나오면 추가 (사용자 답변)
  - **갱신 2026-11-12: 대상 수상 ✅ (사용자 답변 "대회에서 대상 수상함")**. 날짜는 대회가 끝난 2026-11-01 이후 2026-11-12 이전이라 월까지만 `2026-11`로 적음
- 실제 사용자·테스트 참가자 수: 없음 (사용자 답변)
- 테스트 ✅ (2026-11-02, origin/main 사본, Flutter 3.44.8, 사용자 확인)
  - `flutter test test` → 235개 통과
  - `flutter test lib/features/scene` → 72개 통과, 3개 건너뜀(CLIP 모델 경로가 필요한 통합 테스트)
  - Python 테스트(`tools/test_*.py`)는 실행하지 않음 ❓
- 추천기 v2 측정 ✅ (`tools/report_v2.md`, 사용자 확인)
  - 5-fold 교차검증(CADB 694장): 구도(framing) 일치율 56.5% → 63.1%, 인물 가운데 배치 비율 90.2% → 11.1%
  - 별도 500장(Open Images. v1은 이 사진들로 만들어졌고 v2는 학습하지 않음): 가운데 배치 83.8% → 6.6%. 구도 일치율은 v1 63.2%, v2 62.4%로 v1이 약간 높음
  - JSON 하이라이트에는 발표 9쪽("84% → 6.6%")과 맞추려고 500장 수치를 씀
- v2 모델 구성 ✅ (발표 10쪽과 코드가 일치)
  - 입력 42개 = 배경 PCA 32 + 단계·방향 원핫 10 (`train_recommender_v2.py` `K = 32`, `composition_model.dart` 주석)
  - 파일 크기 162,342 bytes (`tools/report_v2.md`)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 릴리스 APK만 실행 직후 종료 → 해결: R8 full mode가 WorkManager의 Room DB 생성자를 제거한 것을 확인하고 `proguard-rules.pro`에 keep 규칙 추가 (커밋 `a6d4829`, PR #23) ✅
- 문제: 가로로 촬영 방향을 고정하면 미리보기가 흔들림 → 해결: 촬영은 세로로 고정하고 저장할 때 회전 (커밋 `976c063`) ✅
- 문제: 소비하는 쪽이 없어도 분석 프레임을 계속 복사해 GC가 자주 일어남 → 해결: 구독자가 있을 때만 스트림 실행 (커밋 `3095326`) ✅
- 문제: Android 10에서 앨범 저장 실패 → 해결: `WRITE_EXTERNAL_STORAGE` maxSdkVersion을 29로 덮어씀 (커밋 `983e131`) ✅
- 문제: v1 추천이 인물을 대부분 가운데에 배치 → 해결: v2가 좌우는 인물이 선 쪽을 따르고 중심에서의 거리만 학습 (커밋 `8399f12`, `tools/report_v2.md`) ✅
- 셔터부터 저장까지 시간 단축(커밋 `e280cb2`): 사용자 요청에 따라 수치는 쓰지 않고 JSON에서도 제외

## 10. 링크

- 저장소: https://github.com/Gaslighteam/GUDORY ✅ (공개 허락)
- APK 릴리스: https://github.com/Gaslighteam/GUDORY/releases/tag/v0.1.0 ✅
- 시연 영상: https://youtu.be/D7Pjiu4HtOw ✅ (발표 자료 PDF 2쪽. 2026-11-02 확인 결과 HTTP 200, 제목 "Inthon GaslighTeam". 팀원 개인 채널에 올라가 있어 채널명에 팀원 실명이 보임)
- 발표 자료 PDF: 링크로 넣지 않음(사용자 선택 1번). 팀원 실명(11쪽), 팀원 얼굴 사진(1, 3–7, 11쪽), 출처를 확인하지 못한 인물 사진(2쪽)이 들어 있음. 이미지 후보로 인물이 없는 9, 10쪽과 사용자 본인이 나오는 5, 8쪽(사용 허락)만 사용

## 11. 이미지 후보

화면 캡처를 만든 방법 (2026-11-02):

- 릴리스 APK는 arm64 전용이라 x86_64 에뮬레이터에서 Flutter 엔진이 로드되지 않음(`libflutter.so is for EM_AARCH64`)
- 그래서 같은 앱 코드(`origin/main`의 `app/`, `7313e2f`와 동일)를 저장소 밖 임시 폴더에서 `flutter build apk --release --target-platform android-x64`로 빌드하고, 릴리스와 같은 CLIP 모델 파일을 넣음
- Android Emulator(Pixel 2 프로필, Android 37)에서 실행. 후면 카메라는 에뮬레이터 가상 장면(사람 없는 방)이라 모든 화면이 "사람이 화면에 보이게 해 주세요" 상태이고, 실제 인물 코칭 화면은 없음
- 캡처에 개인정보나 토큰은 없음(상태 표시줄에는 시계만 있음)

| 파일 (`images/` 사본)             | 종류      | 크기      | 무엇을 보여주는지                                                                            | 원본 경로                                                     |
| --------------------------------- | --------- | --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `images/icon.png`                 | 아이콘    | 192×192   | 앱 런처 아이콘(검은 바탕에 노란 G). 저장소에서 가장 큰 정사각형 아이콘이고 512px 원본은 없음 | `app/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |
| `images/thumbnail.png`            | 가로 대표 | 1392×252  | 어두운 배경용 "GUDORY" 워드마크(로고 디자인은 팀원)                                          | `app/assets/brand/logo_on_dark.png`                           |
| `images/01-recommend-mode.png`    | 앱 화면   | 1080×1920 | 추천 모드 카메라 화면: 안내 말풍선, 3×3 격자, 가운데 표시, 인물↔배경 단계 버튼, 셔터         | 에뮬레이터 캡처                                               |
| `images/02-composition-level.png` | 앱 화면   | 1080×1920 | 인물↔배경 5단계 선택 패널. 안내 문구는 영어(Point the camera at the person)                  | 에뮬레이터 캡처                                               |
| `images/03-language-picker.png`   | 앱 화면   | 1080×1920 | 안내 언어 선택(한국어 · English · 日本語)                                                    | 에뮬레이터 캡처                                               |
| `images/04-custom-mode.png`       | 앱 화면   | 1080×1920 | 맞춤 모드: "레퍼런스 사진을 추가해 주세요"와 레퍼런스 추가 버튼                              | 에뮬레이터 캡처                                               |
| `images/05-tour.png`              | 앱 화면   | 1080×1920 | 첫 실행 시 나오는 앱 안 사용법 투어(1/10)                                                    | 에뮬레이터 캡처                                               |
| `images/06-settings.png`          | 앱 화면   | 1080×1920 | 설정: 안내 언어, 거리 알림음, 완료 소리, 진동, 격자선                                        | 에뮬레이터 캡처                                               |

| `images/07-slide-training-data.png` | 가로 슬라이드 | 1920×1080 | 발표 9쪽: CADB 9,497장 → 학습 694장 → 가운데 추천 84% → 6.6%. 수치는 `docs/cadb.md`, `tools/report_v2.md`와 일치 | `GUDORY_발표.pdf` 9쪽(Windows PDF API로 렌더링) |
| `images/08-slide-composition-model.png` | 가로 슬라이드 | 1920×1080 | 발표 10쪽: v2 구도 모델 구성(로지스틱·릿지 회귀, 가중 중앙값, CADB 점수 가중치, 입력 42개, 162 KB) | `GUDORY_발표.pdf` 10쪽 |

| `images/09-slide-coaching-flow.png` | 가로 슬라이드 | 1920×1080 | 발표 5쪽: 실제 기기 코칭 3단계. 모드 고르기 → "폰을 똑바로 세워 주세요" 지시 → 구도가 맞으면 "좋아요! 지금 셔터를 눌러 주세요"와 노란 셔터 링 | `GUDORY_발표.pdf` 5쪽 |
| `images/10-slide-architecture.png` | 가로 슬라이드 | 1920×1080 | 발표 8쪽: 처리 흐름(ML Kit 포즈, ML Kit+CLIP 배경, 가속도 센서 → 추천 + 사진가 규칙 → 판단 → 말하기)과 화살표가 붙은 "주먹 두 개만큼 아래로" 지시 화면 | `GUDORY_발표.pdf` 8쪽 |

- 5, 8쪽의 인물은 사용자 본인이고 사용을 허락함(사용자 답변)
- 8쪽 제목의 "최적의 구도"는 슬라이드 원문이라 이미지 속에 그대로 있음. 대체 텍스트와 JSON에는 쓰지 않음
- 발표 1, 4, 6쪽에도 실제 화면이 있지만 5, 8쪽과 겹쳐 넣지 않음

## 12. 관련 활동·수상·경력 (사용자 답변)

- 연결할 항목 없음

## 13. 배운 점

사용자가 맡김("잘 찾아서 써줘", "카메라로 인물 인식하는 프로젝트는 처음"). 아래는 근거 커밋에 기반한 초안이니 본인 표현으로 고쳐 주세요.

- 미리보기 영역·분석 프레임·저장 사진의 좌표를 하나로 맞춰야 안내와 결과 사진이 일치함 (근거: `976c063`, `framing.dart`)
- 디버그 빌드에서 되던 앱이 릴리스 최적화로 실패할 수 있어 실기기 릴리스 확인이 필요함 (근거: `a6d4829`)
- 인터페이스를 먼저 정하고 임시 구현(Fake)으로 시작해 교체하는 방식으로 4명이 동시에 개발함 (근거: `app/providers.dart:2-3` 주석 "Each provider starts with a Fake")

## 14. 제외한 내용과 이유

- README, 데모 영상 대본(`docs/demo-script.md`): git 작성자는 내 계정이지만 사용자가 본인 작업이 아니라고 답함
- 로고 디자인: 팀원 디자인(사용자 답변)
- LLM 다국어 안내 프록시(Vercel + Lablup): `api/`에 README와 `.gitkeep`만 있고 미구현
- iOS / TestFlight: 문서에만 있고 `ios/` 폴더 없음
- 음성 안내, 핸드오버 모드, 자동 셔터, 결과 화면: 구현 후 제거됨 (`fbc2f32`, `f6550de`, `df5e544`)
- 촬영 후 구도 점수: 실험만 하고 앱에 넣지 않음 (`147e20c`, `docs/cadb.md`)
- 카테고리 휠, 좌우 구역 목표, 다중 구도 프로토타입: PR이 닫혔거나 열린 상태 (#9, #50, #51, #60)
- `connectivity_plus`, `http`, `sqflite`: pubspec에만 있고 import 0건
- 셔터→저장 시간 수치: 사용자 요청으로 제외
- 발표 자료의 "ML Kit 포즈 인식으로 관절 33개 추적": 33은 ML Kit 랜드마크 수(`photo_rules.dart`의 `p.length != 33`)로 맞지만, 기술 설명 수준이라 JSON에는 넣지 않음
- 릴리스 노트의 테스트 기기 시리얼 번호: 민감 정보
