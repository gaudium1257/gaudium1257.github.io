import type { Concept, ConceptProps } from './types';

/**
 * 시안 9 — 신문.
 *
 * 다단 조판과 굵은 제호. 정보 밀도가 가장 높아 **항목이 많아질수록 유리하다.**
 * 지금처럼 콘텐츠가 적으면 허전해 보인다는 게 이 시안의 조건이다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#14140f' : '#f7f5ee',
    fg: dark ? '#efece2' : '#14140f',
    dim: dark ? '#9d9a8e' : '#5d5a50',
    line: dark ? '#33322a' : '#c9c5b6',
  };
}

interface Article {
  id: string;
  title: string;
  note?: string;
}

function Column({
  title,
  items,
  fg,
  dim,
  line,
  last,
}: {
  title: string;
  items: Article[];
  fg: string;
  dim: string;
  line: string;
  last?: boolean;
}) {
  return (
    <div className="px-4" style={{ borderRight: last ? undefined : `1px solid ${line}` }}>
      <h2
        className="pb-2 text-xs font-bold tracking-[0.15em] uppercase"
        style={{ borderBottom: `2px solid ${fg}` }}
      >
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="pt-3 text-xs italic" style={{ color: dim }}>
          기사 없음
        </p>
      ) : null}
      {items.map((it) => (
        <article key={it.id} className="py-3" style={{ borderBottom: `1px solid ${line}` }}>
          <h3 className="text-base leading-snug font-semibold break-keep">{it.title}</h3>
          {it.note ? (
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: dim }}>
              {it.note}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function Newspaper({ content, dark }: ConceptProps) {
  const { bg, fg, dim, line } = palette(dark);
  const cols: [string, Article[]][] = [
    ['논문 리뷰', content.papers.map((p) => ({ id: p.id, title: p.title, note: p.summary }))],
    ['프로젝트', content.projects.map((p) => ({ id: p.id, title: p.title, note: p.summary }))],
    ['블로그', content.posts.map((p) => ({ id: p.id, title: p.title, note: p.summary }))],
  ];

  return (
    <div
      style={{ background: bg, color: fg, fontFamily: "'Times New Roman', serif" }}
      className="min-h-full px-6 py-8"
    >
      <header className="text-center" style={{ borderBottom: `3px double ${fg}` }}>
        <div className="text-[10px] tracking-[0.3em] uppercase" style={{ color: dim }}>
          Portfolio Daily
        </div>
        <h1 className="text-5xl font-black tracking-tight">{content.profile.name}</h1>
        <p className="pb-2 text-xs italic" style={{ color: dim }}>
          {content.profile.headline}
        </p>
      </header>

      <div className="mt-6 grid grid-cols-3">
        {cols.map(([title, items], i) => (
          <Column
            key={title}
            title={title}
            items={items}
            fg={fg}
            dim={dim}
            line={line}
            last={i === cols.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export const newspaper: Concept = {
  id: 'newspaper',
  name: '신문',
  tagline: '다단 조판과 제호. 밀도가 높아 항목이 많을수록 유리하다.',
  reference: '전통 신문 조판 · 에디토리얼 다단',
  render: (props) => <Newspaper {...props} />,
};
