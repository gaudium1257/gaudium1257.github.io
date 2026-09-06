# ADR-0001: 기술 스택과 워크스페이스 구성

- **상태**: **SUPERSEDED by [ADR-0004](0004-single-app-admin-mode.md)** (2026-09-06)
- **날짜**: 2026-09-06
- **관련**: [ARCHITECTURE.md](../../../ARCHITECTURE.md)

> **이 결정의 절반은 폐기되었다.**
> 워크스페이스 분리(viewer/admin 별도 앱)는 [ADR-0004](0004-single-app-admin-mode.md) 로 대체됐다.
> **기술 스택 선택은 그대로 유효하다** — 아래 '결정' 절의 스택 부분만 읽어라.

## 맥락 (당시)

포트폴리오를 보여주는 공개 사이트와 편집 도구를 만든다. 호스팅은 GitHub Pages(정적)다.
요구 스택은 React + TypeScript + shadcn.

## 결정

### 여전히 유효한 것 — 기술 스택

빌드는 **Vite**, 언어는 **TypeScript strict**, UI 는 **Tailwind v4 + shadcn/ui**,
경계 검증은 **Zod**, 테스트는 **Vitest + Testing Library**, 라우팅은 **React Router**,
마크다운 렌더는 **react-markdown**(raw HTML 을 렌더하지 않아 XSS 경로가 닫힌다).
아키텍처 강제는 **ESLint(flat config) + 자체 린터(`tools/lint/`)**.

> **TanStack Query 는 도입하지 않는다** (2026-09-06, EP-0001 결정 로그).
> 콘텐츠는 빌드타임 상수라 캐싱할 서버 상태가 없고, 관리자 호출은 일회성 명령 3개뿐이다.
> 캐싱·무효화의 이득이 없어 의존성만 늘린다 (CB-7).
>
> **Playwright(E2E)는 아직 도입하지 않았다** — TD-006 으로 등록되어 있다.

패키지 매니저는 **npm**. 개발 환경에 이미 있고 GitHub Actions 기본 지원이다.

shadcn 은 라이브러리가 아니라 **코드 생성기**다. 생성물은 손대지 않는다 (INV-6).

### 폐기된 것 — 워크스페이스 분리

~~npm workspaces 모노레포: `viewer`, `admin`, `shared/*`~~

**폐기 이유**: 관리 기능을 별도 앱이 아니라 **공개 사이트 안의 인증된 모드**로 제공하기로 했다.
앱이 하나이므로 워크스페이스가 필요 없고, 오히려 스키마·라우팅·컴포넌트를 갈라놓는 비용만 남는다.
→ [ADR-0004](0004-single-app-admin-mode.md)

## 결과

스택 결정은 ADR-0004 아래에서 그대로 이어진다. 구조만 단일 앱으로 바뀐다.
