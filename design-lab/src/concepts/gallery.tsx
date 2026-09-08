import type { Concept, ConceptProps } from './types';

/**
 * 시안 12 — 미니멀 화이트.
 *
 * 여백이 절대적이다. 요소를 극단적으로 줄이고 큰 활자 하나로 승부한다.
 * 콘텐츠가 훌륭할 때 가장 강하고, 빈약할 때 가장 잔인하다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#0a0a0a' : '#ffffff',
    fg: dark ? '#f5f5f5' : '#0a0a0a',
    dim: dark ? '#7d7d7d' : '#9a9a9a',
    line: dark ? '#1f1f1f' : '#f0f0f0',
  };
}

function Line({
  n,
  title,
  meta,
  dim,
  line,
}: {
  n: number;
  title: string;
  meta?: string;
  dim: string;
  line: string;
}) {
  return (
    <div
      className="flex items-baseline justify-between gap-6 py-8"
      style={{ borderTop: `1px solid ${line}` }}
    >
      <div className="flex items-baseline gap-8">
        <span className="text-xs tabular-nums" style={{ color: dim }}>
          {String(n).padStart(3, '0')}
        </span>
        <span className="text-2xl font-light tracking-tight break-keep">{title}</span>
      </div>
      {meta ? (
        <span className="shrink-0 text-xs" style={{ color: dim }}>
          {meta}
        </span>
      ) : null}
    </div>
  );
}

function Gallery({ content, dark }: ConceptProps) {
  const { bg, fg, dim, line } = palette(dark);
  const items = [
    ...content.projects.map((p) => ({ id: p.id, title: p.title, meta: p.role })),
    ...content.papers.map((p) => ({ id: p.id, title: p.title, meta: p.venue })),
    ...content.posts.map((p) => ({ id: p.id, title: p.title, meta: p.publishedOn })),
  ];

  return (
    <div style={{ background: bg, color: fg }} className="min-h-full px-12 py-10">
      <header className="flex items-center justify-between">
        <span className="text-xs tracking-[0.2em] uppercase">{content.profile.name}</span>
        <nav className="flex gap-8 text-xs" style={{ color: dim }}>
          {['Work', 'About', 'Contact'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </nav>
      </header>

      <h1 className="max-w-3xl py-32 text-5xl leading-[1.1] font-light tracking-tight break-keep">
        {content.profile.headline}
      </h1>

      <section>
        {items.map((it, i) => (
          <Line key={it.id} n={i + 1} title={it.title} meta={it.meta} dim={dim} line={line} />
        ))}
        <div style={{ borderTop: `1px solid ${line}` }} />
      </section>

      <footer className="pt-16 text-xs" style={{ color: dim }}>
        {content.profile.links.map((l) => l.label).join(' · ')}
      </footer>
    </div>
  );
}

export const gallery: Concept = {
  id: 'gallery',
  name: '미니멀 화이트',
  tagline: '여백이 절대적. 콘텐츠가 좋을 때 강하고 빈약할 때 잔인하다.',
  reference: '갤러리·건축 스튜디오 계열 미니멀',
  render: (props) => <Gallery {...props} />,
};
