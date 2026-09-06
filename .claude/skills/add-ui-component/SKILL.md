---
name: add-ui-component
description: shadcn/ui 컴포넌트를 올바르게 도입하고 커스터마이즈한다. 버튼·다이얼로그·폼·테이블 등 UI 프리미티브가 필요할 때, shadcn 컴포넌트를 고치고 싶을 때, 디자인 토큰/테마를 바꿀 때 사용한다.
---

# shadcn 컴포넌트 도입

규범 원문 → [docs/DESIGN.md](../../../docs/DESIGN.md)

**shadcn은 라이브러리가 아니라 코드 생성기다.** 생성물은 우리 코드지만, 손으로 고치지 않는다 (INV-6).

## 새 컴포넌트가 필요할 때

1. **이미 있는지 먼저 확인** — `src/shared/ui/`를 훑는다. 비슷한 게 있으면 그걸 쓴다 (GR-1)
2. CLI로 추가한다:
   ```bash
   npx shadcn@latest add <component>
   ```
   생성 위치는 `src/shared/ui/components/ui/`다. **직접 파일을 만들어 붙여넣지 않는다**
3. `src/shared/ui`의 배럴(`index.ts`)에 export를 추가한다
4. 앱에서는 `src/shared/ui`를 통해서만 import 한다. `components/ui/`를 직접 가리키지 않는다

## 커스터마이즈가 필요할 때 — 이 순서로

| 원하는 것 | 방법 |
|---|---|
| 색·간격·라운드·폰트 | **Tailwind 테마 토큰**을 고친다. 컴포넌트를 건드리지 않는다 |
| variant 추가 | 생성물의 `cva` 정의 대신, `src/shared/ui`에 **래퍼**를 만든다 |
| 동작 변경·조합 | `src/shared/ui`에 래퍼 컴포넌트를 만든다 (예: `ConfirmDialog`가 `Dialog`를 감쌈) |
| 그래도 불가능 | ADR을 쓰고 생성물을 fork 한다. **마지막 수단** |

훅이 `**/components/ui/**` 편집을 차단한다. 차단당했다면 위 표를 다시 보라 — 대부분 래퍼가 답이다.

## 스타일 규칙 (DESIGN.md)

- 하드코딩된 hex 색, 매직 `px` 금지. 토큰으로 표현한다
- 다크 모드는 토큰 레벨에서 해결한다. 컴포넌트에 `isDark` 분기를 넣지 않는다
- `className` 조합은 `cn()` 유틸을 쓴다 (직접 문자열 결합 금지)

## 추가 후

1. 실제로 쓰는 화면에서 렌더된다 — `/ui-verify`로 확인 (공개 모드·관리자 모드 양쪽)
2. 접근성: 키보드 조작과 포커스 링이 살아 있는지 확인 (GR-7)
3. 컴포넌트가 3개 이상의 도메인에서 쓰이면 `src/shared/ui`의 공개 표면 문서를 갱신한다
