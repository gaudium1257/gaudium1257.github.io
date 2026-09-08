import type { Concept, ConceptProps } from './types';

/**
 * 시안 11 — 문서 도구 (Notion 계열).
 *
 * 왼쪽에 목차 사이드바, 본문은 문서처럼. 읽는 사람이 이미 아는 형태라 학습 비용이 없다.
 * 다만 "남의 도구를 닮았다" 는 인상도 같이 온다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#191919' : '#ffffff',
    side: dark ? '#202020' : '#fbfbfa',
    fg: dark ? '#e9e9e7' : '#37352f',
    dim: dark ? '#9b9a97' : '#787774',
    line: dark ? '#2f2f2f' : '#ededec',
  };
}

function SideItem({ icon, label, dim }: { icon: string; label: string; dim: string }) {
  return (
    <div className="flex items-center gap-2 rounded px-2 py-1 text-sm" style={{ color: dim }}>
      <span>{icon}</span>
      {label}
    </div>
  );
}

function DocBlock({
  icon,
  title,
  note,
  dim,
  line,
}: {
  icon: string;
  title: string;
  note?: string;
  dim: string;
  line: string;
}) {
  return (
    <div className="flex gap-3 py-2.5" style={{ borderBottom: `1px solid ${line}` }}>
      <span className="pt-0.5 text-base">{icon}</span>
      <div>
        <div className="text-[15px] font-medium underline decoration-transparent">{title}</div>
        {note ? (
          <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: dim }}>
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Docs({ content, dark }: ConceptProps) {
  const { bg, side, fg, dim, line } = palette(dark);

  return (
    <div style={{ background: bg, color: fg }} className="flex min-h-full">
      <aside className="w-52 shrink-0 p-3" style={{ background: side }}>
        <div className="px-2 pb-3 text-sm font-medium">{content.profile.name}</div>
        <SideItem icon="🏠" label="홈" dim={dim} />
        <SideItem icon="👤" label="소개" dim={dim} />
        <SideItem icon="📄" label="논문 리뷰" dim={dim} />
        <SideItem icon="🛠️" label="프로젝트" dim={dim} />
        <SideItem icon="✏️" label="블로그" dim={dim} />
      </aside>

      <main className="flex-1 px-14 py-12">
        <div className="text-5xl">📓</div>
        <h1 className="mt-4 text-4xl font-bold break-keep">{content.profile.headline}</h1>
        <p className="mt-3 text-[15px]" style={{ color: dim }}>
          {content.profile.intro || '소개를 채우면 여기에 나옵니다.'}
        </p>

        <h2 className="mt-10 mb-2 text-xl font-semibold">📄 논문 리뷰</h2>
        {content.papers.map((p) => (
          <DocBlock key={p.id} icon="📄" title={p.title} note={p.summary} dim={dim} line={line} />
        ))}

        <h2 className="mt-8 mb-2 text-xl font-semibold">🛠️ 프로젝트</h2>
        {content.projects.map((p) => (
          <DocBlock key={p.id} icon="🛠️" title={p.title} note={p.summary} dim={dim} line={line} />
        ))}

        <h2 className="mt-8 mb-2 text-xl font-semibold">✏️ 블로그</h2>
        {content.posts.map((p) => (
          <DocBlock key={p.id} icon="✏️" title={p.title} note={p.summary} dim={dim} line={line} />
        ))}
      </main>
    </div>
  );
}

export const docs: Concept = {
  id: 'docs',
  name: '문서 도구',
  tagline: '목차 사이드바 + 문서형 본문. 학습 비용이 없다.',
  reference: 'Notion 계열 문서 UI',
  render: (props) => <Docs {...props} />,
};
