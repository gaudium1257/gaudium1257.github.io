import type { Concept, ConceptProps } from './types';

/**
 * 시안 8 — 벤토 박스.
 *
 * 크기가 다른 타일을 격자에 배치한다. 항목마다 무게를 다르게 줄 수 있어
 * "무엇을 먼저 보여줄지" 를 배치로 말할 수 있다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#0e0e11' : '#f6f6f8',
    tile: dark ? '#18181d' : '#ffffff',
    fg: dark ? '#f2f2f5' : '#16161a',
    dim: dark ? '#9494a0' : '#6e6e78',
    accent: '#5b6cff',
  };
}

function Tile({ span, tile, children }: { span: string; tile: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-5 ${span}`} style={{ background: tile }}>
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  dim,
  accent,
}: {
  label: string;
  value: number;
  dim: string;
  accent: string;
}) {
  return (
    <>
      <div className="text-xs" style={{ color: dim }}>
        {label}
      </div>
      <div className="mt-1 text-4xl font-semibold tabular-nums" style={{ color: accent }}>
        {value}
      </div>
    </>
  );
}

function WorkTile({
  kind,
  title,
  note,
  tile,
  dim,
  accent,
}: {
  kind: string;
  title: string;
  note?: string;
  tile: string;
  dim: string;
  accent: string;
}) {
  return (
    <Tile span="col-span-2" tile={tile}>
      <div className="text-xs" style={{ color: accent }}>
        {kind}
      </div>
      <div className="mt-1 font-semibold">{title}</div>
      {note ? (
        <p className="mt-1 text-xs leading-relaxed" style={{ color: dim }}>
          {note}
        </p>
      ) : null}
    </Tile>
  );
}

function Bento({ content, dark }: ConceptProps) {
  const { bg, tile, fg, dim, accent } = palette(dark);

  return (
    <div style={{ background: bg, color: fg }} className="min-h-full p-6">
      <div className="grid auto-rows-[minmax(110px,auto)] grid-cols-4 gap-4">
        <Tile span="col-span-4 row-span-2" tile={tile}>
          <div className="text-xs" style={{ color: dim }}>
            {content.profile.name}
          </div>
          <h1 className="mt-2 text-3xl leading-snug font-semibold break-keep">
            {content.profile.headline}
          </h1>
        </Tile>

        <Tile span="col-span-1" tile={tile}>
          <Stat label="논문" value={content.papers.length} dim={dim} accent={accent} />
        </Tile>
        <Tile span="col-span-1" tile={tile}>
          <Stat label="프로젝트" value={content.projects.length} dim={dim} accent={accent} />
        </Tile>
        <Tile span="col-span-2" tile={tile}>
          <Stat label="글" value={content.posts.length} dim={dim} accent={accent} />
        </Tile>

        {content.projects.map((p) => (
          <WorkTile
            key={p.id}
            kind="프로젝트"
            title={p.title}
            note={p.summary}
            tile={tile}
            dim={dim}
            accent={accent}
          />
        ))}
        {content.papers.map((p) => (
          <WorkTile
            key={p.id}
            kind="논문 리뷰"
            title={p.title}
            note={p.summary}
            tile={tile}
            dim={dim}
            accent={accent}
          />
        ))}
      </div>
    </div>
  );
}

export const bento: Concept = {
  id: 'bento',
  name: '벤토 박스',
  tagline: '크기가 다른 타일. 무엇을 먼저 볼지 배치로 말한다.',
  reference: 'Apple / Vercel 이후의 벤토 그리드',
  render: (props) => <Bento {...props} />,
};
