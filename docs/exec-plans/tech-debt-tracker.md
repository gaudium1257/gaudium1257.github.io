# 기술 부채 트래커

부채는 고금리 대출이다. 한꺼번에 갚지 말고 **매일 조금씩** 갚는다 (CB-8).

## 등록 규칙

- 불변식을 우회했다면(`@ts-expect-error`, 임시 구현 등) **반드시 여기에 등록**한다
- 실행 계획을 완료 처리할 때 잔여 작업을 여기로 옮긴다
- 항목마다 **어디에** 있는지 파일 경로를 남긴다. 경로 없는 항목은 찾을 수 없다

## 우선순위 기준

| 등급 | 의미 |
|---|---|
| P0 | 사용자에게 보이는 문제거나 불변식을 깨고 있음. 다음 작업에서 처리 |
| P1 | 확산 중인 나쁜 패턴. 2주 내 처리 |
| P2 | 알고 있으면 되는 것. 근처를 건드릴 때 함께 처리 |

## 현재 항목

| ID | 등급 | 내용 | 위치 | 등록일 |
|---|---|---|---|---|
| TD-005 | P0 | **커밋 성공 경로가 미검증이다.** 실패(401)만 실물 확인됨. 실제 토큰이 필요해 사용자만 검증 가능 | [github.ts](../../src/domains/admin/data/github.ts) | 2026-09-06 |
| TD-003 | P1 | 제품 스펙 3건이 DRAFT. 스키마 필드가 확정 아님 | [product-specs](../product-specs/index.md) | 2026-09-06 |
| TD-006 | P1 | E2E 테스트 없음. TESTING.md 는 Playwright 로 핵심 여정을 덮으라고 한다 | [TESTING.md](../TESTING.md) | 2026-09-06 |
| TD-007 | P2 | 편집기가 JSON 직접 편집이다. 필드별 폼이 더 안전하고 빠름 (스펙 A-5) | [ContentEditor.tsx](../../src/domains/admin/ui/ContentEditor.tsx) | 2026-09-06 |
| TD-008 | P2 | shadcn CLI 가 utils 별칭을 잘못 해석해 `from "cn"` 을 생성한다. `npm run ui:add` 가 교정하지만 CLI 가 고쳐지면 제거할 것 | [fix-shadcn-imports.mjs](../../tools/scripts/fix-shadcn-imports.mjs) | 2026-09-06 |

| TD-010 | P2 | 이미지·첨부 업로드 미구현. 스펙 A-5 의 이미지 요구가 열려 있음 | [admin-mode.md](../product-specs/admin-mode.md) | 2026-09-06 |

해결한 항목은 지우지 말고 아래로 옮긴다.

## 해결됨

| ID | 내용 | 해결일 | 해결한 변경 |
|---|---|---|---|
| TD-001 | 관리자 자격 증명 방식 미확정 | 2026-09-06 | 파인그레인드 PAT + sessionStorage 로 확정 ([ADR-0004](../design-docs/adr/0004-single-app-admin-mode.md)) |
| TD-002 | 애플리케이션 스캐폴드 부재 | 2026-09-06 | [EP-0001](active/0001-bootstrap-scaffold.md) 단계 1~10 완료 |
| TD-004 | 마크다운 새니타이즈 라이브러리 미선정 | 2026-09-06 | react-markdown 채택 (raw HTML 을 렌더하지 않음) |
| TD-009 | 미사용 shadcn 컴포넌트가 sonner·next-themes 를 끌고 들어옴 | 2026-09-06 | 자가 리뷰에서 발견. Dialog·Toaster 삭제 + 의존성 2개 제거 (GR-9) |
