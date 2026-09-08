import type { Concept, ConceptProps } from './types';

/**
 * 시안 13 — 레트로 (90년대 웹).
 *
 * 회색 배경, 튀어나온 테두리, 방문자 카운터. 확실히 기억에 남는다.
 * **농담이 통하는 자리에서만 통한다** — 학회 지원서에 걸기엔 위험이 크다.
 */
function palette(dark: boolean) {
  return {
    bg: dark ? '#2b2b3a' : '#c0c0c0',
    win: dark ? '#3c3c50' : '#d4d0c8',
    fg: dark ? '#e8e8f0' : '#000000',
    blue: '#000080',
    hi: dark ? '#5a5a78' : '#ffffff',
    lo: dark ? '#1a1a26' : '#808080',
  };
}

function Window({
  title,
  win,
  fg,
  blue,
  hi,
  lo,
  children,
}: {
  title: string;
  win: string;
  fg: string;
  blue: string;
  hi: string;
  lo: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mb-4"
      style={{ background: win, border: `2px solid`, borderColor: `${hi} ${lo} ${lo} ${hi}` }}
    >
      <div
        className="flex items-center justify-between px-2 py-1 text-xs font-bold"
        style={{ background: blue, color: '#ffffff' }}
      >
        <span>{title}</span>
        <span>■ ▬ ✕</span>
      </div>
      <div className="p-3 text-[13px]" style={{ color: fg }}>
        {children}
      </div>
    </div>
  );
}

function Retro({ content, dark }: ConceptProps) {
  const { bg, win, fg, blue, hi, lo } = palette(dark);
  const frame = { win, fg, blue, hi, lo };

  return (
    <div
      style={{ background: bg, color: fg, fontFamily: "'Courier New', monospace" }}
      className="min-h-full p-5"
    >
      <Window title={`${content.profile.name}.exe`} {...frame}>
        <div className="text-center">
          <div className="text-2xl font-bold">☆ {content.profile.name} 의 홈페이지 ☆</div>
          <div className="mt-1">{content.profile.headline}</div>
          <div className="mt-2 text-xs">
            방문자수: [{String(1204).padStart(6, '0')}] · 최종수정: 2026-09-08
          </div>
        </div>
      </Window>

      <Window title="논문 리뷰" {...frame}>
        <ul className="list-disc space-y-1 pl-5">
          {content.papers.map((p) => (
            <li key={p.id}>
              <span className="underline" style={{ color: blue }}>
                {p.title}
              </span>
            </li>
          ))}
          {content.papers.length === 0 ? <li>공사중... 🚧</li> : null}
        </ul>
      </Window>

      <Window title="프로젝트" {...frame}>
        <ul className="list-disc space-y-1 pl-5">
          {content.projects.map((p) => (
            <li key={p.id}>
              <span className="underline" style={{ color: blue }}>
                {p.title}
              </span>{' '}
              — {p.summary}
            </li>
          ))}
        </ul>
      </Window>

      <div className="text-center text-xs">Best viewed in 1024×768 · Netscape Navigator 권장</div>
    </div>
  );
}

export const retro: Concept = {
  id: 'retro',
  name: '레트로 90s',
  tagline: '창 테두리와 방문자 카운터. 기억엔 남지만 위험도 크다.',
  reference: '90년대 개인 홈페이지 · 2026 레트로 UI 회귀',
  render: (props) => <Retro {...props} />,
};
