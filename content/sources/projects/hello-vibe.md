# Hello Vibe 팩트시트

- 조사일: 2026-10-12 / 갱신일: 2026-11-05
- 저장소:
  - 프론트엔드: https://github.com/Hello-KU-tty/program (공개) / 기준 커밋: 원격 `main` `548e27b` (로컬 `main`은 `e6c1505`, 1개 뒤)
  - 백엔드: https://github.com/Hello-KU-tty/core (공개) / 기준 커밋: 원격 `main` `0f0df3c` (로컬 `main`은 `ebcb97f`, 2개 뒤)
  - 2026-11-05에 두 저장소를 fetch해 확인. 2026-10-20 이후 새 커밋 없음
- 갱신 때 참고한 자료:
  - 본선 발표 자료 `Hello Vibe 본선 발표.pdf` (15쪽, 2026-10-19 본선 발표)
  - 팀원(hurdooagent)이 올린 본선 소개 영상: `core/docs/assets/hello-vibe-finals-45s.mp4`, `hello-vibe-finals-2min.mp4` (`b52b9aa`, `0f0df3c`, 2026-10-20). 2분 영상은 프레임을 뽑아 내용 확인
  - 사용자가 올린 YouTube 홍보 영상 https://youtu.be/bPSYMvW0KEY (45초, 2026-11-05 업로드, 본인 채널). 프레임을 뽑아 내용 확인
- 내 git 신원: `gaudium1257 <twehokim@gmail.com>`, `김태호 (Taeho Kim) <twehokim@gmail.com>` (사용자 답변)

상태 표기: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가

## 1. 개요

- 한 줄 소개: "만드는 건 AI에게. 왜 그렇게 만드는지는 내가." / "바이브코딩이 막막한 사람들을 위한, Kiro 위의 바이브코딩 개발·학습 환경" ✅ (발표 자료 1쪽, 소개 영상)
  - 이전 한 줄 소개 "만들면서, 이해의 근거를 남기는 Kiro 기반 바이브코딩 개발 환경"(`core/README.md:3`)에서 발표 문구로 바꿨습니다.
- 출발점 ✅ (발표 자료 3~4쪽):
  - AI가 코드를 다 짜 주면 결과물은 남아도 이해는 남지 않는다
  - 컴퓨터학과 1학년 동기들의 두 가지 고민: "AI가 다 짜 주는데 왜 개발을 배워야 하는지", "전공에서 배운 걸 어디에 써야 할지"
  - 해법: 기술이 꼭 필요한 주제를 찾아 주고(Discovery), 만드는 AI(Builder) 옆에 묻는 AI(Helper)를 두는 구성을 Kiro로 옮김
- 한 사이클 ✅ (발표 자료 5쪽, 소개 영상): 찾기(Discovery·Spec) → 개발 중 판단(Builder·Helper) → 기록(Hook·Core) → 발전(Next Move)
- 구성:
  - 프론트엔드 저장소 `program`: Kiro 확장 화면(Discovery·Spec·진행·학습 기록 패널) ✅
  - 백엔드 저장소 `core`: TypeScript Core, SQLite, Kiro 연결(Steering·MCP·Hook), 설치물 포장 ✅ (`core/README.md`)
- 맥락: 고려대학교 × AWS AI Innovators Challenge 팀 프로젝트, 본선 진출, 2026-10-19 본선 발표, 대회 전체 6위 ✅ (발표 자료 1쪽, 사용자 답변)

## 2. 기간·팀

- 기간: 2026-08 ~ 2026-10 (완료) ✅ (사용자 답변 "completed", 마지막 커밋 2026-10-20)
  - 백엔드 첫 커밋 `fc25631` (2026-08-25)
  - 프론트엔드 첫 커밋 `292b1a7` (2026-09-02, 본인)
  - 마지막 커밋: 백엔드 2026-10-20, 프론트엔드 2026-10-19
- 커밋 (모든 브랜치, 참고용, 2026-11-05 기준):
  - 프론트엔드: 전체 99 / 내 커밋 61 (10-12 이후 32 / 11)
  - 백엔드: 전체 227 / 내 커밋 23 (10-12 이후 49 / 8)
