import type { Concept, ConceptProps } from './types';

/**
 * 시안 4 — 키네틱 미니멀 (leeboa.com 계열).
 *
 * 페이지 수를 줄이고 거대한 키워드를 흘려 보낸다. 여백이 주인공이다.
 * 콘텐츠가 적을 때 오히려 강해지는 구성 — 지금처럼 항목이 몇 개 없을 때 유리하다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#131318' : '#f2f0f5',
    fg: dark ? '#f2f0f5' : '#1b1b22',
    dim: dark ? '#8b8b99' : '#77737f',
    accent: '#ff7aa8',
  };
}

function Marquee({ words, fg }: { words: string[]; fg: string }) {
  return (
    <div className="overflow-hidden py-2">
      <div className="flex gap-8 whitespace-nowrap">
        {words.map((w) => (
          <span
            key={w}
            className="text-5xl font-semibold tracking-tight sm:text-7xl"
            style={{ color: fg }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}

function Card({
  title,
  note,
  fg,
  dim,
  accent,
}: {
  title: string;
  note?: string;
  fg: string;
  dim: string;
  accent: string;
}) {
  return (
    <div className="group py-8">
      <div className="flex items-center gap-3">
        <span className="size-2 rounded-full" style={{ background: accent }} />
        <span className="text-2xl font-medium" style={{ color: fg }}>
          {title}
        </span>
      </div>
      {note ? (
        <p className="mt-2 max-w-lg pl-5 text-sm leading-relaxed" style={{ color: dim }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function Kinetic({ content, dark }: ConceptProps) {
  const { bg, fg, dim, accent } = palette(dark);

  return (
    <div
      style={{
        background: bg,
        color: fg,
        backgroundImage: `radial-gradient(${dim}22 1px, transparent 1px)`,
        backgroundSize: '18px 18px',
      }}
      className="min-h-full"
    >
      <header className="flex items-center justify-between px-8 py-6">
        <span className="text-sm font-semibold">{content.profile.name}</span>
        <span
          className="rounded-full px-4 py-1.5 text-xs font-medium"
          style={{ background: accent, color: bg }}
        >
          See on GitHub
        </span>
      </header>

      <div className="px-8 pt-16 pb-8">
        <Marquee words={['문제 정의', '끝까지', '만들어 내기']} fg={fg} />
        <p className="mt-10 max-w-md text-sm leading-loose" style={{ color: dim }}>
          {content.profile.headline}
        </p>
      </div>

      <div className="px-8 pb-20">
        <div className="text-[11px] tracking-[0.2em]" style={{ color: dim }}>
          SELECTED WORK
        </div>
        {content.projects.map((p) => (
          <Card key={p.id} title={p.title} note={p.summary} fg={fg} dim={dim} accent={accent} />
        ))}
        {content.papers.map((p) => (
          <Card key={p.id} title={p.title} note={p.summary} fg={fg} dim={dim} accent={accent} />
        ))}
      </div>
    </div>
  );
}

export const kinetic: Concept = {
  id: 'kinetic',
  name: '키네틱 미니멀',
  tagline: '거대 키워드와 여백. 콘텐츠가 적을 때 오히려 강하다.',
  reference: 'leeboa.com — 대형 타이포 + 점 격자',
  render: (props) => <Kinetic {...props} />,
};
