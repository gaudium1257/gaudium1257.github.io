# CLAUDE.md

> **이 파일은 지도(map)다. 백과사전이 아니다.**
> 여기엔 "무엇이 어디에 있는가"와 "절대 어기면 안 되는 것"만 적는다.
> 상세는 `docs/`와 `.claude/skills/`에 있다. **필요한 것만 열어라.**
> 이 파일이 200줄을 넘으면, 넘친 내용은 `docs/`로 옮기고 여기엔 링크만 남긴다.

---

## 1. 이 저장소는 무엇인가

개인 포트폴리오 사이트. 리포지터리 전체가 곧 공개 웹사이트다
(`github.com/gaudium1257/gaudium1257.github.io` → GitHub Pages).

**앱은 하나이고, 모드가 둘이다.**

| 모드 | 누구에게 | 무엇을 |
|---|---|---|
| 공개 모드 | 학회 심사위원, 채용 담당자 | 포트폴리오를 읽는다 |
| **관리자 모드** | 본인 (GitHub 인증 통과 시) | 프로젝트·리뷰·글을 쓰고 고친다 |

관리자 모드는 별도 앱도, 별도 URL도 아니다. **같은 사이트 안에서 인증하면 열린다.**
인증은 GitHub이 판정한다 — 앱이 판정하지 않는다. 반드시 → [ADR-0004](docs/design-docs/adr/0004-single-app-admin-mode.md)

스택: React 19 + TypeScript(strict) + Vite + Tailwind + **shadcn/ui** + Zod.

> ⚠️ **현재 상태: 하네스만 존재하고 애플리케이션 코드는 아직 없다.**
> 첫 작업은 → [docs/exec-plans/active/0001-bootstrap-scaffold.md](docs/exec-plans/active/0001-bootstrap-scaffold.md)

---

## 2. 지도 — 알고 싶은 게 있을 때 여는 문서

| 알고 싶은 것 | 열어볼 곳 |
|---|---|
| 시스템 전체 구조, 레이어, 의존성 방향 | [ARCHITECTURE.md](ARCHITECTURE.md) |
| **관리자 모드 인증이 어떻게 동작하나** | [ADR-0004](docs/design-docs/adr/0004-single-app-admin-mode.md), [docs/SECURITY.md](docs/SECURITY.md) |
| **콘텐츠가 어디에 저장되고 어떻게 게시되나** | [ADR-0003](docs/design-docs/adr/0003-content-store.md) |
| 왜 이렇게 만들었나 (핵심 신념) | [docs/design-docs/core-beliefs.md](docs/design-docs/core-beliefs.md) |
| 코드를 쓸 때 지켜야 할 취향 규칙 | [docs/design-docs/golden-rules.md](docs/design-docs/golden-rules.md) |
| 과거 기술 결정과 그 근거 | [docs/design-docs/adr/index.md](docs/design-docs/adr/index.md) |
| 지금 진행 중인 작업 / 계획 쓰는 법 | [docs/PLANS.md](docs/PLANS.md), [docs/exec-plans/index.md](docs/exec-plans/index.md) |
| 남아 있는 기술 부채 | [docs/exec-plans/tech-debt-tracker.md](docs/exec-plans/tech-debt-tracker.md) |
| 제품이 무엇을 해야 하는가 (요구사항) | [docs/product-specs/index.md](docs/product-specs/index.md) |
| 제품 판단 기준 (뭘 만들고 뭘 안 만드나) | [docs/PRODUCT_SENSE.md](docs/PRODUCT_SENSE.md) |
| 비주얼 디자인·톤·shadcn 사용 규범 | [docs/DESIGN.md](docs/DESIGN.md) |
| 컴포넌트/상태/라우팅 프론트엔드 규약 | [docs/FRONTEND.md](docs/FRONTEND.md) |
| 테스트 전략과 무엇을 테스트하나 | [docs/TESTING.md](docs/TESTING.md) |
| 빌드·배포·장애 대응 | [docs/RELIABILITY.md](docs/RELIABILITY.md) |
| 브랜치·PR·리뷰·머지 흐름 | [docs/WORKFLOW.md](docs/WORKFLOW.md) |
| 도메인·레이어별 품질 등급 | [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md) |
| 외부 라이브러리 요약본 (llms.txt 등) | [docs/references/index.md](docs/references/index.md) |
| 코드에서 자동 생성된 문서 (직접 편집 금지) | [docs/generated/](docs/generated/) |

---

## 3. 불변식 (Invariants) — 협상 불가

**이 규칙들은 기계적으로 강제된다.** 위반하면 훅·린터·CI가 막는다.
어겨야 할 정당한 이유가 생겼다면, 코드를 우회하지 말고 **규칙 자체를 ADR로 바꿔라.**

