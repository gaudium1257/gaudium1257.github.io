# 제품 스펙 색인

**요구사항의 진실 원천.** 스펙에 없는 기능은 만들지 않는다 (INV-10).
판단 기준은 → [docs/PRODUCT_SENSE.md](../PRODUCT_SENSE.md)

앱은 하나이고 모드가 둘이다 → [ADR-0004](../design-docs/adr/0004-single-app-admin-mode.md)

| 스펙 | 대상 | 상태 |
|---|---|---|
| [public-site.md](public-site.md) | 공개 모드 — 포트폴리오 열람 | DRAFT — 사용자 입력 필요 |
| [admin-mode.md](admin-mode.md) | 관리자 모드 — 인증 + 편집 | DRAFT — 사용자 입력 필요 |
| [content-model.md](content-model.md) | 콘텐츠 데이터 모델 | DRAFT — 사용자 입력 필요 |

상태값: `DRAFT` · `AGREED` · `SHIPPED` · `DROPPED`

## 규칙

- 스펙은 **관찰 가능한 동작**으로 쓴다. 구현 방법을 적지 않는다
- 구현 중 스펙과 다르게 만들어야 한다면, 코드를 먼저 바꾸지 말고 **스펙을 먼저 고친다**
- `DRAFT` 상태의 스펙을 근거로 큰 구현을 시작하지 않는다. 먼저 사용자에게 확인한다
