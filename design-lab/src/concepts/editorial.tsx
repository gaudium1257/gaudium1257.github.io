import type { Concept, ConceptProps } from './types';

/**
 * 시안 1 — 학술지(Editorial).
 *
 * 활자와 괘선만으로 위계를 만든다. 번호가 붙은 목차, 왼쪽에 걸린 색인 번호,
 * 제목과 도구를 잇는 가는 선. 논문 리뷰가 중심인 포트폴리오에 가장 잘 맞는다.
 */
/** 시안의 팔레트는 시안이 직접 계산한다 (EP-0005 결정 로그) */
function palette(dark: boolean) {
  return {
    ink: dark ? '#f2efe9' : '#1a1815',
    paper: dark ? '#16150f' : '#faf8f3',
    dim: dark ? '#a09a8e' : '#6b6559',
    rule: dark ? '#332f28' : '#ddd7c9',
  };
}

function Masthead({ name, ink, dim }: { name: string; ink: string; dim: string }) {
  return (
    <header
      style={{ borderBottom: `2px solid ${ink}` }}
      className="mx-auto flex max-w-4xl items-baseline gap-8 px-8 pt-8 pb-3"
    >
      <span className="text-2xl">{name}</span>
      <nav className="flex gap-6 text-[11px] tracking-[0.18em]" style={{ color: dim }}>
        {['홈', '소개', '논문 리뷰', '프로젝트', '블로그'].map((t, i) => (
          <span key={t} style={i === 0 ? { color: ink } : undefined}>
            {t}
          </span>
        ))}
      </nav>
    </header>
  );
}

function Ledger({ rows, rule, dim }: { rows: [string, number][]; rule: string; dim: string }) {
  return (
    <div
      className="mt-10 grid grid-cols-3"
      style={{ borderTop: `1px solid ${rule}`, borderBottom: `1px solid ${rule}` }}
    >
      {rows.map(([label, n], i) => (
        <div
          key={label}
          className="py-4"
          style={{ borderRight: i < rows.length - 1 ? `1px solid ${rule}` : undefined }}
        >
          <div className="text-[10px] tracking-[0.15em]" style={{ color: dim }}>
            {label}
          </div>
          <div className="mt-1 text-3xl tabular-nums">{String(n).padStart(2, '0')}</div>
        </div>
      ))}
    </div>
  );
}

function Editorial({ content, dark }: ConceptProps) {
  const { ink, paper, dim, rule } = palette(dark);

  return (
    <div style={{ background: paper, color: ink, fontFamily: "'Times New Roman', serif" }}>
      <Masthead name={content.profile.name} ink={ink} dim={dim} />

      <main className="mx-auto max-w-4xl px-8 pb-16">
        <p className="pt-10 text-[10px] tracking-[0.25em]" style={{ color: dim }}>
          PORTFOLIO — {new Date().getFullYear()}
        </p>
        <h1 className="mt-4 text-5xl leading-[1.15]">{content.profile.headline}</h1>
        {content.profile.intro ? (
          <p className="mt-6 max-w-xl text-[15px] leading-loose" style={{ color: dim }}>
            {content.profile.intro}
          </p>
        ) : null}

        <Ledger
          rows={[
            ['논문 리뷰', content.papers.length],
            ['프로젝트', content.projects.length],
            ['글', content.posts.length],
          ]}
          rule={rule}
          dim={dim}
        />

        <Section title="논문 리뷰" index={1} rule={rule} dim={dim}>
          {content.papers.map((p, i) => (
            <Row
              key={p.id}
              n={i + 1}
              title={p.title}
              meta={p.venue}
              note={p.summary}
              rule={rule}
              dim={dim}
            />
          ))}
        </Section>

        <Section title="프로젝트" index={2} rule={rule} dim={dim}>
          {content.projects.map((p, i) => (
            <Row
              key={p.id}
              n={i + 1}
              title={p.title}
              meta={p.role}
              note={p.summary}
              rule={rule}
              dim={dim}
            />
          ))}
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  index,
  rule,
  dim,
  children,
}: {
  title: string;
  index: number;
  rule: string;
  dim: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <div className="flex items-baseline gap-4">
        <span className="text-xs tabular-nums" style={{ color: dim }}>
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="text-lg">{title}</h2>
        <span className="h-px flex-1" style={{ background: rule }} />
        <span className="text-[10px] tracking-[0.1em]" style={{ color: dim }}>
          전체 보기 →
        </span>
      </div>
      <div style={{ borderTop: `1px solid ${rule}` }} className="mt-4">
        {children}
      </div>
    </section>
  );
}

function Row({
  n,
  title,
  meta,
  note,
  rule,
  dim,
}: {
  n: number;
  title: string;
  meta?: string;
  note?: string;
  rule: string;
  dim: string;
}) {
  return (
    <div className="flex gap-4 py-4" style={{ borderBottom: `1px solid ${rule}` }}>
      <span className="w-6 shrink-0 pt-1 text-[11px] tabular-nums" style={{ color: dim }}>
        {String(n).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <div className="text-lg">{title}</div>
        {meta ? (
          <div className="mt-0.5 text-xs italic" style={{ color: dim }}>
            {meta}
          </div>
        ) : null}
        {note ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed" style={{ color: dim }}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export const editorial: Concept = {
  id: 'editorial',
  name: '학술지',
  tagline: '활자와 괘선만으로 위계를 만든다. 번호 붙은 목차.',
  reference: '2026 에디토리얼 트렌드 — 활자가 곧 UI',
  render: (props) => <Editorial {...props} />,
};
