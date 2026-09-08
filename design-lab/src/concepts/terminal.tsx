import type { Concept, ConceptProps } from './types';

/**
 * 시안 2 — 터미널.
 *
 * 색을 거의 빼고 흑백에 프롬프트 기호만 남긴다. 개발자 정체성이 가장 직접 드러나지만,
 * 비개발 심사자에게는 읽기 부담이 될 수 있다는 게 이 시안의 대가다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#0b0d0e' : '#101314',
    fg: dark ? '#d6e0dd' : '#dfe7e5',
    dim: '#6b7a77',
    green: '#7ee08a',
    amber: '#e0c07e',
  };
}

function Prompt({
  path,
  cmd,
  green,
  dim,
}: {
  path: string;
  cmd: string;
  green: string;
  dim: string;
}) {
  return (
    <div className="flex gap-2">
      <span style={{ color: green }}>~/{path}</span>
      <span style={{ color: dim }}>$</span>
      <span>{cmd}</span>
    </div>
  );
}

function Entry({
  title,
  meta,
  note,
  dim,
  amber,
}: {
  title: string;
  meta?: string;
  note?: string;
  dim: string;
  amber: string;
}) {
  return (
    <div className="py-2">
      <div>
        <span style={{ color: amber }}>▸ </span>
        {title}
      </div>
      {meta ? (
        <div className="pl-4 text-xs" style={{ color: dim }}>
          {meta}
        </div>
      ) : null}
      {note ? (
        <div className="pl-4 text-xs leading-relaxed" style={{ color: dim }}>
          {note}
        </div>
      ) : null}
    </div>
  );
}

/** 창 신호등. 터미널이라는 은유를 한 눈에 세우는 최소 장치다 */
function WindowChrome() {
  return (
    <div className="flex gap-1.5 pb-2">
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <span key={c} className="size-3 rounded-full" style={{ background: c }} />
      ))}
    </div>
  );
}

function Listing({ rows, dim }: { rows: [string, number][]; dim: string }) {
  return (
    <div className="space-y-0.5 pl-4" style={{ color: dim }}>
      {rows.map(([name, n]) => (
        <div key={name}>
          drwxr-xr-x {name.padEnd(11, ' ')} {String(n).padStart(2, '0')}
        </div>
      ))}
    </div>
  );
}

/** `cat *.md` 한 덩어리 — 종류가 달라도 터미널에서는 같은 모양으로 읽힌다 */
function Catalog({
  label,
  items,
  green,
  dim,
  amber,
}: {
  label: string;
  items: { id: string; title: string; meta?: string; note?: string }[];
  green: string;
  dim: string;
  amber: string;
}) {
  return (
    <>
      <Prompt path={`portfolio/${label}`} cmd="cat *.md" green={green} dim={dim} />
      <div className="pl-4">
        {items.map((it) => (
          <Entry
            key={it.id}
            title={it.title}
            meta={it.meta}
            note={it.note}
            dim={dim}
            amber={amber}
          />
        ))}
      </div>
    </>
  );
}

function Terminal({ content, dark }: ConceptProps) {
  const { bg, fg, dim, green, amber } = palette(dark);
  const font = "'JetBrains Mono', 'D2Coding', Consolas, monospace";

  return (
    <div style={{ background: bg, color: fg, fontFamily: font }} className="min-h-full p-8 text-sm">
      <div className="mx-auto max-w-3xl space-y-6">
        <WindowChrome />

        <Prompt path="portfolio" cmd="whoami" green={green} dim={dim} />
        <div className="pl-4">
          <div className="text-2xl">{content.profile.name}</div>
          <div style={{ color: dim }}>{content.profile.headline}</div>
        </div>

        <Prompt path="portfolio" cmd="ls -la" green={green} dim={dim} />
        <Listing
          rows={[
            ['papers/', content.papers.length],
            ['projects/', content.projects.length],
            ['posts/', content.posts.length],
          ]}
          dim={dim}
        />

        <Catalog
          label="papers"
          items={content.papers.map((p) => ({
            id: p.id,
            title: p.title,
            meta: p.venue,
            note: p.summary,
          }))}
          green={green}
          dim={dim}
          amber={amber}
        />
        <Catalog
          label="projects"
          items={content.projects.map((p) => ({
            id: p.id,
            title: p.title,
            meta: p.role,
            note: p.summary,
          }))}
          green={green}
          dim={dim}
          amber={amber}
        />

        <div className="flex gap-2 pt-2">
          <span style={{ color: green }}>~/portfolio</span>
          <span style={{ color: dim }}>$</span>
          <span className="inline-block w-2 animate-pulse" style={{ background: fg }}>
            &nbsp;
          </span>
        </div>
      </div>
    </div>
  );
}

export const terminal: Concept = {
  id: 'terminal',
  name: '터미널',
  tagline: '흑백 고정폭. 프롬프트와 파일 목록으로 읽는다.',
  reference: 'Vercel 계열 개발자 미학 · 2026 터미널/IDE 트렌드',
  render: (props) => <Terminal {...props} />,
};
