# Dayce 팩트시트

- 조사일: 2026-10-12
- 저장소: https://github.com/gaudium1257/2026320053_NEXTCON (공개, GitHub API `visibility: public`) / 기준 커밋: `4a6607c` (= 태그 `v1.0.0`)
- 내 git 신원: gaudium1257 (이메일은 개인 연락처라 생략) ✅ 사용자 답변

상태 표시: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가. 이 문서에 남은 🟡·❓ 항목은 없습니다.

## 1. 개요

- 한 줄 소개: "Dayce – 일정과 일기를 한 곳에" ✅ (`pubspec.yaml` `description`, 기획서·보고서)
- 무엇을, 왜: 캘린더 앱과 다이어리 앱을 따로 써야 하는 불편을 줄이려고 만들었습니다. 일정과 일기를 날짜 기준으로 한 앱에서 관리합니다 ✅ (사용자 제공 기획서 2항)
- 맥락: 2026 NE:XT CONTEST(고려대학교 정보대학 소프트웨어 경진대회)에 개인으로 출품 ✅ (사용자 답변, 기획서·보고서의 지원형태 "개인")
- 대회 페이지: Notion, HTTP 200 (2026-10-12)

## 2. 기간·팀

- 실제 개발 기간: 2026-03 ~ 2026-05 ✅ 사용자 답변
- git 커밋 기간: 2026-05-13 ~ 2026-05-15 ✅ (`80a66e6` ~ `4a6607c`)
- 커밋: 전체 3 / 내 커밋 3 (참고용)
- 팀: 1인 ✅ (사용자 답변, 기획서). 역할: 기획·개발 ✅ 사용자 승인 문구
- 개발 방식: Claude Code를 활용한 바이브 코딩 ✅ 사용자 답변

## 3. 내가 한 일

- 앱 전체를 Claude Code 바이브 코딩으로 구현 ✅ (사용자 답변, 커밋 3개 모두 본인)
- 서비스 기획과 기능 정의 ✅ (사용자 제공 기획서)
- 네비게이션 바를 침범하던 레이아웃 수정 ✅ (사용자 답변 + 커밋 `ca5e122`)
- 시연 영상 제작과 기획서·보고서 작성 ✅ (사용자 답변, YouTube HTTP 200, PDF 제공)

## 4. 핵심 기능 (구현 확인된 것만, 2026-10-12 실기기 스크린샷으로도 확인)

- 일/주/월/년 캘린더와 좌우로 넘기는 이동 ✅ (`next_contest/lib/screens/calendar_screen.dart:15`)
- 일정 추가·수정·삭제: 제목, 날짜·시간, 종일, 메모, 색상 ✅ (`next_contest/lib/screens/event_form_screen.dart`)
- 반복 일정(매일/매주/매달/매년)과 반복 종료일 ✅ (`next_contest/lib/models/event.dart:141`)
- 여러 날 일정을 주 단위 그리드의 줄(track)에 배치 ✅ (`next_contest/lib/utils/calendar_layout.dart:36`)
- 길게 눌러 끌어서 기간 선택 → 그 기간이 채워진 일정 입력 화면 ✅ (`next_contest/lib/screens/calendar_screen.dart:592`)
- 일 보기: 종일 일정 배너, 시간표, 시간이 겹치는 일정 나란히 배치 ✅ (`assignLanes`, `next_contest/lib/utils/calendar_layout.dart:107`)
- 하루 한 편 일기: 기분 이모지 6종, 글자 수, 줄 노트, 저장 안 하고 나갈 때 경고 ✅ (`next_contest/lib/screens/diary_form_screen.dart`)
- 일기 목록: 월별 묶음, 월 필터 ✅ (`next_contest/lib/screens/diary_list_screen.dart:91-105`)
- 설정: 기본 보기, 주 시작 요일, 기본 색상, 줄 노트, 기본 기분 ✅ (`next_contest/lib/services/settings_service.dart`)
- 기기 안의 SQLite 저장, DB 버전 1→3 마이그레이션 ✅ (`next_contest/lib/services/database_service.dart:18`)

기획 대비 바뀐 점 (보고서 기재, 코드로 확인 ✅):

- Room DB 대신 sqflite를 썼습니다
- 장기 일정은 텍스트 요약 대신 여러 날 막대로 표시합니다
- 기획서에 없던 기본 보기 설정을 추가했습니다

## 5. 구조 ✅

- 화면(`screens/`)이 `DatabaseService`(sqflite)와 `SettingsService`(shared_preferences)를 거쳐 기기 안에서 데이터를 읽고 씁니다
- 서버, 외부 API, 네트워크 호출은 없습니다

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                                  | 근거                                    |
| -------- | ------------------------------------- | --------------------------------------- |
| language | Dart                                  | `lib/**/*.dart`                         |
| mobile   | Flutter, shared_preferences           | `main.dart`, `settings_service.dart:2`  |
| database | SQLite, sqflite                       | `database_service.dart:2`               |
| tooling  | Claude Code                           | 사용자 답변                             |
| tooling  | flutter_lints, flutter_launcher_icons | `analysis_options.yaml`, `pubspec.yaml` |
| tooling  | Python, Pillow                        | `scripts/gen_icon.py:2`                 |

