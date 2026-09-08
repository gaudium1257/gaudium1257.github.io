import type { LabContent } from '../content';

/**
 * 시안 하나의 계약 (EP-0005).
 *
 * 시안은 `shared/portfolio` 를 **쓰지 않는다.** 공용 컴포넌트를 재사용하면
 * 결국 지금 디자인의 변주만 나와서 비교의 의미가 없다. 각자 자기 마크업으로 그린다.
 */
export interface ConceptProps {
  content: LabContent;
  /** 비교소의 다크 토글 상태. 시안이 이 값을 어떻게 쓸지는 시안이 정한다 */
  dark: boolean;
}

export interface Concept {
  id: string;
  name: string;
  /** 한 줄 성격. 목록에서 고르는 근거가 된다 */
  tagline: string;
  /** 어디서 온 형태인지 — 근거 없는 취향이 아니라는 표시 */
  reference: string;
  render: (props: ConceptProps) => React.ReactNode;
}
