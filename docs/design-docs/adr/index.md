# 아키텍처 결정 기록 (ADR)

하나의 결정 = 하나의 파일. 번호는 재사용하지 않는다.
결정을 뒤집을 때는 파일을 지우지 말고 `SUPERSEDED`로 표시하고 새 ADR을 만든다.

| # | 제목 | 상태 |
|---|---|---|
| [0001](0001-stack.md) | 기술 스택과 워크스페이스 구성 | SUPERSEDED by 0004 (스택 부분은 유효) |
| [0002](0002-layered-architecture.md) | 도메인 슬라이스 + 6레이어 아키텍처 | ACCEPTED |
| [0003](0003-content-store.md) | 포트폴리오 콘텐츠 저장 방식 | ACCEPTED |
| [0004](0004-single-app-admin-mode.md) | 단일 앱 + 인증 게이트 관리자 모드 | ACCEPTED |

상태값: `OPEN`(미결정) · `ACCEPTED` · `SUPERSEDED by NNNN` · `REJECTED`

## 새 ADR 쓰는 법

`0000-template.md`를 복사해 다음 번호로 저장하고, 위 표에 한 줄 추가한다.
색인에 없는 ADR은 `npm run lint:docs`가 잡는다.
