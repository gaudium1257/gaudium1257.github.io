import type { Concept, ConceptProps } from './types';

/**
 * 시안 7 — 스위스 그리드.
 *
 * 국제 타이포그래피 양식. 12단 격자에 모든 것을 정렬하고 빨강 하나만 포인트로 쓴다.
 * 규율이 강해 콘텐츠가 늘어도 무너지지 않는다 — 대신 개성은 절제된다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#111111' : '#ffffff',
    fg: dark ? '#fafafa' : '#111111',
    dim: dark ? '#8a8a8a' : '#767676',
    red: '#e2231a',
    line: dark ? '#2b2b2b' : '#e5e5e5',
  };
}

function GridRow({
  label,
  title,
  meta,
  dim,
  line,
}: {
  label: string;
  title: string;
  meta?: string;
  dim: string;
  line: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 py-4" style={{ borderTop: `1px solid ${line}` }}>
      <div className="col-span-3 text-[11px] tracking-wide uppercase" style={{ color: dim }}>
        {label}
      </div>
      <div className="col-span-9">
        <div className="text-base font-medium">{title}</div>
        {meta ? (
          <div className="mt-0.5 text-xs" style={{ color: dim }}>
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Swiss({ content, dark }: ConceptProps) {
  const { bg, fg, dim, red, line } = palette(dark);

  return (
    <div style={{ background: bg, color: fg }} className="min-h-full px-10 py-10">
      <div className="grid grid-cols-12 gap-4 pb-8" style={{ borderBottom: `2px solid ${fg}` }}>
        <div className="col-span-3 text-sm font-bold tracking-tight">{content.profile.name}</div>
        <div
          className="col-span-9 flex gap-6 text-[11px] tracking-wide uppercase"
          style={{ color: dim }}
        >
          {['Index', 'About', 'Papers', 'Projects', 'Blog'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-16">
        <div className="col-span-3 text-[11px] tracking-wide uppercase" style={{ color: red }}>
          Portfolio
        </div>
        <h1 className="col-span-9 text-4xl leading-tight font-medium tracking-tight break-keep">
          {content.profile.headline}
        </h1>
      </div>

      <section>
        {content.papers.map((p) => (
          <GridRow
            key={p.id}
            label="논문 리뷰"
            title={p.title}
            meta={p.venue}
            dim={dim}
            line={line}
          />
        ))}
        {content.projects.map((p) => (
          <GridRow
            key={p.id}
            label="프로젝트"
            title={p.title}
            meta={p.role}
            dim={dim}
            line={line}
          />
        ))}
        {content.posts.map((p) => (
          <GridRow key={p.id} label="글" title={p.title} meta={p.summary} dim={dim} line={line} />
        ))}
      </section>
    </div>
  );
}

export const swiss: Concept = {
  id: 'swiss',
  name: '스위스 그리드',
  tagline: '12단 격자와 빨강 하나. 규율이 강해 콘텐츠가 늘어도 안 무너진다.',
  reference: '국제 타이포그래피 양식 (Müller-Brockmann 계열)',
  render: (props) => <Swiss {...props} />,
};
