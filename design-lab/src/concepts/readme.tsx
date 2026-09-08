import type { Concept, ConceptProps } from './types';

/**
 * 시안 16 — README.
 *
 * 깃허브 저장소 문서처럼 보이게 한다. 개발자 심사자에게는 가장 익숙한 형식이라
 * **읽는 속도가 빠르다.** 반대로 디자인 감각을 보여줄 여지는 거의 없다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#0d1117' : '#ffffff',
    fg: dark ? '#e6edf3' : '#1f2328',
    dim: dark ? '#8b949e' : '#59636e',
    line: dark ? '#30363d' : '#d1d9e0',
    link: dark ? '#4493f8' : '#0969da',
    chip: dark ? '#21262d' : '#f6f8fa',
  };
}

function Badge({
  label,
  value,
  chip,
  link,
}: {
  label: string;
  value: string;
  chip: string;
  link: string;
}) {
  return (
    <span className="inline-flex overflow-hidden rounded text-[11px]">
      <span className="px-2 py-0.5" style={{ background: chip }}>
        {label}
      </span>
      <span className="px-2 py-0.5 text-white" style={{ background: link }}>
        {value}
      </span>
    </span>
  );
}

function ListItem({
  title,
  note,
  link,
  dim,
}: {
  title: string;
  note?: string;
  link: string;
  dim: string;
}) {
  return (
    <li className="py-1">
      <a style={{ color: link }} className="underline-offset-2 hover:underline">
        {title}
      </a>
      {note ? <span style={{ color: dim }}> — {note}</span> : null}
    </li>
  );
}

/** 저장소 경로 줄. GitHub 을 아는 사람에게는 이 한 줄이 맥락을 다 준다 */
function RepoBar({
  name,
  line,
  link,
  dim,
}: {
  name: string;
  line: string;
  link: string;
  dim: string;
}) {
  return (
    <div
      className="flex items-center gap-2 pb-3 text-sm"
      style={{ borderBottom: `1px solid ${line}` }}
    >
      <span style={{ color: link }}>{name}</span>
      <span style={{ color: dim }}>/</span>
      <span className="font-semibold">portfolio</span>
      <span
        className="ml-2 rounded-full border px-2 text-[11px]"
        style={{ borderColor: line, color: dim }}
      >
        Public
      </span>
    </div>
  );
}

/** `## 제목` + 불릿 목록 — README 의 기본 단위 */
function MdSection({
  heading,
  items,
  line,
  link,
  dim,
}: {
  heading: string;
  items: { id: string; title: string; note?: string }[];
  line: string;
  link: string;
  dim: string;
}) {
  return (
    <>
      <h2 className="mt-8 pb-1 text-xl font-semibold" style={{ borderBottom: `1px solid ${line}` }}>
        ## {heading}
      </h2>
      <ul className="mt-2 list-disc pl-6">
        {items.map((it) => (
          <ListItem key={it.id} title={it.title} note={it.note} link={link} dim={dim} />
        ))}
      </ul>
    </>
  );
}

function Readme({ content, dark }: ConceptProps) {
  const { bg, fg, dim, line, link, chip } = palette(dark);

  return (
    <div
      style={{ background: bg, color: fg, fontFamily: "'Segoe UI', 'Malgun Gothic', sans-serif" }}
      className="min-h-full p-8 text-[15px] leading-relaxed"
    >
      <div className="mx-auto max-w-3xl">
        <RepoBar name={content.profile.name} line={line} link={link} dim={dim} />

        <h1
          className="mt-6 pb-2 text-2xl font-semibold"
          style={{ borderBottom: `1px solid ${line}` }}
        >
          # {content.profile.name}
        </h1>
        <p className="mt-3" style={{ color: dim }}>
          {content.profile.headline}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge label="papers" value={String(content.papers.length)} chip={chip} link={link} />
          <Badge label="projects" value={String(content.projects.length)} chip={chip} link={link} />
          <Badge label="posts" value={String(content.posts.length)} chip={chip} link={link} />
        </div>

        <MdSection
          heading="논문 리뷰"
          items={content.papers.map((p) => ({ id: p.id, title: p.title, note: p.venue }))}
          line={line}
          link={link}
          dim={dim}
        />
        <MdSection
          heading="프로젝트"
          items={content.projects.map((p) => ({ id: p.id, title: p.title, note: p.summary }))}
          line={line}
          link={link}
          dim={dim}
        />

        <pre className="mt-6 overflow-x-auto rounded p-3 text-[13px]" style={{ background: chip }}>
          {`$ git clone https://github.com/${content.profile.name}/portfolio`}
        </pre>
      </div>
    </div>
  );
}

export const readme: Concept = {
  id: 'readme',
  name: 'README',
  tagline: '깃허브 문서 형식. 개발자에겐 가장 빠르게 읽히지만 감각은 못 보여준다.',
  reference: 'GitHub README · 마크다운 렌더',
  render: (props) => <Readme {...props} />,
};
