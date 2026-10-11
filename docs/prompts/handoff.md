# 로컬 세션 인수인계 프롬프트

클라우드 세션에서 하던 포트폴리오 작업을 로컬 Claude Code 세션으로 옮길 때 쓰는 프롬프트입니다. 아래 `--- 프롬프트 시작 ---`부터 `--- 프롬프트 끝 ---`까지 복사해서, 이 저장소를 연 로컬 세션의 첫 메시지로 붙여넣으세요.

---

--- 프롬프트 시작 ---

이 저장소(gaudium1257.github.io)는 내 개인 포트폴리오 사이트야. 지금까지 클라우드 세션에서 작업했고, 이제부터는 이 로컬 세션에서 프로젝트 추가, 사이트 수정 등 이후 작업을 모두 할 거야. 아래를 읽고 준비를 끝낸 다음, 현재 상태를 짧게 요약해서 보고해줘. **답은 항상 한국어로 해.**

## 1. 준비

1. 저장소 상태 맞추기
   - `git fetch origin` 후 브랜치를 확인해. PR #1(`dev/first-develop` → `main`)이 아직 병합 전이면 `dev/first-develop`에서, 병합됐으면 `main`에서 새 `dev/<설명>` 브랜치를 만들어 작업해.
   - 로컬에 커밋 안 된 변경이 있으면 건드리기 전에 나한테 먼저 알려줘.
2. 의존성 설치: `npm ci` (Node 20 이상). 세션 시작 훅(`.claude/hooks/session-start.sh`)도 자동으로 설치를 시도해.
3. 스크린샷 도구: `npm run screenshot`과 `verify` 스킬은 Playwright Chromium이 필요해. 없으면 `npx playwright install chromium`.
4. 확인: `npm run check`와 `npm run build`가 통과하는지 보고, 결과를 알려줘.

## 2. 스킬 설치·확인 (빠뜨리지 마)

이 저장소에는 스킬이 커밋돼 있어. clone하면 같이 받아지지만, 실제로 쓸 수 있는지 꼭 확인해줘.

**저장소 전용 스킬** (`.claude/skills/`에 실제 폴더, 설치 불필요)

- `add-content`: 프로젝트, 활동, 수상, 기술 스택, 학력·경력, 프로필 추가·수정
- `add-section`: 새 종류의 섹션 추가
- `verify`: 커밋 전 검사 → 빌드 → 스크린샷 확인

**외부 스킬 4개** (`.agents/skills/`에 파일이 있고, `.claude/skills/`에는 그쪽을 가리키는 심볼릭 링크만 있음. 출처는 `skills-lock.json`에 기록)

| 스킬                    | 출처                                   |
| ----------------------- | -------------------------------------- |
| `frontend-design`       | `anthropics/skills`                    |
| `ui-ux-pro-max`         | `nextlevelbuilder/ui-ux-pro-max-skill` |
| `web-design-guidelines` | `vercel-labs/agent-skills`             |
| `shadcn`                | `shadcn-ui/ui`                         |

확인 방법: `ls -la .claude/skills/`에서 네 링크가 폴더로 열리는지, 각 폴더에 `SKILL.md`가 있는지 봐. 이 세션의 사용 가능한 스킬 목록에도 7개가 다 보여야 해.

링크가 깨져 있으면(Windows에서 심볼릭 링크가 글자 파일로 받아진 경우 등) 이렇게 복구해:

1. 먼저 `npx skills experimental_install`로 `skills-lock.json`에서 한 번에 복구해 봐.
2. 안 되면 하나씩 설치해: `npx skills add anthropics/skills -s frontend-design`, `npx skills add nextlevelbuilder/ui-ux-pro-max-skill -s ui-ux-pro-max`, `npx skills add vercel-labs/agent-skills -s web-design-guidelines`, `npx skills add shadcn-ui/ui -s shadcn`. 프로젝트 범위로 설치하고, 에이전트를 물으면 Claude Code를 골라. 심볼릭 링크가 안 되는 환경이면 `--copy`를 붙여.
3. 설치 후 git diff로 `.agents/skills/` 내용이 바뀌었는지 보고, 바뀌었으면 커밋할지 나한테 물어봐.

**선택:** 클라우드 세션에는 계정 플러그인으로 `design:*` 스킬(접근성 검토, 디자인 비평, UX 문구 등)이 있었어. 로컬에 없으면 알려만 줘. 없어도 작업할 수 있어.

## 3. 반드시 지킬 것

규칙의 원본은 `CLAUDE.md`야. 특히 이건 꼭 지켜:

- **사실만 쓴다.** 내가 말하지 않았거나 근거가 없는 내용은 넣지 말고, 모르면 비우거나 물어봐.
- **한국어·영어를 둘 다 쓴다.** 모든 문구는 ko/en 둘 다. UI 문구는 `src/i18n/dictionaries/`에.
- **색은 디자인 토큰만 쓴다.** 색은 `src/app/globals.css` 토큰만. 디자인은 "Clean Stack" 시안 그대로 가고, 새 방향을 지어내지 마. 기준 문서는 `docs/design/README.md`.
- **브랜치와 병합:** `dev/<설명>` 브랜치에서만 작업하고, `main`에는 직접 푸시하지 마. 병합은 PR로 하고, 병합 버튼은 내가 누르거나 내가 "병합해"라고 할 때만 눌러.
- **커밋 전 검증:** `verify` 스킬로 검사, 빌드, 375px 포함 스크린샷까지 직접 보고 확인해.

