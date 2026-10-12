# Hello Vibe 팩트시트

- 조사일: 2026-10-12
- 저장소:
  - 프론트엔드: https://github.com/Hello-KU-tty/program (공개, `gh repo view` 확인) / 기준 커밋: `84699c6` (브랜치 `tmp/verify-0.2.8`; `main` = `88275f6`)
  - 백엔드: https://github.com/Hello-KU-tty/core (공개, `gh repo view` 확인) / 기준 커밋: 로컬 `b61d104`, 원격 `main` 최신 `ab0d1e5`
- 내 git 신원: `gaudium1257 <twehokim@gmail.com>`, `김태호 (Taeho Kim) <twehokim@gmail.com>` (사용자 답변)

상태 표기: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: "만들면서, 이해의 근거를 남기는 Kiro 기반 바이브코딩 개발 환경" ✅ (`core/README.md:3`)
- 무엇을, 누구를 위해, 어떤 문제를 푸는지:
  - 코딩 초보자가 배우고 싶은 기술 하나로 시작해 TypeScript 서비스를 완성하도록 돕는 Kiro IDE 확장 ✅ (`core/README.md:7`)
  - "Agent가 코드를 썼다"와 "사용자가 이해했다"를 구분해 기록 ✅ (`core/README.md:19-24`)
- 구성:
  - 프론트엔드 저장소 `program`: Kiro 확장 화면(Discovery·Spec·Builder·Helper·History) ✅ (`program/README.md:3`)
  - 백엔드 저장소 `core`: TypeScript Core, SQLite, 역할별 MCP, Kiro 연동 ✅ (`core/README.md:11-12`)
- 맥락: 고려대학교 × AWS AI Innovators Challenge 팀 프로젝트, 본선 진출 ✅ (`core/README.md:5`, 사용자 답변)

## 2. 기간·팀

- 기간: 2026-08 ~ 진행 중 ✅
  - 백엔드 첫 커밋 `fc25631` (2026-08-25)
  - 프론트엔드 첫 커밋 `292b1a7` (2026-09-02, 본인)
  - 두 저장소 마지막 커밋 2026-10-12
- 커밋 (모든 브랜치, 참고용):
  - 프론트엔드: 전체 64 / 내 커밋 50
  - 백엔드: 전체 173 / 내 커밋 15
- PR: 프론트엔드 PR 10개 중 9개, 백엔드 PR 2개 모두 본인 계정 ✅ (`gh pr list`)
- 팀 인원·내 역할 ✅ (사용자 답변):
  - 2명
  - 본인: 프론트엔드 개발, 필요에 따라 백엔드 지원
  - 다른 팀원: 백엔드 개발 (이름 비공개)

## 3. 내가 한 일 (사용자 확인 완료)

### 프론트엔드 (`program`)

- Agent Panel 초기 구조: Builder·Helper 탭, 스트리밍 표시, 입력창 UI ✅ (`4ae515c`, `d20317a`, `f7740b5`, `c365683`)
- Discovery → Learning Spec 화면 흐름: Kiro spec으로 설계한 뒤 구현 ✅ (`78de59d`, `b351bb9`, `.kiro/specs/discovery-spec-flow/`)
- Core 프론트엔드 SDK(`LocalCoreClient`) 연동:
  - 연결 실패 시 기능을 막음(fail-closed)
  - History는 읽기 전용
  - ✅ (`dab7361`)
- Windows 실제 백엔드 연결: Builder·Helper·Decision·Evidence·작업 폴더·최종 업그레이드 배선 ✅ (`5400e06`, `8557115`, `7e2e42b`, `1dd230f`)
- 실측 오류 코드별 한국어 안내, 도구 활동 목록, 다음 단계 안내 ✅ (`fb1c19b`, `5519b18`, `9a4fd08`, `2775455`)
- 화면 개편:
  - 탭 구조, 결정 먼저 보여 주기
  - Discovery·Spec 화면 축약
  - "처음으로" / "다른 주제로 돌아가기"
  - ✅ (`4d89d8c`, `af5db1f`, `c136642`)
