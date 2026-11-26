# Convenient BOJ 팩트시트

- 조사일: 2026-11-27 (배포 URL 확인 2026-11-27)
- 저장소: https://github.com/gaudium1257/Convenient_BOJ (공개) / 기준 커밋: `830c166` (v1.6.2)
- 내 git 신원: `gaudium1257 <twehokim@gmail.com>`, `김태호 (Taeho Kim) <twehokim@gmail.com>` (사용자 답변: 둘 다 본인, 실명 공개 허락)

상태 표시: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: 백준(acmicpc.net) 문제 화면에서 코드 작성 → 실행 → 제출 → 채점 결과 확인을 한 화면에서 하는 비공식 크롬 확장 프로그램 ✅ (README.md:5, manifest.json:7)
- 무엇을 하는지: 문제 페이지(`/problem/*`)에 분할 화면을 띄운다. 예제와 사용자 테스트케이스로 코드를 돌려 기대 출력과 비교하고, 공식 제출 페이지에 코드를 채워 주고, 채점 결과를 분할 화면에 보여 준다. ✅ (content/split.js, background.js, content/submit.js, content/status.js, manifest.json:31-83)
- 백준·스타트링크·데이원컴퍼니와 관련 없는 비공식 확장 ✅ (README.md:7)
- 맥락: 개인 프로젝트. 본인이 필요해서 만든 첫 크롬 확장 프로그램 ✅ (사용자 답변)

## 2. 기간·팀

- 기간: 2026-11-24 ~ 2026-11-26 (첫 커밋 `33bf4e9`, 마지막 커밋 `830c166`) ✅
- 커밋: 전체 32 / 내 커밋 32 (참고용) ✅
- 릴리스: v1.0.0 ~ v1.6.2, 20개 ✅ (`git tag`, `gh release list`)
- 팀: 1인 개발, Claude Code 사용 ✅ (사용자 답변, 커밋 31개의 `Co-Authored-By: Claude Opus 5.5`)

## 3. 내가 한 일

모든 커밋의 작성자가 본인이므로 저장소 전체가 본인 작업이다. ✅

- 분할 화면 에디터, 실행 터미널, 테스트케이스, 타이머, 채점 결과 표시 구현 ✅ (`content/split.js` 1,403줄, 수정 21회)
- Wandbox API 실행과 제출 탭 관리를 맡는 서비스 워커 구현 ✅ (`background.js`)
- 로컬 실행용 Python Native Messaging 호스트와 Windows 설치 스크립트 구현 ✅ (`host/cboj_host.py` 513줄, `host/install.ps1`, 커밋 `688896e`)
- 설정 팝업 구현 ✅ (`popup/`)
- 실제 크롬과 실제 백준 페이지에서 도는 E2E 테스트 작성 ✅ (`tests/e2e/run.mjs`, 커밋 `4c9cb97`)
- GitHub Actions 릴리스 파이프라인 구성: 태그를 올리면 ZIP 3종(직접 설치용, 웹 스토어용, 도우미만) 생성 ✅ (`.github/workflows/release.yml`)
- 크롬 웹 스토어 등록 자료와 개인정보처리방침 작성 ✅ (`docs/store/`, `PRIVACY.md`)

## 4. 핵심 기능 (구현 확인된 것만)

