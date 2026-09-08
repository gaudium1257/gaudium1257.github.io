import type { Concept, ConceptProps } from './types';

/**
 * 시안 3 — 브루탈리즘.
 *
 * 굵은 검정 테두리, 거대한 활자, 그림자 없는 원색 블록.
 * 기억에 남지만 조용하지 않다 — 보수적인 심사 환경에서는 위험할 수 있다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#161616' : '#f4f1e8',
    fg: dark ? '#f4f1e8' : '#161616',
    accent: '#ff4d2e',
    accent2: '#2e5bff',
  };
}

function Block({ label, value, fg, bg }: { label: string; value: string; fg: string; bg: string }) {
  return (
    <div style={{ border: `3px solid ${fg}`, background: bg }} className="p-4">
      <div className="text-[10px] font-black tracking-[0.2em] uppercase">{label}</div>
      <div className="mt-1 text-4xl font-black tabular-nums">{value}</div>
    </div>
  );
}

function Item({
  n,
  title,
  meta,
  fg,
  accent,
}: {
  n: number;
  title: string;
  meta?: string;
  fg: string;
  accent: string;
}) {
  return (
    <div style={{ borderTop: `3px solid ${fg}` }} className="flex items-start gap-4 py-4">
      <span className="text-2xl font-black" style={{ color: accent }}>
        {String(n).padStart(2, '0')}
      </span>
      <div>
        <div className="text-xl font-black uppercase">{title}</div>
        {meta ? <div className="text-xs font-bold">{meta}</div> : null}
      </div>
    </div>
  );
}

function Brutal({ content, dark }: ConceptProps) {
  const { bg, fg, accent, accent2 } = palette(dark);

  return (
    <div
      style={{
        background: bg,
        color: fg,
        fontFamily: "'Arial Black', 'Malgun Gothic', sans-serif",
      }}
      className="min-h-full p-6"
    >
      <header
        style={{ border: `4px solid ${fg}`, background: accent }}
        className="flex flex-wrap items-center justify-between gap-2 p-4"
      >
        <span className="text-2xl font-black" style={{ color: bg }}>
          {content.profile.name}
        </span>
        <nav className="flex flex-wrap gap-3 text-xs font-black" style={{ color: bg }}>
          {['홈', '소개', '논문 리뷰', '프로젝트', '블로그'].map((t) => (
            <span key={t}>[{t}]</span>
          ))}
        </nav>
      </header>

      <h1 className="mt-6 text-5xl leading-[0.95] font-black break-keep sm:text-7xl">
        {content.profile.headline}
      </h1>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Block label="Papers" value={String(content.papers.length)} fg={fg} bg={bg} />
        <Block label="Projects" value={String(content.projects.length)} fg={fg} bg={accent2} />
        <Block label="Posts" value={String(content.posts.length)} fg={fg} bg={bg} />
      </div>

      <section className="mt-10">
        <h2 className="text-3xl font-black uppercase">논문 리뷰</h2>
        {content.papers.map((p, i) => (
          <Item key={p.id} n={i + 1} title={p.title} meta={p.venue} fg={fg} accent={accent} />
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-3xl font-black uppercase">프로젝트</h2>
        {content.projects.map((p, i) => (
          <Item key={p.id} n={i + 1} title={p.title} meta={p.role} fg={fg} accent={accent} />
        ))}
      </section>
    </div>
  );
}

export const brutal: Concept = {
  id: 'brutal',
  name: '브루탈',
  tagline: '굵은 테두리와 거대 활자. 기억에 남지만 조용하지 않다.',
  reference: '2026 브루탈리즘 회귀 트렌드',
  render: (props) => <Brutal {...props} />,
};
