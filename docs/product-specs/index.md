# 제품 스펙 색인

**요구사항의 진실 원천.** 스펙에 없는 기능은 만들지 않는다 (INV-11).
판단 기준은 → [docs/PRODUCT_SENSE.md](../PRODUCT_SENSE.md)

| 스펙 | 대상 | 상태 |
|---|---|---|
| [navigation-shell.md](navigation-shell.md) | 상단 배너 · 검색 · 테마 | AGREED |
| [viewer-site.md](viewer-site.md) | 공개 사이트의 5개 페이지 | AGREED |
| [content-model.md](content-model.md) | 콘텐츠 데이터 모델 | AGREED |
| [admin-editor.md](admin-editor.md) | 편집 도구 (로컬 전용) | AGREED |

상태값: `DRAFT` · `AGREED` · `SHIPPED` · `DROPPED`

## 확정된 결정 (2026-09-06)

- **admin 은 로컬 전용** — 자격 증명 없음 ([ADR-0003](../design-docs/adr/0003-content-store.md))
- **다국어는 만들지 않음** — Language 버튼 제거 ([ADR-0004](../design-docs/adr/0004-navigation-shell.md))
- Home 은 각 섹션 3개씩 노출
- About 스펙 분류: 학력 · 경력/활동 · 기술 · 수상/자격

## 규칙

- 스펙은 **관찰 가능한 동작**으로 쓴다. 구현 방법을 적지 않는다
- 구현 중 스펙과 다르게 만들어야 한다면, 코드를 먼저 바꾸지 말고 **스펙을 먼저 고친다**