- **분할 화면:** 문제 제목 옆 버튼이나 Alt+C로 열고, 패널 크기를 기억한다. ✅ (content/split.js, E2E "문제 페이지에 분할 화면")
- **6개 언어 실행:** C, C++, Java, Rust, Python 3, PyPy3 ✅ (background.js:91-118, E2E 6개 언어 예제 실행 PASS)
- **예제 + 나만의 테스트케이스 채점과 출력 비교:** 몇 번째 줄부터 다른지 알려 주고 다른 줄을 강조한다. ✅ (E2E "틀린 답 → 출력 비교", "나만의 테스트케이스")
- **백준과 맞춘 컴파일 옵션·버전:** gcc 11, `-O2 -DONLINE_JUDGE`, Java `--release 11`, rustc 1.90 `--edition -O` ✅ (background.js:6-17, 91-118, host/cboj_host.py:253-328)
- **로컬 실행 도우미(선택, Windows):** Native Messaging으로 내 PC에서 컴파일·실행한다. 실행 중 입력을 주고받고 Ctrl+C, Ctrl+D를 처리한다. ✅ (host/cboj_host.py:1-17, background.js:221-262, E2E "터미널 실시간 입력 (내 PC)")
- **도우미가 없을 때 Wandbox로 실행:** 실패하면 최대 2회 재시도하고, 동시 요청은 3개까지로 제한한다. ✅ (background.js:128-170, content/split.js:1009)
- **제출 → 채점 결과:** 문제 탭 옆에 공식 제출 페이지를 열어 코드와 언어를 채운다. 제출 버튼은 사용자가 누른다. 채점 결과는 실시간으로 표시되고, 채점이 끝나면 제출 탭이 닫힌다. ✅ (background.js:172-219, content/submit.js, content/status.js) — 실제 제출은 reCAPTCHA 때문에 E2E에서 자동화하지 않았고, 사람이 확인했다고 README.md에 적혀 있다.
- **편집 기능:** 자동완성(멤버 우선, 퍼지 매칭 `pb → push_back`), VS Code 규칙의 엔터 자동 들여쓰기, 탭/공백 선택, 언어별 기본 코드, 문제·언어별 자동 저장, 풀이 타이머 ✅ (커밋 `d6c831a`, `f5eda13`, `cfb8499`, E2E 해당 항목 PASS)

## 5. 구조

- 콘텐츠 스크립트(`content/split.js`)가 서비스 워커(`background.js`)에 메시지를 보낸다. 서비스 워커는 ① Wandbox `compile.json` API에 HTTP 요청을 보내거나 ② `chrome.runtime.connectNative`로 로컬 Python 호스트에 중계한다. ✅ (background.js:5, 221-262)
- 제출 흐름: 서비스 워커가 `chrome.storage.session`으로 제출 탭 상태를 관리한다. `submit.js`/`submit-main.js`(MAIN world)가 백준 에디터에 코드를 넣고, `status.js`가 채점 결과를 읽어 원래 탭으로 넘긴다. ✅ (background.js:172-219, manifest.json:56-82)
- 저장: 작성 코드와 테스트케이스는 `chrome.storage.local`, 설정은 `chrome.storage.sync`. 별도 서버는 없다. ✅ (PRIVACY.md)

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                            | 근거                                                         |
| -------- | ------------------------------- | ------------------------------------------------------------ |
| language | JavaScript                      | 확장 전체 (background.js, content/, popup/)                  |
| language | Python                          | `host/cboj_host.py`                                          |
| language | PowerShell                      | `host/install.ps1` (winget 기반 설치)                        |
| frontend | Chrome Extensions (Manifest V3) | manifest.json:2, 서비스 워커·콘텐츠 스크립트                 |
| frontend | CodeMirror (5)                  | `vendor/codemirror/`, manifest.json:59-67                    |
| backend  | Wandbox API                     | background.js:5, 141                                         |
| infra    | GitHub Actions                  | `.github/workflows/release.yml`                              |
| tooling  | Puppeteer                       | `tests/e2e/package.json` (`puppeteer-core` 24.10.0), run.mjs |
| tooling  | Node.js                         | E2E 실행 환경                                                |
| other    | Chrome Native Messaging         | background.js:221-240, host/cboj_host.py:44-56               |
| AI 도구  | Claude Code                     | 사용자 답변, 커밋 Co-Authored-By                             |

## 7. 현재 상태·배포

- 개발 상태: 크롬 웹 스토어 심사 중 ✅ (사용자 답변) → JSON `status`: maintained, `period.end`: null
- GitHub Releases: v1.6.2, `releases/latest` HTTP 200 (2026-11-27) ✅ → `deployment.status`: released
- 크롬 웹 스토어: 심사 중이라 공개 페이지가 없다(스토어 URL이 `…/detail/empty-title/…`로 리다이렉트됨, 2026-11-27). 링크는 넣지 않았다. 통과하면 `project-update.md`로 반영한다.
- 테스트: E2E 55/55 통과 ✅ (로컬 로그 `tests/e2e/out/all.log` 2026-11-26, 커밋 `7dd403f` 메시지, 사용자 공개 허락). CI에서 돌리는 테스트는 없다.
- 라이선스: MIT ✅ (LICENSE)

## 8. 결과

- GitHub Releases에 20개 버전 배포 (v1.0.0 ~ v1.6.2) ✅ (`gh release list`)
- E2E 테스트 55개 항목 통과 ✅
- 사용자 수·수상·발표: 없음 (사용자 답변)