- **INV-1 레이어 방향.** 코드는 `types → config → data → service → state → ui` 방향으로만 의존한다. 역방향·건너뛰기 금지. 횡단 관심사는 `providers` 인터페이스로만 들어온다. → [ARCHITECTURE.md](ARCHITECTURE.md)
- **INV-2 도메인 격리.** 도메인끼리 직접 import 금지. 공유가 필요하면 `src/shared/`로 올린다.
- **INV-3 경계에서 파싱.** 신뢰할 수 없는 데이터(GitHub API 응답, `content/` JSON, 브라우저 저장소, URL 파라미터, 폼 입력)는 **경계에서 스키마로 파싱**한 뒤에만 도메인 안으로 들어온다. `as` 단언으로 형태를 추측하지 않는다.
- **INV-4 `any` 금지.** `any`, `@ts-ignore`, `eslint-disable` 전면 금지. 불가피하면 `@ts-expect-error` + 한 줄 사유 + tech-debt-tracker 등록.
- **INV-5 파일 예산.** 소스 파일 400줄, 함수 60줄 초과 금지. 넘으면 쪼갠다.
- **INV-6 shadcn 생성물 불가침.** `src/shared/ui/components/ui/**`는 CLI 생성물이다. 손으로 고치지 말고 래퍼를 만든다. → [docs/DESIGN.md](docs/DESIGN.md)
- **INV-7 비밀정보 커밋 금지.** 토큰·키·개인 연락처는 저장소에 들어가지 않는다. → [docs/SECURITY.md](docs/SECURITY.md)
- **INV-8 공개 번들에 비밀은 없다.** 이 사이트는 전부 공개된다. 자격 증명은 빌드에 들어갈 수 없고, **사용자가 런타임에 입력한 토큰만** 세션에 존재한다. `VITE_*` 환경변수는 번들에 그대로 박히므로 비밀을 담지 않는다.
- **INV-9 문서는 코드와 함께 바뀐다.** 동작을 바꾸면 관련 `docs/` 문서를 같은 변경 안에서 갱신한다. `docs/generated/`는 손으로 고치지 않는다.
- **INV-10 저장소 밖 지식은 없는 것이다.** 대화·머릿속·외부 문서에서 나온 결정은 반드시 `docs/`에 기록한 뒤 진행한다.
- **INV-11 쓰기는 `domains/admin/` 안에서만.** 콘텐츠를 변경하는 GitHub API 호출은 admin 도메인 밖에 존재할 수 없다. **UI를 숨기는 것은 보안이 아니다** — 권한 판정은 GitHub이 한다. → [ADR-0004](docs/design-docs/adr/0004-single-app-admin-mode.md)

---

## 4. 자유 영역 — 여기서는 알아서 판단하라

불변식 바깥은 **의도적으로 열려 있다.** 다음에 대해 허락을 구하지 말고 관례를 따라 결정하라:
내부 함수 이름·파일 분할 방식, 컴포넌트 구성, 유틸 구현, 테스트 케이스 선정,
상태를 로컬에 둘지 스토어에 둘지, 애니메이션/마이크로 인터랙션 디테일.

판단 기준은 하나다: **다음 에이전트가 읽고 검증할 수 있는가.**
사람의 문체 취향과 달라도, 정확하고 유지보수 가능하고 읽기 쉬우면 통과다.

---

## 5. 작업 루프 (모든 작업에서 이 순서)

1. **지도 읽기** — 관련 `docs/` 문서 + 활성 exec-plan 확인
2. **계획** — 3파일 이상 또는 새 도메인을 건드리면 `/exec-plan`으로 계획 문서부터 만든다
3. **구현** — 불변식 준수, 자유 영역은 스스로 결정
4. **검증** — `/verify` (타입·린트·아키텍처·테스트·문서 린트). UI를 바꿨으면 `/ui-verify`
5. **자가 리뷰** — `/self-review` 로 골든 룰 대조
6. **기록** — 문서 갱신, 계획을 `completed/`로 이동, 남은 부채를 tech-debt-tracker에 등록

**막혔을 때**: 더 세게 밀어붙이지 말고 멈춰라. "무엇이 없어서 막혔는가"를 묻고,
빠진 도구·가드레일·문서를 먼저 만든다. 그것이 이 저장소의 진짜 작업이다.

---

## 6. 명령어

```bash
npm run verify        # 전체 검증 (typecheck + lint + arch + test + docs). 커밋 전 필수
npm run dev           # 개발 서버
npm run typecheck     # tsc --noEmit
npm run lint          # eslint + prettier
npm run test          # vitest
npm run lint:arch     # 레이어/쓰기경계/비밀 불변식 검사 (INV-1, 2, 8, 11)
npm run lint:docs     # 문서 링크·신선도 검사 (INV-9)
npm run build         # 프로덕션 빌드 (Pages 배포 산출물)
```

---

## 7. 스킬 — 반복 작업은 직접 하지 말고 스킬을 호출하라

| 스킬 | 언제 |
|---|---|
| `/exec-plan` | 다중 파일·다단계 작업 시작 전 (계획 = 일급 아티팩트) |
| `/verify` | 코드를 바꾼 뒤 항상 |
| `/new-slice` | 새 도메인/기능 슬라이스 추가 시 (레이어 스캐폴드) |
| `/ui-verify` | UI를 바꾼 뒤 (브라우저로 실제 렌더 확인) |
| `/add-ui-component` | shadcn 컴포넌트 도입 시 |
| `/self-review` | PR 전 골든 룰 자가 점검 |
| `/doc-gardening` | 문서 드리프트 정리 (주기적) |

---

## 8. 하지 마라

- `docs/generated/`, `src/shared/ui/components/ui/**` 직접 편집 (INV-6, INV-9)
- 토큰·비밀번호·해시를 코드나 환경변수에 넣기 — **공개 번들에 비밀은 존재할 수 없다** (INV-8)
- 관리자 UI를 숨기는 것으로 보안을 대신하기 (INV-11)
- 검증 실패를 `eslint-disable`·`as any`·테스트 삭제로 우회 (INV-4)
- 큰 문서를 이 파일에 인라인으로 붙여넣기 — `docs/`에 두고 링크만 (프로그레시브 디스클로저)
- 결정 사항을 대화에만 남기고 넘어가기 (INV-10)
- 사용자가 요청하지 않은 커밋·푸시·배포
