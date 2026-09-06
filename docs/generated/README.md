# docs/generated/ — 자동 생성 문서

**이 폴더의 파일을 손으로 편집하지 마라 (INV-9).** 훅이 편집을 차단한다.

여기 있는 문서는 코드에서 생성된다. 내용이 틀렸다면 **생성기나 소스 코드를 고쳐라.**

## 생성물 목록

| 파일 | 생성 명령 | 소스 |
|---|---|---|
| _(아직 없음)_ | | |

## 생성기를 추가할 때

1. `tools/scripts/`에 생성 스크립트를 만든다
2. 루트 `package.json`의 `docs:generate`에 연결한다
3. 이 표에 한 줄 추가한다
4. 생성물 파일 첫 줄에 다음 주석을 넣는다:
   `<!-- GENERATED FILE — do not edit. Run: npm run docs:generate -->`

## 후보

- 콘텐츠 스키마 → 필드 표 (`shared/content`의 Zod 스키마에서)
- 도메인/레이어 의존성 그래프 (dependency-cruiser에서)
- 라우트 목록
