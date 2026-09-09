import type { ReactNode } from 'react';

/**
 * 상세 페이지의 공통 뼈대 (EP-0006).
 *
 * 세 상세 페이지(논문·프로젝트·글)가 제각각이면 같은 사이트로 안 읽힌다.
 * 머리 부분의 순서를 여기서 고정한다: 작은 라벨 → 제목 → 메타 → 굵은 괘선.
 *
 * 본문 폭은 좌측 목차 때문에 이미 좁다. 여기서 또 줄이지 않는다.
 */
export function DetailHeader({
  eyebrow,
  title,
  meta,
  aside,
}: {
  eyebrow: string;
  title: string;
  /** 저자·학회·기간처럼 제목 바로 아래 붙는 한 줄 */
  meta?: string;
  /** 원문 링크 등 오른쪽에 서는 것 */
  aside?: ReactNode;
}) {
  return (
    <header className="pb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl leading-snug font-semibold tracking-tight break-keep">
        {title}
      </h1>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b-2 border-foreground pb-3">
        {meta ? <p className="text-sm text-muted-foreground">{meta}</p> : <span />}
        {aside}
      </div>
    </header>
  );
}

/**
 * 상세 페이지 안의 소제목. 목록 페이지의 SectionHeading 과 같은 괘선 어휘를 쓴다 —
 * 페이지를 옮겨다녀도 같은 리듬이어야 한 사이트로 읽힌다.
 */
export function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <div className="flex items-baseline gap-4">
        <h2 className="shrink-0 text-sm font-semibold tracking-tight">{title}</h2>
        <span aria-hidden="true" className="rule-trail h-px flex-1" />
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
