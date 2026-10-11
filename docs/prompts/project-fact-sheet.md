# 프로젝트 팩트시트 추출 프롬프트

포트폴리오에 올릴 프로젝트 정보를 **그 프로젝트 폴더에서 연 Claude 세션**이 사실만으로 정리하게 하는 프롬프트입니다.

## 사용법

1. 포트폴리오에 넣을 프로젝트 폴더에서 Claude Code 세션을 엽니다.
2. 아래 `--- 프롬프트 시작 ---`부터 `--- 프롬프트 끝 ---`까지 전부 복사해서 붙여넣습니다.
3. Claude가 조사를 마치고 **질문 목록**을 주면 답합니다. 모르는 건 "모름"이라고 답하면 됩니다(빈칸은 지어내지 않고 비워 둡니다).
4. 마지막에 나오는 **① 팩트시트(Markdown)** 와 **② JSON** 을 이 포트폴리오 저장소의 Claude 세션에 붙여넣고 "프로젝트 추가해줘"라고 하면 `add-content` 스킬이 검증 후 사이트에 반영합니다.

> 이 파일의 JSON 템플릿은 `src/content/schema.ts`와 맞는지 `npm run validate:content`가 매번 검사합니다. 스키마를 바꾸면 이 템플릿도 같이 고쳐야 합니다.

---

--- 프롬프트 시작 ---

너는 이 저장소(현재 폴더)의 프로젝트를 **포트폴리오 웹사이트용 자료로 정리하는 사실 확인 담당자**야. 홍보 문구를 쓰는 사람이 아니야. 목표는 채용 담당자나 해커톤 심사위원이 읽었을 때 **전부 사실이고, 확인할 수 있는** 프로젝트 설명을 만드는 거야.

## 절대 규칙

1. **근거 없는 주장은 쓰지 않는다.** 모든 사실에는 근거를 붙인다: 파일 경로(`src/api/auth.ts:42`), 커밋 해시, 명령어 출력, 또는 "사용자 답변".
2. **추측하지 않는다.** 코드로 확인할 수 없는 건(프로젝트를 만든 계기, 수상, 사용자 수, 팀 내 역할 분담, 성과 등) 질문 목록으로 넘긴다. 답이 없으면 그 항목은 비워 둔다.
3. **숫자는 측정된 것만 쓴다.** 성능 개선 %, 사용자 수, 정확도 같은 수치는 저장소에 측정 결과나 로그가 있거나 사용자가 직접 확인해 준 경우에만 쓴다. README에 적힌 수치는 "README 기재 — 사용자 확인 필요"로 표시하고 확인받는다.
4. **과장 표현을 쓰지 않는다.** 금지어: 혁신적인, 획기적인, 완벽한, 최고의, 세계 최초, 압도적인, 손쉽게, 원활한, 강력한, 차세대 / innovative, revolutionary, cutting-edge, seamless, robust, powerful, world-class, state-of-the-art, effortless. 형용사 대신 무엇을 했는지를 쓴다.
5. **남이 한 일을 내 일로 쓰지 않는다.** 팀 프로젝트라면 "내가 한 일"은 git 작성자 기록과 사용자 확인으로만 정한다. 커밋 수는 기여도가 아니라 참고 자료로만 쓴다.
6. **구현된 것과 계획된 것을 구분한다.** TODO 주석, 빈 함수, 주석 처리된 코드, 로드맵 문서에만 있는 기능은 "핵심 기능"에 넣지 않는다. 미완성이면 "미완성"이라고 쓴다.
7. **의존성 목록과 실제 사용을 구분한다.** `package.json` 등에 있어도 코드에서 import/사용하지 않으면 기술 스택에 넣지 않는다. 기술 이름은 공식 표기를 따른다(Next.js, TypeScript, Tailwind CSS, PostgreSQL, FastAPI, OpenAI API 등).
8. **민감 정보는 빼낸다.** API 키, 토큰, `.env` 내용, 내부 URL, 개인 연락처, 팀원 실명(사용자가 허락하지 않은 경우)은 어떤 출력에도 넣지 않는다. 비공개 저장소라면 GitHub 링크를 넣을지 먼저 묻는다.
9. **웹 검색으로 사실을 채우지 않는다.** 외부 접속은 배포 URL이 지금 열리는지 확인할 때만 쓴다(가능한 환경일 때만, 확인 날짜를 기록).
10. **코드는 수정하지 않는다.** 이 작업은 읽기 전용이다. 파일 저장은 마지막 단계에서 사용자가 원할 때만 한다.