## 4. 현재 상태 (클라우드 세션 종료 시점)

- **배포 구조:** `main`에 병합되면 `.github/workflows/deploy.yml`이 엄격 검증 → 빌드 → GitHub Pages(https://gaudium1257.github.io/)로 배포해. Pages 소스는 GitHub Actions로 이미 설정돼 있어.
- **PR #1:** https://github.com/gaudium1257/gaudium1257.github.io/pull/1 (`dev/first-develop` → `main`). CI는 통과했고 병합 대기 중이야. `main`에는 아직 초기 커밋만 있어.
- **채워진 내용**
  - `content/profile.json`: 이름 김태호 / Taeho Kim, 한 줄 소개와 자기소개, 이메일 twehokim@gmail.com, GitHub gaudium1257, Instagram tweho_k, Discord gaudium1257
  - 증명사진: `public/images/profile/taeho-kim.jpg`
  - `content/education.json`
    - 학력: 고려대학교, 2026.03부터 재학 중(전공은 아직 모름)
    - 경력: THE해커톤CAMPUS 고려대학교 지부 운영진, 2026.09부터
- **비어 있는 내용:** 프로젝트, 활동, 수상, 기술 스택(`skills.json`). 비어 있는 섹션은 "아직 등록된 내용이 없어요."로 보여.
- **내가 정한 것** (다시 묻거나 되돌리지 마)
  - 메뉴 순서: 소개 → 기술 스택 → 프로젝트 → 활동 → 수상 → 학력 및 경력사항 → 연락처
  - "대외활동"이 아니라 **"활동"**
  - **학회 섹션은 없앰.** 학회·동아리 운영 이력은 경력으로 씀
  - 기술 스택에는 **사용 횟수 숫자를 표시하지 않음.** 기술을 누르면 그 기술을 쓴 프로젝트만 보이는 필터는 유지
  - 한 줄 소개·자기소개는 프로젝트를 직접 설명하지 말고, 프로젝트들에서 드러나는 **"내가 어떤 사람인지"** 를 씀
  - 디자인 방향: 깔끔함, 신뢰감, 기술 스택의 시각화. 미니멀 텍스트 중심, GitHub 링크 연동, 컴포넌트 중심. 기하학 장식은 최소로
  - 프로젝트마다 성격이 다르면, 기본 양식 하나에서 데이터가 있는 블록만 보이게 하는 방식(상세 페이지의 블록 레지스트리)으로 대응

## 5. 프로젝트 추가하는 법

1. 내가 추가할 프로젝트 폴더에서 별도 Claude 세션을 열고 `docs/prompts/project-fact-sheet.md`의 프롬프트를 실행해. 저장소가 여러 개인 프로젝트는 상위 폴더에 모아서 열고, 저장소 하나면 그 폴더에서 열면 돼.
2. 그 결과(① 팩트시트 Markdown, ② JSON)를 이 세션에 붙여넣으면, 너는 `add-content` 스킬대로 처리해:
   - 팩트시트는 `content/sources/projects/<id>.md`에, JSON은 `content/projects/<id>.json`에 저장
   - `content-fact-checker` 에이전트로 검토
   - 관련 항목(related) 연결
   - `skills.json`에 기술 이름 추가(프로젝트의 `techStack`과 표기를 똑같이)
   - 대표(featured) 여부와 이미지를 나한테 물어봐
3. 첫 후보 프로젝트는 SHOWROOMZ(팀 커머스 서비스, 저장소 여러 개)와 TH_KOREA_vs_yonsei(개인, 봇 대결 시뮬레이터와 강화학습)야. 둘 다 아직 팩트시트가 없어.

## 6. 남은 일·알아둘 것

- **PR #1 병합:** 내가 결정해.
- **GitHub 별·최근 커밋:** `src/data/github-snapshot.json`이 비어 있고, 이 값을 채우는 스크립트도 아직 없어. 그래서 지금은 별과 최근 커밋이 화면에 안 나와. 필요해지면 가져오는 스크립트를 만들지 나한테 물어봐(빌드 중에는 네트워크를 쓰지 않는 구조야).
- **한 줄 소개·자기소개:** 지금은 SHOWROOMZ와 TH_KOREA_vs_yonsei를 근거로 썼어. 프로젝트가 늘어나면 다시 쓸지 제안해줘.
- **영어 표기:** THE해커톤CAMPUS의 영어 표기는 한글 그대로 둔 상태야. 공식 영어 이름이 있으면 바꿀 것.
- **알려진 lint 경고:** `npm run check`의 lint 경고 2개는 `docs/design/mockup/sys/dc-logic.js`에서 원래 있던 것이니 무시해도 돼.
- **디자인 자료:** 시안 생성기는 `docs/design/mockup/`, 디자인 규칙과 결정 기록은 `docs/design/README.md`에 있어. 디자인 캔버스는 https://claude.ai/artifact/95ysTmLFNbQUmphosPmcRx

준비가 끝나면 보고해줘: 브랜치, 검사·빌드 결과, 스킬 7개 사용 가능 여부, PR #1 상태, 다음에 할 일 제안.

--- 프롬프트 끝 ---
