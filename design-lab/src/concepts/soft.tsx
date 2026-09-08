import type { Concept, ConceptProps } from './types';

/**
 * 시안 5 — 소프트 (savinpark 계열).
 *
 * 파스텔 원형, 둥근 카드, 가운데 정렬, 괄호로 감싼 내비게이션.
 * 친근하지만 학술적 무게는 덜하다 — 학회 지원용으로는 이 점을 감수해야 한다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#1b1a20' : '#fdfcfe',
    fg: dark ? '#efedf3' : '#3b3846',
    dim: dark ? '#a09daa' : '#8b8797',
    pink: dark ? '#4a3540' : '#fbe4ec',
    blue: dark ? '#33405a' : '#e4ecfb',
  };
}

function Blob({
  color,
  size,
  top,
  left,
}: {
  color: string;
  size: number;
  top: string;
  left: string;
}) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full"
      style={{ background: color, width: size, height: size, top, left, opacity: 0.75 }}
    />
  );
}

function SoftCard({
  title,
  note,
  fg,
  dim,
  tint,
}: {
  title: string;
  note?: string;
  fg: string;
  dim: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl p-6" style={{ background: tint }}>
      <div className="text-lg font-semibold" style={{ color: fg }}>
        {title}
      </div>
      {note ? (
        <p className="mt-2 text-sm leading-relaxed" style={{ color: dim }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

function Soft({ content, dark }: ConceptProps) {
  const { bg, fg, dim, pink, blue } = palette(dark);

  return (
    <div style={{ background: bg, color: fg }} className="relative min-h-full overflow-hidden">
      <Blob color={pink} size={220} top="10%" left="-60px" />
      <Blob color={blue} size={160} top="4%" left="82%" />

      <header className="relative flex items-center justify-between px-10 py-6">
        <span className="text-lg italic">{content.profile.name}</span>
        <nav className="flex gap-5 text-xs" style={{ color: dim }}>
          {['About', 'Papers', 'Projects', 'Blog'].map((t) => (
            <span key={t}>⟨ {t} /⟩</span>
          ))}
        </nav>
      </header>

      <main className="relative mx-auto max-w-2xl px-6 pt-16 pb-20 text-center">
        <h1 className="text-3xl font-semibold break-keep">안녕하세요</h1>
        <p className="mt-6 text-sm leading-loose" style={{ color: dim }}>
          {content.profile.headline}
        </p>
        {content.profile.intro ? (
          <p className="mt-3 text-sm leading-loose" style={{ color: dim }}>
            {content.profile.intro}
          </p>
        ) : null}

        <div className="mt-14 space-y-4 text-left">
          <div className="text-center text-xs tracking-[0.2em]" style={{ color: dim }}>
            PROJECTS
          </div>
          {content.projects.map((p, i) => (
            <SoftCard
              key={p.id}
              title={p.title}
              note={p.summary}
              fg={fg}
              dim={dim}
              tint={i % 2 ? blue : pink}
            />
          ))}
          {content.papers.map((p, i) => (
            <SoftCard
              key={p.id}
              title={p.title}
              note={p.summary}
              fg={fg}
              dim={dim}
              tint={i % 2 ? pink : blue}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export const soft: Concept = {
  id: 'soft',
  name: '소프트 파스텔',
  tagline: '파스텔 원형과 둥근 카드. 친근하지만 무게는 덜하다.',
  reference: 'savinpark.github.io/portfolio — 블롭 + 괄호 내비',
  render: (props) => <Soft {...props} />,
};
