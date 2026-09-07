# 스펙: 콘텐츠 데이터 모델

- **상태**: AGREED (기본안 채택, 2026-09-06)
- **관련**: [ADR-0003](../design-docs/adr/0003-content-store.md), [viewer-site.md](viewer-site.md)

스키마는 **viewer(읽기)와 admin(쓰기)이 모두 통과하는 단일 진실 원천**이다 (INV-9).
`shared/content/` 에만 존재한다.

> **다국어 필드는 두지 않는다** (사용자 결정). 모든 텍스트는 단일 언어다.
> 나중에 영문이 필요해지면 **스키마 마이그레이션이 필요하다** — [ADR-0004](../design-docs/adr/0004-navigation-shell.md) 참고.

## 엔티티

| 엔티티 | 대응 페이지 | 필드 |
|---|---|---|
| `Profile` | About / Home | 이름, 한 줄 소개, 소개 본문, 연락 수단 |
| `SpecItem` | About | 분류, 제목, 기관, 기간, 설명 |
| `PaperReview` | Paper Review | id, 논문 제목, 저자, 발표 연도, 학회/저널, 원문 링크, 읽은 날짜, 요약, **본인 정리**, 태그 |
| `Project` | Project | id, 제목, 기간, 역할, 요약, 본문, 기술 스택, 링크, 결과 |
| `BlogPost` | Blog | id, 제목, 작성일, 요약, 본문, 태그 |

### SpecItem 분류

`education`(학력 / 학적) · `experience`(경력 · 활동) · `skill`(기술) ·
`award`(수상) · `certificate`(자격증)

> 2026-09-07: 수상과 자격증을 분리하고 학력을 '학력 / 학적' 으로 바꿨다 (사용자 요청).
> 분류를 추가할 때는 **스키마 · 표시 목록 · 폼 선택지 세 곳**을 함께 고쳐야 한다 —
> 빠뜨리면 저장은 되는데 화면에 안 나온다. sections.test.ts 와 forms.test.ts 가 잡는다.

## 저장 형태

`content/` 에 JSON 으로 둔다 ([ADR-0003](../design-docs/adr/0003-content-store.md)).
긴 본문은 JSON 안의 마크다운 문자열로 둔다 — 파서를 하나로 유지하기 위해서다.

```
content/
├── profile.json
├── specs/<id>.json
├── papers/<id>.json
├── projects/<id>.json
└── posts/<id>.json
```

## 공통 규칙

- 모든 항목은 안정적인 `id` 를 가진다 (URL·정렬에 쓰인다). **한 번 정하면 바꾸지 않는다**
- 시간 필드는 ISO 8601 문자열. 표시 형식은 `ui` 레이어가 정한다
- 공개 여부 필드로 노출을 제어한다
  ⚠️ 숨김은 화면에서만이다. 콘텐츠 파일이 공개 저장소에 있으면 **파일 자체는 보인다**
  ([SECURITY.md](../SECURITY.md))
- 정렬 순서는 데이터에 명시한다. 배열 순서에 의존하지 않는다
- 링크는 `http(s)` 만 허용한다 (`javascript:` 스킴 차단)
- 검색 인덱스는 이 스키마에서 **자동 생성**한다. 별도로 관리하지 않는다 (ADR-0004)
- 마크다운 본문은 **원시 HTML 을 렌더하지 않는 렌더러**로 표시한다 ([SECURITY.md](../SECURITY.md))

## 확장 규칙

필드를 추가할 때는 **지금 필요한 것만** 넣는다. 추측 기반 확장성 금지 (PRODUCT_SENSE).
스키마를 바꾸면 기존 `content/` 파일이 검증에 걸릴 수 있다 — 함께 갱신한다.