## 7. 현재 상태·배포

- 상태: completed (대회 후 개발 종료) ✅ 사용자 답변
- 배포: not-deployed (스토어 미출시) ✅ 사용자 답변
- 배포 파일: GitHub Releases `v1.0.0` "Dayce 1.0.0" (2026-05-15)에 `app-release.apk`를 공개 ✅ (GitHub API, 2026-10-12)
- 참고: 릴리스 빌드는 디버그 키로 서명합니다 (`next_contest/android/app/build.gradle.kts:41`)

## 8. 결과

- 2026 NE:XT CONTEST 출품 ✅
- 시연 영상 YouTube 공개 ✅ (HTTP 200, 2026-10-12)
- APK를 GitHub Releases에 공개 ✅
- 수상은 없었습니다 ✅ 사용자 답변. 포트폴리오 결과 항목에는 넣지 않았습니다

## 9. 문제와 해결

- 문제: 앱 화면이 시스템 네비게이션 바 영역을 침범함 (사용자 답변)
- 해결 (커밋 `ca5e122`):
  - `MainActivity.kt`에서 `WindowCompat.setDecorFitsSystemWindows(window, true)`로 edge-to-edge를 껐습니다
  - 일정 입력·일기 입력·설정 화면에 `SafeArea`를 적용했습니다

## 10. 링크 (모두 HTTP 200, 2026-10-12)

- GitHub: https://github.com/gaudium1257/2026320053_NEXTCON (학번 포함, 사용자 허락)
- 시연 영상: https://youtu.be/_gSFi0oEptY (공유 추적용 `si=` 값은 뺐습니다)
- APK: https://github.com/gaudium1257/2026320053_NEXTCON/releases/tag/v1.0.0
- 대회 페이지: https://husky-willow-b6d.notion.site/2026-NE-XT-CONTEST-30d4e67d9ce480a0a418f8ca0e489fca

## 11. 이미지 후보

- 앱 아이콘: `next_contest/assets/icon/app_icon.png`
- 실기기 스크린샷 (2026-10-12, `portfolio-export/screenshots/`). 상태바(위쪽 100px)를 잘라내 1080×2240입니다.
  - `01_month_view.png` — 2026년 5월 월 보기, 여러 날·반복 일정 (**대표 이미지 추천**)
  - `02_drag_select.png` — 길게 눌러 끌어서 5/11~5/14 선택
  - `03_event_form.png` — 선택한 기간이 채워진 일정 추가 화면
  - `04_day_view.png` — 5/31 일 보기 (종일 배너 + 시간표)
  - `05_add_sheet.png` — 일정/일기 선택 시트
  - `06_diary_form.png` — 일기 작성 화면 (기분 선택, 본문 비어 있음)
  - `07_unsaved_dialog.png` — 저장하지 않고 나갈 때 경고창
- 스크린샷 속 일정은 디버그 빌드가 넣은 예시 데이터(`next_contest/lib/utils/dev_seed.dart`)입니다

## 12. 관련 활동·수상·경력

- 이 프로젝트가 2026 NE:XT CONTEST의 결과물 ✅ 사용자 답변

## 13. 배운 점

- 첫 앱 개발이었고 Flutter와 Dart를 처음 접했습니다 ✅ 사용자 답변
- 사전 지식이 없어도 바이브 코딩으로 이 정도 결과물을 만들 수 있다는 걸 체감했습니다 ✅ 사용자 답변

## 14. 제외한 내용과 이유

- **일기 알림**: 설정 값만 저장하고 알림을 보내는 코드가 없어 미구현입니다. 보고서에도 "알림 설정 저장"이라고만 적혀 있습니다
- **월 보기 축소 모드**: 코드는 있지만 사용자가 들어갈 경로가 없습니다 (`calendar_screen.dart:50`, `:538`)
- **Crashlytics/Sentry**: 주석만 있습니다 (`main.dart:12`)
- **table_calendar, intl, cupertino_icons**: 보고서에는 사용했다고 적혀 있지만 `pubspec.yaml`에 선언만 있고 import가 없습니다
- **"Android/iOS 크로스 플랫폼"**(보고서): iOS 빌드나 실행 근거가 없어 넣지 않았습니다
- **코드 주석에서 추정한 문제 4가지**: 실제로 겪은 문제가 아니라고 하셔서 뺐습니다 (사용자 답변)
- **개인정보**: 기획서·보고서의 전화번호와 이메일은 어디에도 옮기지 않았습니다