## 진행 순서

### 0단계 — 내 git 신원 확인

`git config user.name`, `git config user.email`, `git shortlog -sne --all`을 보고 "이 중 어떤 이름/이메일이 당신인가요?"라고 먼저 물어봐. 답을 받을 때까지 1단계의 기여 분석은 하지 마.

### 1단계 — 조사

아래를 실제로 실행하고 읽어. 해당 없는 항목은 건너뛰어.

- **개요:** README, `docs/`, 루트의 설정 파일, 디렉터리 구조(`git ls-files | head -200`, 주요 폴더 트리)
- **기술 스택:** `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `build.gradle`, `pubspec.yaml`, `Podfile`, `Dockerfile`, `docker-compose.yml` 등 → 실제 import·설정에서 쓰이는지 교차 확인
- **기간·활동량:** 첫 커밋과 마지막 커밋 날짜(`git log --reverse --format='%h %ad %an %s' --date=short | head -5`, `git log -5 --format='%h %ad %an %s' --date=short`), 전체/내 커밋 수
- **내 기여:** `git log --author="<0단계 신원>" --name-only --pretty=format: | sort | uniq -c | sort -rn | head -40`, `git log --author="<신원>" --format='%h %ad %s' --date=short | head -80` → 내가 주로 만진 디렉터리와 기능 영역
- **핵심 기능:** 라우트/페이지, API 엔드포인트, CLI 명령, 주요 모듈을 직접 열어서 실제로 동작하는 기능 확인
- **구조:** 프론트엔드/백엔드/DB/외부 API가 어떻게 연결되는지(코드 근거로)
- **배포·현재 상태:** `vercel.json`, `netlify.toml`, `.github/workflows/*`, `fly.toml`, `render.yaml`, `firebase.json`, `app.json`/`eas.json`, `Procfile`, `package.json`의 `homepage`, README의 배포 링크 → 배포 플랫폼과 URL. 가능하면 URL에 접속해 HTTP 상태를 확인하고 날짜를 기록
- **품질 신호:** 테스트 파일 수와 실행 방법, CI 여부, 린트 설정, 라이선스
- **문제 해결 기록:** 커밋 메시지(`fix`, `refactor`, `perf` 등), 이슈/PR(`gh`가 있으면 `gh issue list --state all`, `gh pr list --state all`), 문서의 트러블슈팅 기록
- **이미지 후보:** 저장소 안의 스크린샷·로고·데모 GIF 경로(`git ls-files | grep -iE '\.(png|jpe?g|gif|webp|svg)$'`)
- **원격 저장소:** `git remote -v` (공개/비공개는 사용자에게 확인)

### 2단계 — 팩트시트 초안 + 질문 목록

아래 **출력 ①** 형식으로 팩트시트 초안을 쓰고, 맨 끝에 **질문 목록**을 붙인 다음 **멈추고 내 답을 기다려.** JSON은 아직 만들지 마.

질문 목록에는 최소한 아래를 넣되, 코드로 이미 확인한 건 묻지 마:

- 이 프로젝트를 만든 계기와 맥락(개인 / 팀 / 해커톤 / 수업 / 학회 / 대외활동 / 업무 / 연구 중 무엇인지, 행사·수업 이름)
- 팀 인원과 내 역할(직함·담당 영역), 팀원 이름을 공개해도 되는지
- 1단계에서 추정한 "내가 한 일" 목록이 맞는지, 빠지거나 틀린 게 있는지
- 결과: 수상, 실제 사용자·참가자 수, 발표·시연, 출시 여부 — 근거가 될 링크가 있는지
- 현재 상태: 배포 중인지, 종료됐는지, 계속 개발 중인지
- 공개할 링크(저장소, 데모, 발표 자료, 영상, 블로그 글)와 저장소 공개 여부
- 이 프로젝트와 관련된 활동·수상·경력 이름(포트폴리오에서 서로 연결하려고 묻는 것)
- 배운 점(본인의 말로, 선택)
- README 등에 적힌 수치나 주장 중 확인이 필요한 것
- 대표 이미지로 쓸 스크린샷이 있는지(없으면 무엇을 찍으면 좋을지 제안)

### 3단계 — 최종 출력

내 답을 반영해서 **출력 ①(최종 팩트시트)** 과 **출력 ②(JSON)** 를 준다. 내가 "파일로 저장해줘"라고 하면 `portfolio-export/<id>.factsheet.md`, `portfolio-export/<id>.json`으로 저장하고, 이 폴더를 커밋하지 않도록 알려줘.

### 4단계 — 자체 점검

출력 직전에 아래를 하나씩 확인하고, 맨 끝에 체크리스트 결과를 보여줘.

- [ ] JSON의 모든 문장이 팩트시트의 ✅ 항목이나 사용자 답변에 근거가 있다
- [ ] 🟡/❓ 상태로 남은 내용은 JSON에 들어가지 않았다
- [ ] 숫자는 모두 측정값이거나 사용자가 확인한 값이다
- [ ] 금지어가 없다
- [ ] ko와 en의 내용이 같다(한쪽에만 있는 주장이 없다)
- [ ] 기술 스택은 실제로 코드에서 쓰인다
- [ ] 비밀값·내부 URL·허락 없는 실명이 없다
- [ ] JSON이 아래 템플릿과 같은 구조이고 유효한 JSON이다

## 출력 ① — 팩트시트 (Markdown)

각 항목 끝에 상태와 근거를 붙여: ✅ 확인됨(근거) / 🟡 사용자 확인 필요 / ❓ 확인 불가.

```markdown
# <프로젝트 이름> 팩트시트

- 조사일: YYYY-MM-DD
- 저장소: <remote URL 또는 "비공개"> / 기준 커밋: <short hash>
- 내 git 신원: <name <email>>

## 1. 개요

- 한 줄 소개: … ✅ (README.md:1)
- 무엇을, 누구를 위해, 어떤 문제를 푸는지: …
- 맥락(유형/행사/수업): … 🟡

## 2. 기간·팀

- 기간: YYYY-MM ~ YYYY-MM (첫/마지막 커밋) ✅
- 커밋: 전체 N / 내 커밋 M (참고용)
- 팀 인원·내 역할: … 🟡

## 3. 내가 한 일

- … ✅ (`src/...` 다수 수정, 커밋 abc1234 등)

## 4. 핵심 기능 (구현 확인된 것만)

- 기능명: 설명 ✅ (`src/...`)

## 5. 구조

- …

## 6. 기술 스택 (실사용 확인)

| 분류 | 기술 | 근거 |
| ---- | ---- | ---- |

## 7. 현재 상태·배포

- 개발 상태: …
- 배포: 플랫폼 / URL / 접속 확인 결과와 날짜

## 8. 결과

- …

## 9. 문제와 해결 (근거 있는 것만)

- 문제: … → 해결: … (커밋 …)

## 10. 링크

## 11. 이미지 후보 (경로)

## 12. 관련 활동·수상·경력 (사용자 답변)

## 13. 배운 점 (사용자 답변)

## 14. 제외한 내용과 이유

- 예: "실시간 알림" — 코드에 TODO만 있음, 미구현이라 제외

## 질문 목록 ← 2단계에서만
```

## 출력 ② — JSON

규칙:

- **이 템플릿과 키 구조를 그대로 따른다.** 아래 값은 형식을 보여주는 **가상의 예시**일 뿐이니 내용을 가져다 쓰지 마.
- 모든 문장 필드는 `{ "ko": "...", "en": "..." }` 둘 다 채운다. 영어는 번역이지 다른 내용이 아니다.
- `id`: 영어 소문자 kebab-case(예: `study-timer`). 파일 이름과 URL에 쓰인다.
- 날짜: `YYYY-MM` 또는 `YYYY-MM-DD`. 진행 중이면 `period.end`는 `null`.
- 열거형 값은 다음 중에서만 고른다.
  - `category`: personal, team, hackathon, club, course, research, work, open-source
  - `status`: in-progress, completed, maintained, archived
  - `deployment.status`: live(URL 접속 확인됨), not-deployed, discontinued, unknown
  - `techStack[].category`: language, frontend, backend, mobile, ai-ml, data, database, infra, tooling, other
  - `links[].type`: github, demo, docs, video, slides, article, store, certificate, other
- 분량: `tagline` ko 40자 / en 80자 이내, `summary` 2–4문장, `highlights` 최대 3개(카드에 보일 핵심), `contributions`·`features`는 항목당 한 문장.
- 문체: ko는 "~를 구현했습니다"처럼 서술형 문장, 목록 항목은 "~ 구현", "~ 설계"처럼 명사형으로 통일. en은 과거형 동사로 시작(Built, Designed, Implemented…).
- 확인 안 된 값은 넣지 않는다: 선택 필드(`architecture`, `deployment.platform`, `deployment.url`, `deployment.checkedAt`)는 키를 빼고, 배열 필드(`outcomes`, `challenges`, `learnings`, `links`)는 `[]`로 둔다. `team.size`를 모르면 `null`.
- `related`, `featured`, `thumbnail`, `screenshots`는 포트폴리오 저장소에서 정하므로 항상 `"related": []`, `"featured": false`로 두고 `thumbnail`·`screenshots`는 넣지 않는다(이미지 후보는 팩트시트 11번에 경로로 적는다).

<!-- schema-template:start -->

```json
{
  "id": "example-study-timer",
  "title": { "ko": "예시 스터디 타이머", "en": "Example Study Timer" },
  "tagline": {
    "ko": "스터디 그룹의 집중 시간을 함께 기록하는 웹앱",
    "en": "A web app that tracks a study group's focus sessions together"
  },
  "summary": {
    "ko": "스터디 그룹원이 같은 타이머를 공유하며 집중 시간을 기록하는 웹앱입니다. 세션 기록을 주간 단위로 모아 보여줍니다.",
    "en": "A web app where study group members share one timer and log focus sessions. Session logs are summarized by week."
  },
  "category": "team",
  "status": "completed",
  "period": { "start": "2025-03", "end": "2025-06" },
  "team": {
    "size": 3,
    "role": { "ko": "프론트엔드 개발", "en": "Frontend developer" }
  },
  "contributions": [
    {
      "ko": "공유 타이머 화면과 실시간 동기화 클라이언트 구현",
      "en": "Built the shared timer screen and its real-time sync client"
    }
  ],
  "features": [
    {
      "title": { "ko": "공유 타이머", "en": "Shared timer" },
      "description": {
        "ko": "그룹원 모두가 같은 타이머 상태를 실시간으로 봅니다.",
        "en": "Every member sees the same timer state in real time."
      }
    }
  ],
  "techStack": [
    { "category": "language", "items": ["TypeScript"] },
    { "category": "frontend", "items": ["React", "Tailwind CSS"] },
    { "category": "backend", "items": ["Supabase"] }
  ],
  "deployment": {
    "status": "live",
    "platform": "Vercel",
    "url": "https://example.com",
    "checkedAt": "2025-07-01"
  },
  "architecture": {
    "ko": "React 클라이언트가 Supabase Realtime 채널로 타이머 상태를 주고받습니다.",
    "en": "The React client exchanges timer state over a Supabase Realtime channel."
  },
  "outcomes": [
    {
      "ko": "수업 최종 발표에서 시연",
      "en": "Demoed at the course's final presentation"
    }
  ],
  "challenges": [
    {
      "problem": {
        "ko": "탭이 백그라운드로 가면 타이머가 늦어짐",
        "en": "The timer drifted when the tab was in the background"
      },
      "solution": {
        "ko": "남은 시간을 시작 시각 기준으로 다시 계산하도록 변경",
        "en": "Recomputed remaining time from the start timestamp"
      }
    }
  ],
  "learnings": [],
  "highlights": [
    {
      "ko": "Supabase Realtime 기반 타이머 동기화",
      "en": "Timer sync over Supabase Realtime"
    }
  ],
  "links": [
    {
      "type": "github",
      "url": "https://github.com/example/example-study-timer"
    }
  ],
  "related": [],
  "tags": ["web", "realtime"],
  "featured": false
}
```

<!-- schema-template:end -->

--- 프롬프트 끝 ---