## 9. 문제와 해결 (근거 있는 것만)

- 문제: 최신 컴파일러로 실행하면 백준에 없는 문법·API가 여기서만 통과한다. → 해결: Wandbox에서 백준과 같거나 가장 가까운 컴파일러 버전을 고르고, Java는 `--release 11`로 컴파일하도록 바꿨다. ✅ (커밋 `5b279b5`, background.js:6-17, 56-64)
- 문제: Wandbox는 Java 소스 파일 이름이 `prog.java`라서 `public class Main`을 컴파일하지 못한다. → 해결: 줄 번호가 바뀌지 않게 `public`만 지워서 보낸다. ✅ (background.js:100-103)
- 문제: Windows 기본 스택이 1MB라 깊은 재귀가 백준과 다르게 실패한다. → 해결: 로컬 C/C++·Rust 빌드에 256MB 스택 링크 옵션을 넣었다. ✅ (host/cboj_host.py:292, 328, 커밋 `cfb8499`)
- 문제: 크롬 137 이상은 `--load-extension`을 막아서 E2E에서 확장을 설치할 수 없다. → 해결: Puppeteer의 CDP `installExtension`으로 설치했다. ✅ (run.mjs:62, 커밋 `4c9cb97`)
- 문제: 크롬 웹 스토어가 1.6.0을 키워드 스팸으로 거절했다(언어 이름을 나열한 요약·설명). → 해결: 언어 목록을 문장으로 바꾸고 이미지를 다시 캡처했다. ✅ (커밋 `830c166`)
- 문제: 도우미가 아직 시작 중일 때 첫 실행이 Wandbox로 갔다. → 해결: 도우미가 도구 버전을 병렬로 확인하고, 확장은 최대 10초 기다린다. ✅ (커밋 `7dd403f`) — 커밋 메시지의 "2.8초 → 1.4초"는 측정되지 않았다는 사용자 답변에 따라 수치는 쓰지 않는다. JSON에도 넣지 않았다.
- 설계 제약: 백준 이용 규칙이 자동 제출 도구를 금지하므로, 공식 제출 페이지에 코드만 채우고 제출 버튼은 사용자가 누르게 했다. ✅ (README.md, content/submit.js)

## 10. 링크

- GitHub: https://github.com/gaudium1257/Convenient_BOJ ✅
- Releases: https://github.com/gaudium1257/Convenient_BOJ/releases/latest ✅

## 11. 이미지 (사용자 확정)

| 파일 (`images/` 사본)         | 종류      | 크기                 | 무엇을 보여주는지                                                           | 원본 경로                                      |
| ----------------------------- | --------- | -------------------- | --------------------------------------------------------------------------- | ---------------------------------------------- |
| `images/icon.svg`             | 아이콘    | 벡터 (64×64 viewBox) | 보라 그라디언트 바탕의 분할 화면 모양 아이콘                                | `icons/icon.svg`                               |
| `images/thumbnail.png`        | 가로 대표 | 1400×560             | 로고, "문제 · 코드 · 실행 · 제출을 한 화면에서", 분할 화면                  | `docs/store/promo-marquee-1400x560.png`        |
| `images/01-split-run.png`     | 웹 화면   | 1280×800             | A+B 문제 옆 분할 화면에서 C++ 예제 통과                                     | `docs/store/screenshot-1.png`                  |
| `images/02-wrong-diff.png`    | 웹 화면   | 1280×800             | Python 오답, 기대 출력과 내 출력을 비교해 4번째 줄부터 강조                 | `docs/store/screenshot-2.png`                  |
| `images/03-terminal.png`      | 웹 화면   | 1280×800             | 로컬 도우미 터미널에서 실행 중에 입력을 주고받는 모습                       | `docs/store/screenshot-3.png`                  |
| `images/04-autocomplete.png`  | 웹 화면   | 1280×800             | `v.` 뒤에 push_back부터 뜨는 자동완성 목록                                  | `docs/store/screenshot-4.png`                  |
| `images/05-popup-rust.png`    | 웹 화면   | 1280×800             | 설정 팝업과 Rust 예제 실행 결과                                             | `docs/store/screenshot-5.png`                  |
| `images/06-submit-filled.jpg` | 웹 화면   | 800×600              | 코드와 언어가 채워진 백준 공식 제출 페이지                                  | `docs/screenshots/06-submit-window-filled.jpg` |
| `images/07-judge-ac.jpg`      | 웹 화면   | 800×798              | 분할 화면에 표시된 "맞았습니다!!" 채점 결과 (백준 아이디 노출, 사용자 허락) | `docs/screenshots/07-judge-result-ac.jpg`      |

