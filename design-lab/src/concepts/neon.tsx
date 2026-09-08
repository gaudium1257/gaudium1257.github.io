import type { Concept, ConceptProps } from './types';

/**
 * 시안 10 — 다크 네온.
 *
 * 검정 위 네온 그라디언트와 발광. 눈에 확 띄지만 **어느 회사 랜딩에서나 본 형태**이기도 하다.
 * 학회 심사보다는 프론트엔드 기업 지원에서 유리한 쪽이다.
 */
function palette() {
  return {
    bg: '#07070c',
    panel: '#0e0e17',
    fg: '#eceaf6',
    dim: '#8b88a8',
    c1: '#7c5cff',
    c2: '#22d3ee',
  };
}

function GlowCard({
  kind,
  title,
  note,
  panel,
  dim,
  c1,
  c2,
}: {
  kind: string;
  title: string;
  note?: string;
  panel: string;
  dim: string;
  c1: string;
  c2: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: panel,
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `0 0 40px -22px ${c1}`,
      }}
    >
      <div
        className="text-[11px] tracking-[0.15em] uppercase"
        style={{
          background: `linear-gradient(90deg, ${c1}, ${c2})`,
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {kind}
      </div>
      <div className="mt-1.5 text-lg font-semibold">{title}</div>
      {note ? (
        <p className="mt-1.5 text-sm leading-relaxed" style={{ color: dim }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function Hero({
  content,
  fg,
  dim,
  c1,
  c2,
}: {
  content: ConceptProps['content'];
  fg: string;
  dim: string;
  c1: string;
  c2: string;
}) {
  return (
    <div className="py-20 text-center">
      <h1
        className="text-4xl leading-tight font-bold break-keep sm:text-5xl"
        style={{
          background: `linear-gradient(120deg, ${fg} 20%, ${c2} 60%, ${c1} 100%)`,
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {content.profile.headline}
      </h1>
      <p className="mt-5 text-sm" style={{ color: dim }}>
        논문 {content.papers.length} · 프로젝트 {content.projects.length} · 글{' '}
        {content.posts.length}
      </p>
    </div>
  );
}

function Neon({ content }: ConceptProps) {
  const { bg, panel, fg, dim, c1, c2 } = palette();

  return (
    <div
      style={{
        background: `radial-gradient(90% 60% at 50% -10%, ${c1}33 0%, transparent 60%), ${bg}`,
        color: fg,
      }}
      className="min-h-full px-8 py-8"
    >
      <header className="flex items-center justify-between">
        <span className="text-sm font-semibold">{content.profile.name}</span>
        <nav className="flex gap-5 text-xs" style={{ color: dim }}>
          {['홈', '소개', '논문 리뷰', '프로젝트', '블로그'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </nav>
      </header>

      <Hero content={content} fg={fg} dim={dim} c1={c1} c2={c2} />

      <div className="grid gap-4 sm:grid-cols-2">
        {content.projects.map((p) => (
          <GlowCard
            key={p.id}
            kind="Project"
            title={p.title}
            note={p.summary}
            panel={panel}
            dim={dim}
            c1={c1}
            c2={c2}
          />
        ))}
        {content.papers.map((p) => (
          <GlowCard
            key={p.id}
            kind="Paper"
            title={p.title}
            note={p.summary}
            panel={panel}
            dim={dim}
            c1={c1}
            c2={c2}
          />
        ))}
      </div>
    </div>
  );
}

export const neon: Concept = {
  id: 'neon',
  name: '다크 네온',
  tagline: '검정 위 네온 그라디언트. 눈에 띄지만 흔한 형태이기도 하다.',
  reference: 'SaaS 랜딩 계열 다크 그라디언트',
  render: (props) => <Neon {...props} />,
};