- 본선 Kiro-native 호스트용 "Kiro 채팅에서 열기"와 창 재로드 안내 ✅ (`edf1751` PR #10, `9ef88d6`)
- 실측 문제 보고서(B1~B13), 실측 체크리스트, 인수인계 문서 ✅ (`BACKEND_LIVE_TEST_ISSUES_20260928.md`, `LIVE_TEST_CHECKLIST.html`, `HANDOFF_20260929.md`)
- 백엔드 업데이트 kit 적용과 버전 관리 ✅ (`8557115`, `620d1fa`, `707b4e8`)

### 백엔드 (`core`)

- 생성 프로젝트 도구 체인(Node·pnpm)의 Windows·업그레이드 문제 수정 ✅ (`packages/runtime/src/project-toolchain.ts`; `7deefa3`, `365ce2a`, `e3532b7`, `dca359b`)
- Builder 명령 거부 사유를 명령어 원문 없이 3가지로 구분 (B13) ✅ (`eb215ef`)
- Windows 사용자별 kiro-cli 탐색, Windows 전용 테스트 실패 13개 수정 ✅ (`850b276`)
- Windows Kiro-native VSIX 0.2.6·0.2.7 빌드와 실제 Windows 11 PC 점검 기록 ✅ (`a405217`, `478760d`, `da39e6a`)

### 내 작업이 아닌 것 (다른 계정)

- Core 전체 설계와 대부분의 구현
- 개인정보 안내문, Discovery 리로드 복원 (`14cc61b`)
- Next Move 카드 (`6a6a557`)
- 1차 체험 피드백 반영 (`c2c873c`)
- 완료 뒤 Builder·Helper 유지 (`a61d408`)

## 4. 핵심 기능 (구현 확인된 것만)

- Discovery: 학습 목표 → 프로젝트 후보 정확히 10개, 피드백으로 다시 좁히기 ✅ (`core/packages/contracts/src/discovery.ts:161`, `program/src/core/flow/flow-controller.ts:515`, `:629`)
- Learning Spec: 검토·보완·확정, Discovery로 돌아가기 ✅ (`program/src/webview/flow/flow-render.ts:1256`, `program/src/adapter/flow/local-core-port.ts:257-304`)
- Builder 결정 카드: 실제 결정 선택 후 이어서 진행 ✅ (`program/src/core/agent/agent-controller.ts:803`, `:869`)
- Helper: 읽기 전용 설명 대화 ✅ (`agent-controller.ts:647`, `core/apps/mcp-server/src/role-server.ts:221`)
- Evidence·Concept State: OBSERVED → EXPLAINED → DEMONSTRATED → TRANSFERRED 순서로만 상승, 강등은 거부 ✅ (`core/packages/domain/src/concept-state-reducer.ts:13-18`, `:74-82`)
- 역할별 권한: Discovery·Builder·Helper·Evidence Analyst마다 도구 목록 분리 ✅ (`core/packages/contracts/src/primitives.ts:82`, `role-server.ts:105-237`)
- 저장 전 민감정보 가림: 알려진 형태의 토큰·키·홈 경로 ✅ (`core/packages/application/src/redaction.ts:1-35`)
- 로컬 인증 연결 ✅ (`core/apps/local-backend/src/main.ts:526`, `server.ts:128-133`)
  - 127.0.0.1에만 바인딩
  - 실행마다 새 토큰 발급
  - 토큰은 상수 시간 비교
- History: 기록 열람, 창 재로드 후 복원 ✅ (`program/src/agent-panel-view-provider.ts:327-338`)
- Kiro 채팅에서 열기·재로드 안내: Kiro-native 호스트(0.2.x)에서만 켜짐 ✅ (`agent-panel-view-provider.ts:309-310`)
  - 프론트엔드 저장소에 커밋된 Windows runtime(kit 2026.10.07.1)에는 없음

## 5. 구조

```
Kiro IDE
 └ 확장(program): webview는 일반 DOM, esbuild로 번들
    └ portable host(frontend-host.cjs)가 로컬 Core를 자동으로 띄움
       ├ HTTP + SSE (127.0.0.1, Bearer 토큰)  ← vendor/frontend-client SDK
       ├ SQLite (better-sqlite3, Drizzle 마이그레이션)
       ├ 역할별 MCP 서버
       └ Kiro 내장 Agent(WebSocket JSON-RPC) 또는 kiro-cli ACP로 Agent 실행
```

근거:

- `program/src/extension.ts:27-30`
- `program/src/adapter/flow/flow-port-factory.ts:187-200`
- `core/apps/local-backend/src/server.ts:217-245`
- `core/examples/kiro-native-host/native-client.cjs:281`
- `core/packages/kiro-adapter/src/acp-client-node.ts:128-140`

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                        | 근거                                                                                                          |
| -------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| language | TypeScript                  | `program/tsconfig.json` (strict), `core` `tsc -b`                                                             |
| frontend | VS Code Extension API       | `program/src/extension.ts:10`                                                                                 |
| backend  | Node.js (24.19.0 고정)      | `core/apps/local-backend/src/server.ts:2` (`node:http`), `core/.node-version`                                 |
| ai-ml    | Kiro (내장 Agent, kiro-cli) | `core/examples/kiro-panel/src/native-worker.cjs:552`, `core/packages/kiro-adapter/src/acp-client-node.ts:128` |
| ai-ml    | Model Context Protocol      | `core/apps/mcp-server/src/role-server.ts:3-8`                                                                 |
| database | SQLite (better-sqlite3)     | `core/packages/storage-sqlite/src/database.ts:11`                                                             |
| database | Drizzle ORM                 | `core/packages/storage-sqlite/src/schema.ts:1`, `migration.ts:9-12`                                           |
| tooling  | Vitest                      | `program/vitest.config.ts:1`, `core/vitest.config.ts`                                                         |
| tooling  | fast-check                  | `program/test/flow-controller.property.test.ts:2` (19개 파일)                                                 |
| tooling  | esbuild                     | `program/esbuild.mjs:19`                                                                                      |

JSON에 넣지 않았지만 사용이 확인된 것:

- Zod (`core/packages/contracts/src/primitives.ts:1`)
- Playwright (`core/tests/e2e/`)
- Biome (`core/biome.json`)
- pnpm

React·Vite는 백엔드 저장소의 초기 경로 `apps/crew-app`에서만 쓰여서 제외했습니다.

AI 코딩 도구: Claude Code, Kiro ✅ (사용자 답변. 본인 커밋 25개에 `Co-Authored-By: Claude` 표기, `.kiro/specs/` 존재)

## 7. 현재 상태·배포

- 개발 상태: 진행 중(in-progress) ✅ (사용자 답변)
- 배포: 웹 호스팅 없음, GitHub 저장소에서 VSIX 설치 파일 배포 ✅
- 2026-10-12 접속 확인:
  - 다운로드 가이드 https://github.com/Hello-KU-tty/core/blob/main/docs/DOWNLOAD_GUIDE.md → HTTP 200
  - 원격 `main`의 가이드에 Mac 0.2.8·Windows 0.2.7 링크가 있고, 두 파일 모두 HTTP 200
- 🟡 JSON의 `deployment.status`는 "다운로드 페이지 접속 확인"이라는 뜻으로 `live`로 뒀습니다. 웹 서비스가 아니라는 점을 더 분명히 하려면 `not-deployed`로 바꿀 수 있습니다.

## 8. 결과

- 고려대학교 × AWS AI Innovators Challenge 본선 진출, 최종 결과 미발표 ✅ (사용자 답변)
- 프론트엔드 0.0.18 기준 자동 테스트 807개 통과 ✅ (`core/README.md:126`, 사용자 확인)
- Mac 설치본 0.1.3에서 실제 모델로 확인 ✅ (`core/README.md:129`, 사용자 확인)
  - 앱 생성·실행
  - Decision 반영
  - 재시작 후 복원

## 9. 문제와 해결 (근거 있는 것만, 본인 커밋)

- 문제: 실제 Windows 11에서 사용자별로 설치된 kiro-cli를 못 찾음(`KIRO_CLI_NOT_INSTALLED`)
  - 해결: `%LOCALAPPDATA%\Kiro-Cli` 탐색 추가, Windows 전용 테스트 실패 13개 수정 (`850b276`)
- 문제: 확장 버전을 올릴 때마다 `PROJECT_TOOLCHAIN_CHANGED_RESTART_REQUIRED` 발생
  - 해결: 같은 제품의 새 버전 업그레이드는 허용 (`7deefa3`)
- 문제: 없는 AppData 경로 때문에 PowerShell이 학습자 프로젝트에 캐시 폴더를 생성
  - 해결: private home 아래에 AppData 폴더를 미리 생성 (`dca359b`)
- 문제: Builder 셸 거부 코드 하나에 원인 3가지가 섞여 있음
  - 해결: 명령어 원문 없이 정해진 사유 값으로 구분 (`eb215ef`)
- 문제: Kiro-native 호스트에서 Core가 패널 Builder를 거부해 "이걸로 시작"이 오류로 끝남
  - 해결: "Kiro 채팅에서 열기"로 전환 (`edf1751`)
- 문제: `portable/node_modules`가 git에서 무시됐고, CRLF 변환으로 kit 해시가 깨짐
  - 해결: `.gitignore` 예외와 `.gitattributes`의 `-text` 설정 (`8557115`)
- 문제: 스트리밍 응답이 탭을 바꿔야만 보임
  - 해결: controller 변경 이벤트가 오면 다시 렌더링 (`d20317a`)

## 10. 링크

- github (프론트엔드 저장소): https://github.com/Hello-KU-tty/program ✅ (HTTP 200, 2026-10-12)
- github (백엔드 저장소): https://github.com/Hello-KU-tty/core ✅ (HTTP 200, 2026-10-12)
- docs (다운로드·설치 가이드): https://github.com/Hello-KU-tty/core/blob/main/docs/DOWNLOAD_GUIDE.md ✅
- 제외: README 첨부 소개 영상 주소 (비로그인 HTTP 404) ❓
- 제외: `core/docs/assets/vibe-helper-demo.mp4` (HTTP 200이지만 내용 미확인) ❓

## 11. 이미지 후보

| 파일 (`images/` 사본)  | 종류      | 크기     | 무엇을 보여주는지                                                                                                                      | 원본 경로                                               |
| ---------------------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `images/thumbnail.png` | 가로 대표 | 1672×941 | 작업 메모 → 프로젝트 기록 → 이해의 근거 → 개념 장부 → 다음 도움으로 이어지는 개념도와 "AI가 만든 코드 ≠ 사용자가 이해했다는 근거" 문구 | `core/docs/assets/knowledge-structure-presentation.png` |

- 아이콘·로고: 없음 ✅ (사용자 답변). `program/media/agent-panel.svg`는 16×16 활동 표시줄 아이콘이라 로고로 쓰지 않습니다.
- 화면 캡처: 저장소에 없음. 나중에 찍을 후보(가로 캡처, 16:10에 가깝게):
  - 학습 목표 입력
  - 후보 10개 Discovery
  - Learning Spec
  - Builder 결정 카드
  - Helper 대화
  - 학습 기록(Evidence)
  - History
  - Kiro 채팅에서 열기

## 12. 관련 활동·수상·경력 (사용자 답변)

- 고려대학교 × AWS AI Innovators Challenge 본선 진출 (최종 결과 미발표)

## 13. 배운 점 (사용자 답변을 바탕으로 작성)

사용자 답변: "extension 개발이 처음이고, AI를 프로그램 기능에 넣어 본 것도 처음"

- 확장 프로그램 개발이 처음이어서, 확장 호스트와 webview가 메시지로만 주고받는 구조에 맞춰 화면 상태를 Controller로 분리하는 방법을 익혔습니다.
- AI를 프로그램 기능에 처음 넣어 보면서, 모델 응답이 실패하거나 중단되는 경우를 사용자에게 알맞게 안내하는 일이 기능 구현만큼 중요하다는 것을 배웠습니다.

## 14. 제외한 내용과 이유

- 사용자 인터뷰·정성 피드백: README에 적혀 있지만, 사용자가 인터뷰를 하지 않았다고 답해 제외
- `KiroAcpAdapter`: 실제 전송 계층이 없는 실험 코드 (`program/src/adapter/kiro-acp-adapter.ts:6-26`)
- `CrewBackendPort`: 모든 메서드가 `NOT_IMPLEMENTED`
- DemoAdapter·MockAdapter: 개발·테스트용
- React·Vite: 초기 경로 `apps/crew-app`에서만 사용
- Next Move 카드: 구현은 돼 있지만 다른 팀원의 작업이라 "내가 한 일"에서 제외
- CI·LICENSE: 두 저장소 모두 없음 (사실 기록용)
- Codex: 사용하지 않음 (사용자 답변)

## 남은 확인 사항

- `period.start`: 프로젝트 시작 기준 `2026-08`. 본인 참여 기준이면 `2026-09`
- `deployment.status: live`의 해석 (7번 참고)
- 대회 영문명 "Korea University × AWS AI Innovators Challenge"는 직접 옮긴 표기
- 13번 배운 점 문장 표현
