import type { Concept, ConceptProps } from './types';

/**
 * 시안 14 — 이력서 한 장.
 *
 * 화면이 곧 인쇄물이다. 심사자가 PDF 로 뽑아 회의에 들고 가는 상황을 전제한다.
 * 학회·기업 지원이라는 목적에는 가장 정직하게 맞지만, 웹사이트다운 맛은 없다.
 */
function palette(dark: boolean) {
  return {
    page: dark ? '#1a1a1a' : '#ffffff',
    board: dark ? '#0d0d0d' : '#e8e8e6',
    fg: dark ? '#ededed' : '#1a1a1a',
    dim: dark ? '#9a9a9a' : '#5a5a5a',
    line: dark ? '#333333' : '#d4d4d4',
  };
}

function Section({
  label,
  fg,
  line,
  children,
}: {
  label: string;
  fg: string;
  line: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2
        className="pb-1 text-[11px] font-bold tracking-[0.18em]"
        style={{ borderBottom: `1px solid ${fg}` }}
      >
        {label}
      </h2>
      <div style={{ borderColor: line }}>{children}</div>
    </section>
  );
}

function Entry({
  when,
  title,
  org,
  note,
  dim,
}: {
  when: string;
  title: string;
  org?: string;
  note?: string;
  dim: string;
}) {
  return (
    <div className="flex gap-4 py-2">
      <span className="w-24 shrink-0 text-[11px] tabular-nums" style={{ color: dim }}>
        {when}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold">{title}</div>
        {org ? (
          <div className="text-[11px]" style={{ color: dim }}>
            {org}
          </div>
        ) : null}
        {note ? (
          <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: dim }}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Resume({ content, dark }: ConceptProps) {
  const { page, board, fg, dim, line } = palette(dark);

  return (
    <div style={{ background: board }} className="min-h-full p-8">
      <div
        className="mx-auto max-w-2xl px-12 py-10 shadow-lg"
        style={{ background: page, color: fg, fontFamily: "'Times New Roman', serif" }}
      >
        <div className="text-center" style={{ borderBottom: `2px solid ${fg}` }}>
          <h1 className="text-3xl font-bold">{content.profile.name}</h1>
          <p className="pb-3 text-[13px]" style={{ color: dim }}>
            {content.profile.headline}
            {content.profile.links.length > 0
              ? ` · ${content.profile.links.map((l) => l.label).join(' · ')}`
              : ''}
          </p>
        </div>

        <Section label="학력 · 경력" fg={fg} line={line}>
          {content.specs.map((s) => (
            <Entry
              key={s.id}
              when={s.startedOn ?? ''}
              title={s.title}
              org={s.organization}
              note={s.description}
              dim={dim}
            />
          ))}
        </Section>

        <Section label="프로젝트" fg={fg} line={line}>
          {content.projects.map((p) => (
            <Entry
              key={p.id}
              when={p.startedOn}
              title={p.title}
              org={p.role}
              note={p.summary}
              dim={dim}
            />
          ))}
        </Section>

        <Section label="논문 리뷰" fg={fg} line={line}>
          {content.papers.map((p) => (
            <Entry
              key={p.id}
              when={p.readOn}
              title={p.title}
              org={p.venue}
              note={p.summary}
              dim={dim}
            />
          ))}
        </Section>
      </div>
    </div>
  );
}

export const resume: Concept = {
  id: 'resume',
  name: '이력서 한 장',
  tagline: '화면이 곧 인쇄물. 목적엔 가장 정직하나 웹다운 맛은 없다.',
  reference: '학술 CV · 인쇄 전제 레이아웃',
  render: (props) => <Resume {...props} />,
};
