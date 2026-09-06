// 확장자를 명시한다: admin 의 vite.config 가 Node ESM 으로 이 모듈을 직접 불러오기 때문이다
// (Node 는 확장자 없는 './schema' 를 해석하지 못한다).
export * from './schema.ts';
