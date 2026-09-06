# EP-0001: 두 앱 스캐폴드 + 내비게이션 셸

- **상태**: DONE
- **시작**: 2026-09-06
- **관련**: [ADR-0001](../../design-docs/adr/0001-stack.md), [ADR-0002](../../design-docs/adr/0002-layered-architecture.md), [ADR-0003](../../design-docs/adr/0003-content-store.md), [ADR-0004](../../design-docs/adr/0004-navigation-shell.md), [navigation-shell.md](../../product-specs/navigation-shell.md)

## 목표

**viewer 가 5개 페이지와 동작하는 상단 배너(검색·테마)를 갖추고,
admin 이 로컬에서 같은 스키마로 콘텐츠를 편집·저장하는 것**까지 완주한다.

모든 스펙이 AGREED 다. 막는 결정이 없다.

## 완료 조건 (Acceptance)

- [x] `npm install` 성공, `npm run dev:viewer` / `dev:admin` 이 각각 뜬다
- [x] `npm run verify` 전 단계 통과
- [x] `lint:arch` 가 **의도적 위반을 실제로 잡는지** 확인 — 레이어 역방향, 도메인 간 import,
      **`shared/content` 밖 스키마 정의(INV-9)**, viewer 쓰기 경로(INV-8) 각각 (가짜 통과 방지)
- [x] 배너 5개 탭이 동작하고 **현재 탭이 표시**된다 (N-1~N-5)
- [x] **검색이 동작한다** — 결과 이동, `?q=` URL 반영, 결과 없음 안내, Esc (S-1~S-6)
- [x] **테마 토글이 동작한다** — 시스템 기본값, 유지, 양쪽 대비 (T-1~T-5)
- [x] Home 이 네 섹션을 각 3개씩 요약해서 보여준다 (H-1~H-6)
- [x] About 이 4개 분류(학력·경력·기술·수상)로 표시된다 (A-1~A-4)
- [x] Paper Review / Project / Blog 목록·상세가 동작한다
- [x] **admin 에서 항목을 저장하면 `content/` 파일이 실제로 바뀌고, viewer 에 반영된다**
- [x] 키보드만으로 배너 전체를 조작할 수 있다 (N-5, GR-7)
- [x] `ARCHITECTURE.md` 도메인 표와 `QUALITY_SCORE.md` 를 실제 값으로 채운다 (INV-10)

## 범위 밖

- 실제 포트폴리오 콘텐츠 작성 (샘플 몇 건으로 충분)
- 배포 (별도 계획)
- 이미지 업로드
- 다국어 (만들지 않기로 결정)

## 단계

- [x] 1. 루트 `package.json` 워크스페이스 + 공용 설정(tsconfig/eslint), `npm install`
- [x] 2. `shared/content` — 스키마 5종 + 샘플 `content/` JSON
- [x] 3. `shared/ui` — Tailwind + shadcn 초기화 (`npm run ui:add`)
- [x] 4. `viewer` 앱 셸 — 라우터 + 배너 레이아웃 + 테마 토큰
- [x] 5. 테마 프로바이더 (다크 모드가 토큰만으로 동작하는지 확인)
- [x] 6. 검색 인덱스(빌드 타임 생성) + 검색 UI (`?q=` URL)
- [x] 7. 5개 페이지 — Home / About / Paper Review / Project / Blog
- [x] 8. `admin` 앱 — 목록 + 폼 + 개발 서버 쓰기 미들웨어
- [x] 9. 테스트 — 스키마, 검색, 테마 프로바이더, 선택 로직
- [x] 10. `/ui-verify` — 배너 도구 실물 검증 (양쪽 테마 · 모바일 · 키보드)
- [x] 11. 문서 갱신 후 `completed/` 로 이동

## 미해결 질문

_(없음 — 모든 스펙이 AGREED)_

## 결정 로그

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-09-06 | viewer/admin 두 앱 + `shared/` 모노레포 | 공개 번들에 편집 코드를 섞지 않고, 스키마는 한 곳에 둔다 (CB-10) |
| 2026-09-06 | 애플리케이션보다 하네스를 먼저 만든다 | 환경이 먼저 갖춰져야 에이전트가 속도를 낸다 (CB-6) |
| 2026-09-06 | **admin 은 로컬 전용** (사용자 결정) | 자격 증명이 아예 필요 없어져 보안 설계가 단순해진다 ([ADR-0003](../../design-docs/adr/0003-content-store.md)) |
| 2026-09-06 | **다국어를 만들지 않는다** (사용자 결정) | 요구에서 제외. 스키마에 언어별 필드를 두지 않는다 ([ADR-0004](../../design-docs/adr/0004-navigation-shell.md)) |
| 2026-09-06 | Home 은 각 섹션 3개, About 은 4개 분류 (기본안) | 사용자가 기본안 채택 |
| 2026-09-06 | 상태 관리 라이브러리를 처음부터 넣지 않는다 | URL + 프로바이더로 충분하다 (CB-7) |
| 2026-09-06 | INV-9 에 `data/` 레이어 예외를 둔다 | admin 의 HTTP 응답 파싱까지 막으니 오히려 `as` 캐스팅을 유도했다. 금지 대상은 *콘텐츠 모델* 이지 *전송 형태* 가 아니다 |
| 2026-09-06 | 각 앱 styles.css 에 `@source '../../../shared/ui'` 를 넣는다 | Tailwind v4 가 vite root 밖의 공유 UI 를 스캔하지 않아 레이아웃이 조용히 깨졌다 (콘솔 에러 없음) |
| 2026-09-06 | viewer vite 에 content/ 감시 플러그인을 넣는다 | root 밖이라 감시되지 않아 admin 저장이 미리보기에 반영되지 않았다 (스펙 E-7 위반) |

## 잔여 작업

→ [tech-debt-tracker](../tech-debt-tracker.md) TD-007 (미들웨어 테스트), TD-008 (E2E),
TD-009 (배포 워크플로), TD-010 (실제 콘텐츠)
