# ADR-0001: 기술 스택과 두 앱 워크스페이스

- **상태**: ACCEPTED
- **날짜**: 2026-09-06
- **관련**: [ARCHITECTURE.md](../../../ARCHITECTURE.md), [ADR-0002](0002-layered-architecture.md)

## 맥락

포트폴리오를 보여주는 공개 사이트(viewer)와, 본인만 쓰는 편집 도구(admin)를 만든다.
호스팅은 GitHub Pages(정적)다. 요구 스택은 React + TypeScript + shadcn.

두 앱은 **같은 콘텐츠 모델**을 다룬다. 이것이 이 결정의 핵심 제약이다.

## 검토한 선택지

| 선택지 | 장점 | 단점 |
|---|---|---|
| 앱 두 개를 독립 저장소로 | 배포 단순 | 스키마 중복 → 드리프트. 에이전트가 한쪽만 보고 고침 |
| 한 앱 안에서 라우트로 분리 | 가장 단순 | 공개 번들에 편집 코드 포함. 읽기 전용 보장 불가 |
| **npm workspaces 모노레포 (채택)** | 스키마 단일 원천, 한 번에 검증, 번들 분리 | 루트 설정이 약간 늘어남 |

## 결정

**npm workspaces 모노레포**: `viewer`, `admin`, `shared/*`.

- 빌드 **Vite** · 언어 **TypeScript strict** · UI **Tailwind + shadcn/ui** · 검증 **Zod**
- 라우팅 **React Router** · 테스트 **Vitest + Testing Library**
- 아키텍처 강제 **ESLint(flat config) + 자체 린터(`tools/lint/`)**

패키지 매니저는 **npm**: 개발 환경에 이미 있고, GitHub Actions 기본 지원이며,
워크스페이스만 있으면 충분해 pnpm 의 이점이 크지 않다 (CB-7).

**상태 관리 라이브러리는 처음부터 넣지 않는다.** 필요해지면 그때 ADR 을 쓴다.
검색·테마는 프로바이더와 URL 로 충분하다 ([ADR-0004](0004-navigation-shell.md)).

## 결과

- 좋아지는 것: 콘텐츠 스키마를 한 곳에서 고치면 두 앱이 같이 검증된다.
  `npm run verify` 하나로 전부 검사된다. 공개 번들에 편집 코드가 섞이지 않는다
- 나빠지는 것: 워크스페이스 간 순환 참조 위험 → `lint:arch`로 차단한다
- shadcn 은 라이브러리가 아니라 **코드 생성기**다. 생성물은 손대지 않는다 (INV-6)

## 되돌리는 조건

admin 이 정적 호스팅으로 감당 불가능한 요구(서버 인증 등)를 하게 되면,
admin 만 별도 런타임으로 분리하는 ADR 을 새로 쓴다.
