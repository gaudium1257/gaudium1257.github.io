# 설계 문서 색인

시스템이 **왜** 지금 모습인지를 담는다. "어떻게 쓰는가"는 `docs/`의 다른 문서에 있다.

| 문서 | 내용 |
|---|---|
| [core-beliefs.md](core-beliefs.md) | 이 저장소의 운영 원칙. 다른 모든 규칙의 상위 근거 |
| [golden-rules.md](golden-rules.md) | 코드를 쓸 때의 취향 불변식. 자가 리뷰·정리 작업의 기준 |
| [adr/index.md](adr/index.md) | 개별 기술 결정 기록 (ADR) |

## 새 설계 문서를 추가할 때

1. 이 색인에 한 줄 추가 (누락 시 `npm run lint:docs` 실패)
2. 결정이면 ADR로, 지속되는 원칙이면 이 폴더의 문서로
3. 결정을 뒤집을 때는 기존 문서를 지우지 말고 `상태: SUPERSEDED by ...`로 표시
