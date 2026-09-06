# ARCHITECTURE.md

시스템의 최상위 지도. **무엇이 무엇에 의존해도 되는가**를 정의한다.
여기 적힌 규칙은 `npm run lint:arch`로 기계적으로 강제된다 (INV-1, INV-2, INV-8, INV-11).

---

## 1. 레이아웃

리포지터리 전체가 하나의 앱이고, 그 빌드 결과가 곧 공개 사이트다.

```
gaudium1257.github.io/
├── src/
│   ├── app/                    # 진입점, 라우터, 프로바이더 조립
│   ├── domains/
│   │   ├── portfolio/          # 공개 열람 (프로젝트·경력·글 표시)
│   │   └── admin/              # 관리자 모드: 인증 게이트 + 편집 + 커밋
│   └── shared/
│       ├── content/            # 콘텐츠 타입 + Zod 스키마 (단일 진실 원천)
│       ├── ui/                 # shadcn 프리미티브 + 공용 컴포넌트
│       ├── providers/          # 세션·라우팅·테마·저장소 어댑터
│       └── lib/                # 공용 유틸
├── content/                    # 포트폴리오 데이터 (JSON) — 커밋되고 배포된다
│   └── assets/                 # 이미지·첨부
├── public/                     # 정적 파일
├── docs/                       # 기록 시스템 (system of record)
├── tools/                      # 커스텀 린터, 스크립트
└── .claude/                    # 하네스: 스킬 + 훅
```

**스키마와 데이터를 분리한다.**
`src/shared/content/`는 **스키마**(타입 + Zod), `content/`는 **데이터**(JSON).
읽기와 쓰기 양쪽이 같은 스키마를 통과한다. → [ADR-0003](docs/design-docs/adr/0003-content-store.md)

---

## 2. 레이어 (INV-1)

각 도메인 슬라이스는 아래 6개 레이어로 나뉜다. 의존성은 **한 방향으로만** 흐른다.

```
types → config → data → service → state → ui
                    ▲
                    │  (횡단 관심사는 여기로만 진입)
                 providers
```

| 레이어 | 폴더 | 하는 일 | 하면 안 되는 일 |
|---|---|---|---|
| `types` | `types/` | 도메인 타입, Zod 스키마 | 무엇도 import 하지 않음 (외부 라이브러리 제외) |
| `config` | `config/` | 상수, 기본값, 기능 플래그 값 | 로직·I/O |
| `data` | `data/` | 저장소 접근(콘텐츠 로드, GitHub API), **경계 파싱** | React, 비즈니스 규칙 |
| `service` | `service/` | 비즈니스 규칙, 순수 변환 | React, 직접 I/O |
| `state` | `state/` | 훅, 쿼리, 스토어 — 런타임 상태 | JSX 렌더링 |
| `ui` | `ui/` | 컴포넌트, 화면 | fetch, 스키마 파싱 |
| `providers` | `src/shared/providers/` | 세션·라우팅·테마·쿼리 클라이언트 | 도메인 지식 |

**허용된 엣지는 이게 전부다.** 나머지는 전부 위반이다:

- 같은 레이어 내부 import: 허용
- 아래 레이어 import: 허용 (예: `ui → state`, `service → types`)
- 위 레이어 import: **금지**
- 다른 도메인 import: **금지** (INV-2) — 필요하면 `src/shared/`로 승격
- `src/shared/` import: 모든 레이어에서 허용 (단 `shared/ui`는 `ui` 레이어에서만)
- `app/`은 모든 것을 조립할 수 있다. 반대로 누구도 `app/`을 import 하지 않는다
  — 유일한 예외는 엔트리 포인트 `src/main.tsx` 다 (앱을 부트스트랩해야 하므로)

### 왜 이렇게까지 하는가

보통 이런 아키텍처는 엔지니어가 수백 명 될 때까지 미룬다.
에이전트에게는 **선행 조건**이다. 제약이 있어야 드리프트 없이 속도를 낼 수 있다.
경계는 중앙에서 고정하고, 그 안의 구현은 자유롭게 둔다.

---

## 3. 두 모드와 쓰기 경계 (INV-11)

```
                 ┌──────────────── 하나의 앱 ────────────────┐
                 │                                          │
  방문자 ───────▶│  domains/portfolio/   (읽기 전용)         │
                 │        ▲                                 │
                 │        │ 빌드 타임 import + Zod 파싱      │
                 │   content/*.json  ◀──────┐               │
                 │                          │ 커밋           │
  본인 ─────────▶│  domains/admin/ ─────────┘               │
   (GitHub 토큰) │   ① 토큰으로 권한 확인 → GitHub 이 판정   │
                 │   ② 편집 → 스키마 검증 → Contents API     │
                 └──────────────────────────────────────────┘
                                    │
                        커밋 → Actions 빌드 → Pages 배포(~1분)
```

**쓰기 경로는 `domains/admin/` 안에만 존재한다.** 다른 어떤 도메인도 콘텐츠를 변경하는
GitHub API 를 호출할 수 없다 (`lint:arch`가 강제).

**관리자 UI 가 번들에 있다는 사실은 비밀이 아니다.** 숨기는 것에 의존하지 않는다.
실제 권한은 GitHub 이 토큰으로 판정하고, 토큰은 빌드에 존재하지 않는다 (INV-8).
근거와 위협 모델 → [ADR-0004](docs/design-docs/adr/0004-single-app-admin-mode.md), [docs/SECURITY.md](docs/SECURITY.md)

---

## 4. 새 코드를 어디에 놓을지 판단하는 법

1. 콘텐츠를 **변경**하는 코드인가? → `src/domains/admin/` (INV-11). 예외 없다
2. 특정 도메인에만 쓰이나? → `src/domains/<domain>/<layer>/`
3. 두 모드가 모두 쓰나? → `src/shared/`
4. 포트폴리오 개념 자체인가 (프로젝트, 경력, 태그...)? → `src/shared/content/`
5. 화면에 보이는 순수 프리미티브인가? → `src/shared/ui/`
6. 위 어디에도 안 맞나? → 새 도메인을 만들 시점이다. `/new-slice` 사용

---

## 5. 도메인 목록

| 도메인 | 책임 | 품질 등급 |
|---|---|---|
| `portfolio` | 콘텐츠 열람 — 빌드타임 로드·파싱·표시 | B |
| `admin` | 인증 게이트 + 편집 + 커밋 (**보안 경계**) | B |

도메인을 추가하면 **이 표와 [docs/QUALITY_SCORE.md](docs/QUALITY_SCORE.md)를 함께 갱신한다** (INV-9).
