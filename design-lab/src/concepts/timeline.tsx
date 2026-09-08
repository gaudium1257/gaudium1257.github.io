import type { Concept, ConceptProps } from './types';

/**
 * 시안 6 — 타임라인.
 *
 * 왼쪽에 세로 축을 세우고 모든 활동을 시간순으로 건다.
 * 학회·기업 심사에서 "무엇을 언제 했는가" 가 한 화면에 보이는 게 이 구성의 강점이다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#0f1419' : '#ffffff',
    fg: dark ? '#e6edf3' : '#1f2328',
    dim: dark ? '#8b949e' : '#656d76',
    line: dark ? '#30363d' : '#d8dee4',
    dot: '#2f81f7',
  };
}

function Node({
  when,
  title,
  meta,
  note,
  fg,
  dim,
  line,
  dot,
}: {
  when: string;
  title: string;
  meta?: string;
  note?: string;
  fg: string;
  dim: string;
  line: string;
  dot: string;
}) {
  return (
    <div className="relative pb-8 pl-8" style={{ borderLeft: `2px solid ${line}` }}>
      <span
        className="absolute top-1 -left-[7px] size-3 rounded-full"
        style={{ background: dot, boxShadow: `0 0 0 3px ${line}` }}
      />
      <div className="text-[11px] tabular-nums" style={{ color: dim }}>
        {when}
      </div>
      <div className="mt-1 font-semibold" style={{ color: fg }}>
        {title}
      </div>
      {meta ? (
        <div className="text-xs" style={{ color: dim }}>
          {meta}
        </div>
      ) : null}
      {note ? (
        <p className="mt-1.5 max-w-xl text-sm leading-relaxed" style={{ color: dim }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}

/** 스펙·프로젝트·논문을 한 축에 건다 — 종류가 달라도 '언제' 로는 같은 줄에 선다 */
function Track({
  content,
  fg,
  dim,
  line,
  dot,
}: {
  content: ConceptProps['content'];
  fg: string;
  dim: string;
  line: string;
  dot: string;
}) {
  const style = { fg, dim, line, dot };
  return (
    <div className="mt-12">
      {content.specs.map((s) => (
        <Node
          key={s.id}
          when={s.startedOn ?? ''}
          title={s.title}
          meta={s.organization}
          note={s.description}
          {...style}
        />
      ))}
      {content.projects.map((p) => (
        <Node
          key={p.id}
          when={p.startedOn}
          title={p.title}
          meta={p.role}
          note={p.summary}
          {...style}
        />
      ))}
      {content.papers.map((p) => (
        <Node
          key={p.id}
          when={p.readOn}
          title={p.title}
          meta={p.venue}
          note={p.summary}
          {...style}
        />
      ))}
    </div>
  );
}

function Timeline({ content, dark }: ConceptProps) {
  const { bg, fg, dim, line, dot } = palette(dark);

  return (
    <div style={{ background: bg, color: fg }} className="min-h-full">
      <header
        className="flex items-center justify-between px-8 py-4"
        style={{ borderBottom: `1px solid ${line}` }}
      >
        <span className="font-semibold">{content.profile.name}</span>
        <nav className="flex gap-5 text-xs" style={{ color: dim }}>
          {['홈', '소개', '논문 리뷰', '프로젝트', '블로그'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-8 py-12">
        <h1 className="text-3xl font-semibold break-keep">{content.profile.headline}</h1>
        <p className="mt-3 text-sm" style={{ color: dim }}>
          {content.specs.length + content.papers.length + content.projects.length}건의 기록
        </p>

        <Track content={content} fg={fg} dim={dim} line={line} dot={dot} />
      </main>
    </div>
  );
}

export const timeline: Concept = {
  id: 'timeline',
  name: '타임라인',
  tagline: '세로 축에 모든 활동을 시간순으로. 이력이 한눈에 보인다.',
  reference: 'GitHub 계열 정보 밀도 + 연표 구성',
  render: (props) => <Timeline {...props} />,
};