- PR ✅ (`gh pr list`):
  - 프론트엔드: 14개 중 13개 본인 (#11~#14 추가)
  - 백엔드: 3개 모두 본인 (#6 추가)
- 팀 ✅ (사용자 답변, 발표 자료):
  - 2명, 팀 이름 "헬로KU티"
  - 본인: 프론트엔드 개발, 필요에 따라 백엔드 지원, 본선 Windows 설치본 빌드·점검
  - 다른 팀원: 백엔드 개발 (이름은 포트폴리오에 넣지 않음. 발표 자료에는 실명이 있음)

## 3. 내가 한 일

### 프론트엔드 (`program`)

- Agent Panel 초기 구조: Builder·Helper 탭, 스트리밍 표시, 입력창 UI ✅ (`4ae515c`, `d20317a`, `f7740b5`, `c365683`)
- Discovery → Learning Spec 화면 흐름: Kiro spec으로 설계한 뒤 구현 ✅ (`78de59d`, `b351bb9`, `.kiro/specs/discovery-spec-flow/`)
- Core 프론트엔드 SDK(`LocalCoreClient`) 연동: 연결 실패 시 기능을 막음(fail-closed), History는 읽기 전용 ✅ (`dab7361`)
- Windows 실제 백엔드 연결: Builder·Helper·Decision·Evidence·작업 폴더·최종 업그레이드 배선 ✅ (`5400e06`, `8557115`, `7e2e42b`, `1dd230f`)
- 실측 오류 코드별 한국어 안내, 도구 활동 목록, 다음 단계 안내 ✅ (`fb1c19b`, `5519b18`, `9a4fd08`, `2775455`)
- 화면 개편: 탭 구조, 결정 먼저 보여 주기, Discovery·Spec 화면 축약, "처음으로" ✅ (`4d89d8c`, `af5db1f`, `c136642`)
- 본선 Kiro-native 호스트용 "Kiro 채팅에서 열기"와 창 재로드 안내 ✅ (`edf1751` PR #10, `9ef88d6`)
- **(10-12 이후)** 절전 뒤 창 재로드 없이 Core 다시 연결 ✅ (`4625973`)
  - Core가 FAILED가 되면 `host.retry()`를 부르고, 창 포커스·패널 표시·30초 넘는 타이머 공백(절전) 때도 다시 시도
  - 자동 재시도는 15초에 1번, 10분에 3번으로 제한
  - 시작 화면에 "다시 연결" 버튼
- **(10-12 이후)** Core가 다시 연결되면 flow 포트를 다시 만들기 ✅ (`428f012` PR #12)
- **(10-12 이후)** "Vibe Helper: Restore Kiro Layout" 명령 ✅ (`4ec5843` PR #11)
  - 터미널이 Kiro 채팅 자리를 차지했는데 일회성 복구 안내를 놓친 경우를 위한 명령
- **(10-12 이후)** 근거가 인정되지 않은 분석을 쉬운 문구로 안내 ✅ (`2f46693` PR #13)
  - Analyst 메모는 "자세한 분석 메모" 아래로 접음
- **(10-12 이후)** 시작 화면에 모르는 Core 오류 코드도 표시 ✅ (`0e71a10` PR #14)
  - 예: `PRIVATE_DIRECTORY_UNSAFE`. 원인을 찾는 데 로그를 1시간 읽어야 했던 문제
- 실측 문제 보고서(B1~B13), 실측 체크리스트, 인수인계 문서 ✅ (`BACKEND_LIVE_TEST_ISSUES_20260928.md`, `LIVE_TEST_CHECKLIST.html`, `HANDOFF_20260929.md`)
- 백엔드 업데이트 kit 적용과 버전 관리 ✅ (`8557115`, `620d1fa`, `707b4e8`)

### 백엔드 (`core`)

- 생성 프로젝트 도구 체인(Node·pnpm)의 Windows·업그레이드 문제 수정 ✅ (`7deefa3`, `365ce2a`, `e3532b7`, `dca359b`)
- Builder 명령 거부 사유를 명령어 원문 없이 3가지로 구분 (B13) ✅ (`eb215ef`)
- Windows 사용자별 kiro-cli 탐색, Windows 전용 테스트 실패 13개 수정 ✅ (`850b276`)
- **(10-12 이후)** K25 수정 ✅ (`b7f7ad8`, core PR #6)
  - 상속 권한(ACL)이 붙은 private 폴더 때문에 Project 터미널 준비가 실패해도 패널이 막히지 않음
  - Next Move·학습자 프로필 읽기를 읽기 전용 요청으로 분류
  - Windows에서 상속 권한 폴더를 새 폴더처럼 다시 조임
  - Steering 0.9.7: 다시 로드한 뒤에는 새 채팅으로 이어서 진행
- Windows Kiro-native VSIX 빌드와 실제 Windows 11 PC 점검 ✅
  - 0.2.6·0.2.7 (`a405217`, `478760d`, `da39e6a`)
  - **(10-12 이후)** 0.2.10 (`0650bf1`), 0.2.11 (`1ac4b8d`), 0.2.12 (`86a64b7`), 0.2.13 (`49643c6`), 0.2.14 (`5e65f76`, `748ea92`)
  - Windows 0.2.8·0.2.9는 공개하지 않음

### 내 작업이 아닌 것 (다른 계정)

- Core 전체 설계와 대부분의 구현, Kiro-native 구조 전환
- 개인정보 안내문, Discovery 리로드 복원 (`14cc61b`), Next Move (K15), 1차 체험 피드백 반영 (`c2c873c`), 완료 뒤 Builder·Helper 유지 (`a61d408`)
- 10-12 이후 팀원 작업:
  - Core·Kiro 채팅 도구가 프로세스 이름 종료·절전·시작 실패를 넘어 유지되게 함 (K18)
  - Steering 0.9.2~0.9.6
  - program 패널의 진행·학습 기록 두 탭 개편 (K23, `157cfe2` 등)
  - 결정 순간 Helper 질문 안내 (K24)
  - Mac 설치본 0.2.10~0.2.14
  - 부스 키트, 본선 소개 영상 45초·2분, README 갱신
- 개발 명령 미리 승인과 셸 승인 요청 감소 (K11)

## 4. 핵심 기능 (본선 0.2.14 기준)

- Discovery ✅ (`core/packages/contracts/src/discovery.ts:161`, 발표 자료 6쪽, 소개 영상)
  - 배우고 싶은 것과 개인 사정 → 그 기술이 꼭 필요한 프로젝트 후보 정확히 10개
  - "두 개 합쳐 줘"처럼 말로 다듬어 하나로 정함
  - 예: Redis를 배우려는 사람에게 "Redis Todo List"(Redis가 없어도 돌아감)가 아니라 "축제 굿즈 선착순 신청"(동시 신청·중복 예약·잔여 수량 때문에 Redis가 꼭 필요)을 추천
- Learning Spec ✅ (발표 자료 6쪽, 소개 영상)
  - 내가 판단할 것 · AI가 맡을 것 · 이번엔 뺄 것으로 나눔
  - Kiro Spec 문서로 내보냄
- Builder(학습자의 Kiro 채팅) ✅ (발표 자료 7쪽, `core/docs/TASKS.md` K10)
  - 진짜 갈림길에서 코드 직전에 멈추고 번호 선택지와 추천, "몰라도 괜찮아요", `/vibe-helper` 질문 예시를 보여 줌
  - 학습자가 번호와 이유를 답하면 그 원문이 기록되고 이어서 구현
  - MCP 도구 5개: `check_progress`·`save_progress`·`ask_choice`·`save_choice`·`finish_task`
- Helper(`/vibe-helper`) ✅ (발표 자료 9·14쪽, `core/docs/DECISIONS.md`)
  - Kiro Custom Agent, 읽기 전용(파일 읽기·검색, 기록 조회)
  - 지금 코드와 진행 기록을 읽고 고치지 않은 채 설명
  - 이전에 한 오해를 다시 짚음
- 이해 근거와 개념 상태 ✅ (발표 자료 8쪽, `core/packages/domain/src/concept-state-reducer.ts:13-18`, `:74-82`)
  - Hook이 채팅에 쓴 학습자 말의 원문을 모음
  - 자기 말로 쓴 선택 이유만 근거로 남음. AI 설명을 따라 말한 것, 비교를 요청만 한 것, "네, 이해했어요", 추천 클릭, AI가 쓴 코드는 근거가 아님
  - 판정은 AI(Evidence Analyst)가 제안하고, 확정은 Core 고정 규칙이 함: 인용이 대화 원문에 실제로 있는지 확인, 과한 판정은 규칙 최대치까지만 인정
  - OBSERVED → EXPLAINED → DEMONSTRATED → TRANSFERRED 순서로만 상승
- Next Move ✅ (발표 자료 9쪽, `core/docs/FRONTEND_KIRO_NATIVE_HANDOFF.md`)
  - Task를 마칠 때마다 다음 발전 방향 3개 추천 (kiro-cli, Haiku 4.5)
  - 쌓인 학습 기록이 Steering으로 다음 대화에 반영됨
- 진행·학습 기록 패널 ✅ (발표 자료 7쪽, 소개 영상)
  - "지금 할 일", 진행 단계, 복사할 수 있는 채팅 문구
  - 학습 기록은 학습자가 직접 한 말을 인용
- 역할별 권한 ✅ (발표 자료 14쪽)
  - Discovery: 코드·셸 없음
  - Builder: 묻기·기록 도구 5개, 이해 기록 변경 불가
  - Helper: 읽기 전용
  - Evidence Analyst: 도구 없음, 제안만
- 저장 전 민감정보 가림 ✅ (`core/packages/application/src/redaction.ts:1-35`)
- 로컬 인증 연결: 127.0.0.1에만 바인딩, 실행마다 새 토큰, 상수 시간 비교 ✅ (`core/apps/local-backend/src/main.ts:526`, `server.ts:128-133`)
- 별도 API 키 없음, 모델 사용량은 본인 Kiro 계정에서 차감, Node·pnpm 수동 설치 불필요 ✅ (`core/README.md`)

## 5. 구조

```
Kiro IDE  (만드는 곳)
 ├ Kiro 채팅 = Builder        ← Steering(갈림길에서 묻기, 내 이해 수준 전달)
 ├ /vibe-helper = Helper      ← Custom Agent(읽기 전용)
 ├ Spec                       ← Discovery 범위를 Kiro Spec 문서로
 ├ Hook ──────────────┐       채팅에 쓴 내 말 원문
 └ MCP 도구 5개 ───────┤       선택지와 내 답·이유
                      ▼
 local Core  (판정하는 곳: 도구 권한, 기록 규칙, SQLite, secret 가림)
 ├ HTTP + SSE (127.0.0.1, Bearer 토큰)
 ├ kiro-cli: Discovery · Evidence Analyst(Sonnet 5.5) · Next Move(Haiku 4.5)
 └ 연결부(어댑터)만 바꾸면 다른 도구에도 붙도록 Kiro와 분리
                      ▼
 Vibe Helper 패널  (보는 곳: Discovery, 진행, 학습 기록)
```

근거:

- 발표 자료 10·14쪽
- `core/README.md` (Builder MCP 도구 목록, 본선 설치물)
- `core/docs/DECISIONS.md` (Analyst 기본 모델 Sonnet 5.5, 다른 역할 Haiku 4.5)
- `core/apps/local-backend/src/server.ts:217-245`

## 6. 기술 스택 (실사용 확인)

| 분류     | 기술                                                   | 근거                                                                          |
| -------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- |
| language | TypeScript                                             | `program/tsconfig.json` (strict), `core` `tsc -b`                             |
| frontend | VS Code Extension API                                  | `program/src/extension.ts:10`                                                 |
| backend  | Node.js (24.19.0 고정)                                 | `core/apps/local-backend/src/server.ts:2` (`node:http`), `core/.node-version` |
| ai-ml    | Kiro (채팅, Steering·Spec·Hook·Custom Agent, kiro-cli) | 발표 자료 10쪽, `core/packages/kiro-adapter/src/acp-client-node.ts:128`       |
| ai-ml    | Model Context Protocol                                 | `core/apps/mcp-server/src/role-server.ts:3-8`, Builder 도구 5개               |
| database | SQLite (better-sqlite3)                                | `core/packages/storage-sqlite/src/database.ts:11`                             |
| database | Drizzle ORM                                            | `core/packages/storage-sqlite/src/schema.ts:1`, `migration.ts:9-12`           |
| tooling  | Vitest                                                 | `program/vitest.config.ts:1`, `core/vitest.config.ts`                         |
| tooling  | fast-check                                             | `program/test/flow-controller.property.test.ts:2`                             |
| tooling  | esbuild                                                | `program/esbuild.mjs:19`                                                      |

- 모델: Kiro를 통해 Claude Sonnet 5.5(Evidence Analyst), Claude Haiku 4.5(Next Move 등) ✅ (발표 자료 11쪽 "최종 선정된 모델", `core/docs/DECISIONS.md`)
  - JSON에서는 `techStack`이 아니라 Kiro 설명(`techNotes`)에 넣었습니다.
- JSON에 넣지 않았지만 사용이 확인된 것: Zod, Playwright, Biome, pnpm
- React·Vite는 백엔드 저장소의 초기 경로 `apps/crew-app`에서만 쓰여서 제외했습니다.
- AI 코딩 도구: Claude Code, Kiro ✅ (사용자 답변. 본인 커밋에 `Co-Authored-By: Claude` 표기, `.kiro/specs/` 존재)

## 7. 현재 상태·배포

- 개발 상태: 완료(completed) ✅ (사용자 답변, 2026-11-05)
- 배포: 웹 호스팅 없음, GitHub 저장소에서 VSIX 설치 파일 배포 ✅
- 2026-11-05 접속 확인 (모두 HTTP 200):
  - 다운로드 가이드 https://github.com/Hello-KU-tty/core/blob/main/docs/DOWNLOAD_GUIDE.md
  - Mac 0.2.14 `releases/macos/kiro-native/builder-helper-agent-panel-0.2.14-darwin-arm64.vsix`
  - Windows 0.2.14 `releases/windows/kiro-native/builder-helper-agent-panel-0.2.14-win32-x64.vsix`
- JSON의 `deployment.status`는 `released` ✅
  - 포트폴리오 스키마 기준(2026.11): 웹 서비스·스토어가 아니고 누구나 받을 수 있는 설치 파일(VSIX)만 공개된 경우

## 8. 결과

- 고려대학교 × AWS AI Innovators Challenge 본선 진출, 2026-10-19 본선 발표 ✅ (발표 자료 1쪽)
- 최종 결과: 본선 수상 없음, 대회 전체 6위 ✅ (사용자 답변, 2026-11-05)
  - JSON에는 "전체 6위"로 적었습니다.
  - 상을 받은 것은 아니라서 포트폴리오의 수상경력(awards)에는 넣지 않습니다.
- 2026-10-20 대회 부스 운영 ✅ (사용자 답변 2026-11-05, 발표 자료 15쪽 "10/20 부스")
  - 백엔드 부스 키트 커밋 `455e064` "Windows booth kit with two hands-on modes": 방문자가 직접 써 보는 방식 두 가지
- 본선 설치본 0.2.14 검증: Mac·Windows 실제 Kiro 1.2.56, 0.2.13에서 업그레이드 ✅ (`core/README.md` "본선 0.2.14 검증")
  - Windows: 상속 권한 폴더를 시작 때 바로잡고 진행 탭 정상. 새 채팅 세션에서 Task 완료 → 다음 작업후보 → 다음 Task 시작, 승인 창 없음 (본인 점검)
- 셸 명령 승인 요청 16번 → 1번 ✅ (`core/docs/DECISIONS.md:352`)
  - 첫 체험에서 실제로 실행된 명령을 Kiro 판정으로 다시 돌린 결과입니다. 재실측은 9번 → 6번(남은 6번은 모두 `rm -rf`·`kill`)이었습니다.
  - 발표 자료 11쪽은 "평균 승인 요청 16번 → 1번"이라고 적었지만, 저장소 근거는 첫 체험 한 번의 재판정이라 JSON에는 "첫 체험의"로 적었습니다.
- 프론트엔드 자동 테스트 875개 통과 (Windows, 2026-10-18, `0e71a10` 커밋 기록) ✅
- ❓ "Mac·Windows 빌드 테스트 1,807개" (발표 자료 11쪽): 저장소에서 같은 숫자를 찾지 못해 JSON에서 뺐습니다.
  - 참고: 같은 시기 Windows 기록은 백엔드 unit 179·integration 562·패널 CJS 197(`b7f7ad8`), 프론트엔드 875입니다.
- 사용자 인터뷰 ✅ (발표 자료 12쪽 "본선 버전 사용자 인터뷰", 사용자 답변 "인터뷰 진행했음" 2026-11-05)
  - 컴퓨터학과 26학번 2명이 본선 버전을 직접 쓰고 인터뷰함
  - "자료구조 수업에서 배운 트리 구조를 알려 달라 했더니, 파일 탐색기를 추천해 줬다" — 폴더와 파일을 노드로 나타내는 갈림길에서 둘을 한 종류의 노드로 통일하기로 직접 정함
  - "작업을 대신해 주면서도, 내가 배울 점과 만드는 과정이 상세하게 나와 있어 편했다" — grep을 직접 만들며 '긴 단어꼴, 대소문자 구분 없이'를 스스로 고름
  - 이름은 개인정보라 포트폴리오에 넣지 않았습니다.
  - 10-12 조사 때 "인터뷰를 하지 않았다"던 답변은 이번 답변으로 바로잡았습니다.
- 예선 기준 결과(참고, JSON에서 뺌): 프론트엔드 0.0.18 기준 자동 테스트 807개, Mac 0.1.3에서 실제 모델로 앱 생성·실행·Decision 반영·재시작 후 복원

## 9. 문제와 해결 (근거 있는 것만, 본인 커밋)

- 문제: 실제 Windows 11에서 사용자별로 설치된 kiro-cli를 못 찾음(`KIRO_CLI_NOT_INSTALLED`)
  - 해결: `%LOCALAPPDATA%\Kiro-Cli` 탐색 추가, Windows 전용 테스트 실패 13개 수정 (`850b276`)
- 문제: 확장 버전을 올릴 때마다 `PROJECT_TOOLCHAIN_CHANGED_RESTART_REQUIRED` 발생
  - 해결: 같은 제품의 새 버전 업그레이드는 허용 (`7deefa3`)
- 문제: Kiro-native 호스트에서 Core가 패널 Builder를 거부해 "이걸로 시작"이 오류로 끝남
  - 해결: "Kiro 채팅에서 열기"로 전환 (`edf1751`)
- **(새로 추가)** 문제: PC가 절전(Modern Standby)에서 깨어난 뒤 Core가 다시 뜨지 않음
  - Core 수명 주기가 FAILED에 머물면 호스트가 더는 돌보지 않음
  - 패널이 처음 열릴 때 만든 대체 포트가 계속 실패함
  - 해결: FAILED 때 횟수를 제한해 `host.retry()`, 다시 연결되면 flow 포트를 한 번 다시 만듦 (`4625973`, `428f012`)
- **(새로 추가)** 문제: Windows에서 상속 권한(ACL)이 붙은 폴더 때문에 패널이 막힘
  - Project 터미널 준비가 `PRIVATE_DIRECTORY_UNSAFE`로 실패하면 패널 전체가 UNAVAILABLE이 되어, Core에 있는 Next Move도 보이지 않음
  - 화면에는 원인 코드 없이 "Core에 연결할 수 없어요"만 나옴
  - 해결: 터미널 실패는 경고로만 알리고 읽기 요청은 계속 허용, 상속 권한 폴더를 다시 조임, 시작 화면에 원인 코드 표시 (`b7f7ad8`, `0e71a10`)
- 문제: `portable/node_modules`가 git에서 무시됐고, CRLF 변환으로 kit 해시가 깨짐
  - 해결: `.gitignore` 예외와 `.gitattributes`의 `-text` 설정 (`8557115`)
- 문제: 스트리밍 응답이 탭을 바꿔야만 보임 (JSON에서는 뺌)
  - 해결: controller 변경 이벤트가 오면 다시 렌더링 (`d20317a`)

참고 — 발표 자료 11쪽의 팀 차원 기술 과제(대부분 팀원 작업이라 "문제와 해결"에는 넣지 않음):

- 커스텀이 안 되는 Kiro 채팅 패널: 선택 버튼 → Steering이 번호로 묻기, 답변 카드 → MCP 도구로 질문·선택 기록, 입력 감지 → Hook이 내 답 원문 수집
- 학습자 의도 읽기: Steering을 여러 번 다듬고 Kiro 모델을 같은 사례로 비교, 남는 실수는 Core 규칙이 원문 대조로 걸러 냄
- 끊기지 않는 실사용: Kiro 재시작에도 Core 자동 재연결, 안전한 개발 명령 미리 승인, Kiro Autopilot 기본값, Mac·Windows 양쪽 테스트. Windows 쪽 점검과 수정은 본인 담당

## 10. 링크

- github (프론트엔드 저장소): https://github.com/Hello-KU-tty/program ✅ (HTTP 200, 2026-11-05)
- github (백엔드 저장소): https://github.com/Hello-KU-tty/core ✅ (HTTP 200, 2026-11-05)
- docs (다운로드·설치 가이드): https://github.com/Hello-KU-tty/core/blob/main/docs/DOWNLOAD_GUIDE.md ✅ (HTTP 200, 2026-11-05)
- video (홍보 영상, YouTube): https://youtu.be/bPSYMvW0KEY ✅ (사용자 제공, oEmbed로 공개 확인 2026-11-05)
  - 제목: 2026 고려대학교 X AWS "AI Innovator Challenge" - Hello Vibe 홍보 영상 (Team 헬로KU티)
  - 설명란에 두 팀원의 이름·학번·역할(프론트엔드 / 백엔드)이 있습니다. 이름과 학번은 포트폴리오에 넣지 않습니다(사용자 답변).
  - 부스 운영 때 홍보 자료로 쓴 45초 영상 ✅ (사용자 답변, 2026-11-05)
  - JSON의 영상 링크는 이것 하나만 둡니다 (사용자 답변)
- 제외: 저장소의 본선 소개 영상 45초 https://github.com/Hello-KU-tty/core/blob/main/docs/assets/hello-vibe-finals-45s.mp4 (HTTP 200, 2026-11-05) — 사용자 결정으로 YouTube 영상만 남김
- 제외: 저장소의 본선 소개 영상 부스용 2분 https://github.com/Hello-KU-tty/core/blob/main/docs/assets/hello-vibe-finals-2min.mp4 (HTTP 200, 2026-11-05)
  - 저장소 45초 영상과 같은 녹화. 장면마다 7~10초씩 머물고, 화면 아래에 단계(찾기·계획·만들기·기록·다음)를 표시. 결정 뒤 Kiro가 DB·API·테스트까지 구현하는 구간(실제 약 11분)은 빨리 감기
  - 링크는 넣지 않았지만, 아래 본선 영상 내용과 11번 본선 화면 이미지 01~06은 이 영상에서 확인·추출했습니다.
- 영상을 사이트에 어떻게 보여 줄지는 포트폴리오 저장소에서 정합니다 (사용자 답변).
- 링크 `type: "video"`는 포트폴리오 스키마(`src/content/schema.ts`의 `LinkType`)에 있는 값입니다 ✅
  - 사이트에서는 재생 아이콘이 붙은 "영상" 링크로 보입니다(dayce·gudory와 같은 방식).
  - 페이지 안에서 영상을 바로 재생하는 칸은 아직 없습니다. 화면 칸(`screenshots`)은 이미지만 받습니다.
- 제외: 예선 영상(GitHub user-attachments 주소, 10-12에 비로그인 HTTP 404) ❓
- 제외: `core/docs/assets/vibe-helper-demo.mp4` (예선 시기 영상) ❓

### YouTube 홍보 영상 내용 (프레임 확인)

본선 소개 영상이자 부스 홍보용 45초 영상입니다(사용자 답변). 저장소의 `hello-vibe-finals-45s.mp4`(hurdooagent)와 길이·흐름은 같지만 **다른 파일**이고 화면과 예시가 다릅니다(2026-11-05 두 영상을 나란히 놓고 확인).

- 화면: Kiro 옆 "AGENT PANEL: BUILDER & HELPER" 패널 안에 빌더·도우미·학습 기록 탭이 있는 구조입니다. Builder가 Kiro 채팅으로 옮겨 가기 전(예선 설치물) 화면입니다. 화면 속 앱에 2026-09-30 날짜가 보입니다.
- 첫 문구 "만들면서, 이해의 근거를 남기는 Kiro 개발 환경", 마지막 문구 "코드를 넘어, 이해까지." / "쌓인 근거가 다음 설명과 다음 프로젝트 추천을 바꿉니다", 표기 "Kiro IDE Extension · Team Hello-KU-tty"

예시 흐름: "웹앱에서 데이터를 저장하고 다시 불러오는 방법을 배우고 싶어요"

1. 01 LEARNING GOAL: 배우고 싶은 것 하나 입력
2. 02 DISCOVERY: 나에게 맞는 프로젝트 10개(학습 노트 앱, 독서 기록 트래커, 지출 내역 기록장 등)
3. 03 LEARNING SPEC: 내가 배울 것 "localStorage · 데이터 지속성", 내가 정할 결정 "저장 시점 · 데이터 구조", Agent가 도울 것 "화면 레이아웃 · 스타일"
4. 04 BUILDER: Agent가 만들다가 중요한 판단은 넘김 — 패널의 결정 카드 "메모를 어떻게 저장할까요?"(저장 버튼으로 저장(추천) / 입력 중 자동 저장). "교육용 가짜 질문이 아닌, 실제 개발 중 생긴 결정만"
5. 05 HELPER: "공부 기록용이면 자동 저장이 더 나을까요? 자동 저장은 코드가 얼마나 복잡해져요?"
6. 06 DECISION: 내 이유로 결정 — "저장 버튼을 누르는 순간 localStorage에 들어가는 걸 직접 확인하면서…"
7. 07 EVIDENCE: 내가 적은 선택 이유만 근거(웹 스토리지 · 이해 근거 1건 인정), 도우미에게 질문만 한 것과 Agent가 작성한 코드는 근거 아님
8. 08 RESULT: 내가 정한 방식으로 동작하는 학습 메모장 앱(저장 → 저장된 메모 목록)

이 영상의 패널 화면(Discovery·Learning Spec·Builder 결정 카드·근거 기록)은 본인이 만든 예선 패널입니다(3번 "내가 한 일" 프론트엔드 항목).

### 본선 소개 영상 내용 (2분 부스용, 프레임 확인)

예시 주제: "여러 명이 동시에 신청해도 정원이 넘지 않게 만드는 법을 배우고 싶어요" + 내 사정 "동아리 신입 부원을 선착순으로 받으려고요"

1. 찾기: 그 기술이 꼭 쓰이는 후보 10개 → "두 개 합쳐 줘. 부원들이 휴대폰으로 신청하는 화면도 있으면 좋겠어"로 하나로 좁힘
2. 계획(Learning Spec): 내가 배울 것 "동시성 문제를 DB 제약으로 해결하기", Agent가 맡을 것 "휴대폰 화면·Express 서버", 이번엔 뺄 것 "결과 발표 이메일 자동화"
3. 만들기: Kiro가 만들다가 "신청자 정보를 어떤 필드로 저장할까?"에서 멈추고 묻기
   - `/vibe-helper`로 질문하면 Helper(읽기 전용)가 "학번은 사람마다 하나로 고정돼 기준으로 강하다"고 설명
   - 학습자가 "3번으로 할게. 우리 동아리는 우리 학교 학생만 받아서 다들 학번이 있고, 이메일은 새로 만들면 그만이지만 학번은 못 바꾸니까 학번 기준으로 막자"로 답함
   - 나머지 구현(학번 UNIQUE 제약 DB 설계, 신청 API·휴대폰 화면)은 AI가 맡음
   - 결과: 신청하면 순번이 바로 나오고, 같은 학번은 이메일을 바꿔도 거절되는 앱
4. 기록: 내 말로 쓴 선택 이유만 근거(관계형 데이터베이스 설계 · "직접 적용했어요"), Helper에게 질문만 한 것과 AI가 작성한 코드는 근거 아님
5. 다음: 신청 취소 기능 · 여러 동아리 모집 관리 · 신청 현황 실시간 대시보드

## 11. 이미지

사용자가 선택을 맡겨서(2026-11-05) 대표 이미지 1장과 화면 8장으로 정했습니다. 모두 원본 그대로이고(자르거나 크기를 바꾸지 않음), 비율 맞추기는 포트폴리오 저장소에서 합니다.

| 파일 (`images/` 사본)            | 종류      | 크기      | 무엇을 보여주는지                                                                                                                                 | 원본                                 |
| -------------------------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `thumbnail.png`                  | 가로 대표 | 1920×1080 | "코드를 넘어, 이해까지." 문구, Hello Vibe 글자, "쌓인 근거가 다음 설명과 다음 프로젝트 추천을 바꿉니다", "Kiro IDE Extension · Team Hello-KU-tty" | YouTube 홍보 영상 마지막 장면 (0:43) |
| `01-discovery.png`               | 웹 화면   | 1920×1080 | 본선 패널의 Discovery: 기술이 꼭 필요한 후보 10개                                                                                                 | 본선 2분 영상 0:30                   |
| `02-learning-spec.png`           | 웹 화면   | 1920×1080 | 본선 패널의 Learning Spec: 내가 배울 것·Agent가 맡을 것                                                                                           | 본선 2분 영상 0:46                   |
| `03-builder-asks.png`            | 웹 화면   | 1920×1080 | Kiro 채팅 Builder가 갈림길에서 번호 선택지·추천으로 묻고, 패널 "지금 할 일"에도 같은 질문이 뜸                                                    | 본선 2분 영상 0:57                   |
| `04-helper.png`                  | 웹 화면   | 1920×1080 | `/vibe-helper`에 내 상황을 붙여 묻고 읽기 전용 Helper가 설명                                                                                      | 본선 2분 영상 1:07                   |
| `05-learning-record.png`         | 웹 화면   | 1920×1080 | 학습 기록 탭(학습자 말 인용)과 근거로 세는 것·세지 않는 것                                                                                        | 본선 2분 영상 1:41                   |
| `06-next-move.png`               | 웹 화면   | 1920×1080 | 진행 탭의 다음 한 걸음 3개                                                                                                                        | 본선 2분 영상 1:50                   |
| `07-prelim-learning-spec.png`    | 웹 화면   | 1920×1080 | 예선 패널의 Learning Spec(내가 배울 것·정할 결정·Agent가 도울 것)                                                                                 | YouTube 홍보 영상 0:15               |
| `08-prelim-builder-decision.png` | 웹 화면   | 1920×1080 | 예선 패널의 Builder 결정 카드 "메모를 어떻게 저장할까요?"                                                                                         | YouTube 홍보 영상 0:20               |

고른 기준:

- 본선 흐름(찾기 → 계획 → 만들기 → 기록 → 다음)을 01~06으로 한 번씩 보여 줌
- 07·08은 본인이 직접 만든 예선 패널(Learning Spec 화면 흐름, Builder 결정 카드)이 보이는 장면
- 모두 영상 장면(1920×1080, 같은 어두운 화면 스타일)으로 통일하고, 글자 위주인 발표 슬라이드는 뺌
- 영상 장면에는 왼쪽에 단계 제목, 오른쪽에 실제 화면이 함께 있습니다. 화면만 쓰려면 포트폴리오 저장소에서 잘라야 합니다.

- 대표 이미지: YouTube 홍보 영상(본선 소개 영상)의 마지막 장면 ✅ (사용자 답변 2026-11-05)
  - JSON의 영상 링크와 같은 영상이라 대표 이미지와 영상이 맞습니다.
  - 예전 후보(개념도 `knowledge-structure-presentation.png`, 저장소 45초 영상 표지 `hello-vibe-finals-45s-poster.jpg`)는 사용자 결정으로 뺌
- 로고·아이콘: 없음 ✅ (사용자 답변 "유령 아이콘 쓰지 마", 2026-11-05)
- 뺀 후보: 발표 자료 슬라이드(사이클·구조·Builder·Helper), 예선 Discovery·학습 기록 장면, 본선 Discovery 다듬기 장면
- 제외: 발표 자료 13쪽 마무리 화면의 리본 단 유령 캐릭터들. 기존 캐릭터를 본뜬 것으로 보여 넣지 않았습니다.
- 제외: 발표 자료 표지(팀원 실명 포함), 12쪽 인터뷰(인터뷰 대상자 실명 포함), 본선 영상의 완성 앱 장면(예시 이름 입력값 포함)

## 12. 관련 활동·수상·경력

- 고려대학교 × AWS "AI Innovators Challenge" 본선 진출, 2026-10-19 본선 발표, 2026-10-20 부스 운영, 대회 전체 6위 (본선 수상 없음) ✅ (사용자 답변)
  - 공식 명칭 "AI Innovators Challenge" ✅ (사용자가 준 공식 공고 캡처, 2026-08-03 게시)
  - 주최: 고려대학교 ICT명품인재양성사업단/초지능연구센터, 정보대학
  - 주제: AWS가 제공하는 LLM API를 활용한 AI 서비스 개발 / 참가 대상: 고려대 학부·대학원생(팀당 최대 5인)
  - 상: 대상·우수상·장려상·인기상(2팀). 6위는 수상이 아니라서 수상경력보다는 활동(competition)으로 연결하는 편이 맞습니다.
  - YouTube 제목의 "AI Innovator Challenge"는 공식 명칭과 한 글자 다릅니다(영상 제목은 그대로 둠).

## 13. 배운 점 (사용자 답변을 바탕으로 작성)

사용자 답변: "extension 개발이 처음이고, AI를 프로그램 기능에 넣어 본 것도 처음"

- 확장 프로그램 개발이 처음이어서, 확장 호스트와 webview가 메시지로만 주고받는 구조에 맞춰 화면 상태를 Controller로 분리하는 방법을 익혔습니다.
- AI를 프로그램 기능에 처음 넣어 보면서, 모델 응답이 실패하거나 중단되는 경우를 사용자에게 알맞게 안내하는 일이 기능 구현만큼 중요하다는 것을 배웠습니다.

- 실제 Windows PC에서 점검해 보니 기능 버그보다 절전, 폴더 권한, 화면 배치 같은 환경 문제가 더 자주 사용자를 막아서, 원인 코드를 화면에 보여 주는 것처럼 문제를 빨리 찾게 하는 처리가 중요하다는 것을 배웠습니다. ✅ (사용자가 문장을 맡김 2026-11-05, 근거: `4625973`, `4ec5843`, `0e71a10`, `b7f7ad8`)

## 14. 제외한 내용과 이유

- `KiroAcpAdapter`: 실제 전송 계층이 없는 실험 코드 (`program/src/adapter/kiro-acp-adapter.ts:6-26`)
- `CrewBackendPort`: 모든 메서드가 `NOT_IMPLEMENTED`
- DemoAdapter·MockAdapter: 개발·테스트용
- React·Vite: 초기 경로 `apps/crew-app`에서만 사용
- "Kiro Crew 앱에서 Core를 먼저 확인했다"(발표 자료 10·15쪽): 저장소의 Crew 경로가 초기 실험이라 JSON에서는 "다른 도구에도 붙일 수 있게 설계"까지만 적었습니다.
- 발표 자료 15쪽 향후 계획(다른 개발 환경 이식, 배포까지 지원, Analyst 정확도, 사용자 검증 확대): 아직 구현되지 않아 제외
- 팀원 작업(Next Move, 진행·학습 기록 패널 개편, 미리 승인): 기능 목록에는 넣고 "내가 한 일"에서는 제외
- CI·LICENSE: 두 저장소 모두 없음 (사실 기록용)
- Codex: 사용하지 않음 (사용자 답변)

## 확정된 답 (2026-11-05)

- `period.start`: `2026-08` 유지 ✅ (사용자 답변)
- 팀 이름 영문 표기 "Hello-KU-tty" ✅ (사용자 허락, YouTube 영상 표기 "Team Hello-KU-tty"를 따름)
- 대회 공식 명칭 "AI Innovators Challenge" ✅ (공식 공고 캡처)
- YouTube 영상 = 부스 운영 때 쓴 45초 홍보 영상, 영상 링크는 이것만 ✅
- 팀원 실명은 포트폴리오에 넣지 않음 ✅
- 이미지 선택과 배운 점 추가 문장은 사용자가 맡김 ✅

## 남은 확인 사항

- 없음

## 자체 점검 (2026-11-05)

- [x] JSON의 모든 문장이 ✅ 항목이나 사용자 답변에 근거가 있다
- [x] 🟡/❓ 내용은 JSON에 없다 (발표 자료의 1,807개는 뺐다)
- [x] 숫자는 측정값이거나 사용자가 확인한 값이다 (16→1은 `DECISIONS.md:352`, 875는 `0e71a10` 기록, 6위는 사용자 답변)
- [x] 금지어가 없다
- [x] ko와 en의 내용이 같다
- [x] 기술 스택은 실제로 코드에서 쓰인다
- [x] 비밀값·내부 URL·허락 없는 실명이 없다 (팀원·인터뷰 대상자 실명이 든 슬라이드와 예시 이름이 든 영상 장면은 이미지에서 뺐다)
- [x] 포트폴리오 저장소의 `Project` 스키마(`src/content/schema.ts`)로 검사 통과: tagline ko 38자·en 71자, role ko 17자, highlights 3개, techNotes 키가 모두 techStack에 있음
- `portfolio-export/` 폴더는 커밋하지 마세요.
