import type { Concept, ConceptProps } from './types';

/**
 * 시안 15 — 매거진 커버.
 *
 * 첫 화면을 표지로 쓴다. 색면 위에 큰 제호와 헤드라인을 얹고, 아래에 목차를 건다.
 * 인상은 가장 세지만 **사진이나 색면에 기대므로 콘텐츠가 아니라 연출로 승부**한다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#101014' : '#faf7f2',
    cover: dark ? '#1d2a4d' : '#1f3a93',
    fg: dark ? '#f4f2ee' : '#141414',
    onCover: '#f7f4ec',
    dim: dark ? '#9c9a94' : '#6a675f',
    accent: '#ffcf3f',
  };
}

function TocRow({
  n,
  kind,
  title,
  fg,
  dim,
  accent,
}: {
  n: number;
  kind: string;
  title: string;
  fg: string;
  dim: string;
  accent: string;
}) {
  return (
    <div className="flex items-baseline gap-4 py-3" style={{ borderTop: `1px solid ${dim}44` }}>
      <span className="w-8 text-sm tabular-nums" style={{ color: accent }}>
        {String(n).padStart(2, '0')}
      </span>
      <span
        className="w-24 shrink-0 text-[11px] tracking-[0.12em] uppercase"
        style={{ color: dim }}
      >
        {kind}
      </span>
      <span className="text-lg break-keep" style={{ color: fg }}>
        {title}
      </span>
    </div>
  );
}

function Magazine({ content, dark }: ConceptProps) {
  const { bg, cover, fg, onCover, dim, accent } = palette(dark);
  const toc = [
    ...content.papers.map((p) => ({ id: p.id, kind: '논문 리뷰', title: p.title })),
    ...content.projects.map((p) => ({ id: p.id, kind: '프로젝트', title: p.title })),
    ...content.posts.map((p) => ({ id: p.id, kind: '블로그', title: p.title })),
  ];

  return (
    <div
      style={{ background: bg, color: fg, fontFamily: "'Times New Roman', serif" }}
      className="min-h-full"
    >
      <section style={{ background: cover, color: onCover }} className="px-10 py-14">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] tracking-[0.3em] uppercase">Issue 01 · 2026</span>
          <span className="text-[11px] tracking-[0.2em] uppercase">Portfolio</span>
        </div>

        <h1 className="mt-10 text-6xl leading-[0.95] font-bold tracking-tight">
          {content.profile.name}
        </h1>

        <p className="mt-6 max-w-lg text-2xl leading-snug break-keep" style={{ color: accent }}>
          {content.profile.headline}
        </p>

        <div className="mt-12 text-[11px] tracking-[0.15em] uppercase">
          {content.profile.links.map((l) => l.label).join('  ·  ')}
        </div>
      </section>

      <section className="px-10 py-10">
        <h2 className="pb-2 text-[11px] tracking-[0.25em] uppercase" style={{ color: dim }}>
          Contents
        </h2>
        {toc.map((t, i) => (
          <TocRow
            key={t.id}
            n={i + 1}
            kind={t.kind}
            title={t.title}
            fg={fg}
            dim={dim}
            accent={accent}
          />
        ))}
      </section>
    </div>
  );
}

export const magazine: Concept = {
  id: 'magazine',
  name: '매거진 커버',
  tagline: '첫 화면이 표지. 인상은 가장 세지만 연출에 기댄다.',
  reference: '잡지 표지 + 목차 조판',
  render: (props) => <Magazine {...props} />,
};