- 스크린샷 01~05에는 위쪽에 캡션 띠("문제 옆에서 바로 코드 작성 · 실행" 등)가 들어가 있다.
- `07`은 툴바에 타이머가 없고 탭에 "테스트케이스"가 없는 예전 화면이다.
- 뺀 이미지: `docs/screenshots/hero.png`(3200×1800), `docs/promo/instagram-story.png`(1080×1920) — 구버전 디자인이라 사용하지 않기로 함 (사용자 답변). `icons/th-mark.svg`는 앱 아이콘이 아니라 개인 브랜드 마크다.

## 12. 관련 활동·수상·경력

- 없음 (사용자 답변)

## 13. 배운 점

- 처음 개발한 크롬 확장 프로그램이다. 본인이 필요해서 만들었고, 성능에 만족하며 쓰고 있다. (사용자 답변)

## 14. 제외한 내용과 이유

- "냥이" 테마: 커밋 `7b55992`에서 추가했다가 `4ad0950`에서 제거해 현재 코드에 없음
- `dev/inject.js` 개발용 로더: 커밋 `e98d2e4`에서 삭제
- 크롬 웹 스토어 링크와 출시: 심사 중이라 제외
- 도우미 시작 속도 "2.8초 → 1.4초": 측정되지 않음
- 실행 시간 표시값(예: 0.78초): 실행 환경에 따라 달라지는 화면 표시값
- GitHub 스타 1개: 포트폴리오에 넣을 만한 수치가 아님
- 구버전 이미지 2장: 사용자 요청

## 자체 점검

- [x] JSON의 모든 문장이 ✅ 항목이나 사용자 답변에 근거가 있다
- [x] 🟡/❓ 내용은 JSON에 없다
- [x] 숫자는 측정값이거나 확인된 값이다 (55개 항목, 20개 버전, 6개 언어, 256MB, 1MB, 크롬 137)
- [x] 금지어가 없다
- [x] ko와 en의 내용이 같다
- [x] 기술 스택은 모두 코드에서 쓰인다
- [x] 비밀값·내부 URL이 없다. 캡처 속 백준 아이디는 공개 허락을 받았다.
- [x] 템플릿과 같은 구조의 유효한 JSON이다

## 포트폴리오 저장소에서 확인할 것

- Releases 링크(`type: other`)의 `label`: 템플릿에는 `github` 링크에만 `label` 예시가 있어서 스키마에서 허용되는지 확인하지 못했다. `validate:content`가 막으면 `label`만 빼면 된다.
- `status`: maintained. 업데이트를 멈추면 completed와 종료일로 바꾼다.

## 포트폴리오 저장소 반영 기록 (2026-11-27)

- 사실 확인(content-fact-checker) 지적 반영: Node.js 설명에서 "이미지 생성 스크립트" 삭제, 핵심 기능 "백준과 같은 실행 환경" → "백준에 맞춘 컴파일 설정"(같거나 가장 가까운 버전), 출력 비교 en 문장, E2E 결과 en의 "all" 삭제
- 저장소에서 추가 확인: `host/install.ps1`:4-8은 Python·PyPy3·gcc·JDK·Rust가 없으면 winget으로 설치할지 묻는다 → PowerShell 설명에 "컴파일러(선택)". `.github/workflows/release.yml`:63은 `gh release create`로 ZIP 3종을 올린다 → GitHub Actions 설명에 "GitHub Releases에 올림"
- 이미지: icon.svg = 로고, thumbnail(1400×560)은 위아래 가장자리 줄을 반복해 1400×875(16:10, 자르지 않음). 06(800×600)·07(800×798)은 좌우를 흰색으로 채워 16:10. 07 대체 텍스트에 "예전 화면" 표시
- 새 기술: Chrome Extensions·Chrome Native Messaging·Puppeteer·Wandbox API = 핵심, PowerShell·CodeMirror = 보조 (사용자 답변)
- GitHub Actions: 이 프로젝트에서 릴리스 파이프라인을 직접 구성해 핵심 기술로 올림 (사용자 답변)
- 순서: 헬로 바이브 바로 뒤 (사용자 답변)
