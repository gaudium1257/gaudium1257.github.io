import type { Concept } from './concepts';

/** 비교소의 조작부. 시안 자체가 아니라 껍데기라서 고정 색을 쓴다 */
export function Sidebar({
  concepts,
  currentId,
  dark,
  width,
  onSelect,
  onShowAll,
  onToggleDark,
  onToggleWidth,
}: {
  concepts: Concept[];
  currentId: string | null;
  dark: boolean;
  width: 'full' | 'mobile';
  onSelect: (id: string) => void;
  onShowAll: () => void;
  onToggleDark: () => void;
  onToggleWidth: () => void;
}) {
  return (
    <aside
      className="flex w-72 shrink-0 flex-col overflow-y-auto"
      style={{ background: 'var(--lab-chrome)', color: 'var(--lab-ink)' }}
    >
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-sm font-semibold">디자인 시안 비교소</h1>
        <p className="mt-1 text-xs" style={{ color: 'var(--lab-dim)' }}>
          로컬 전용 · 배포되지 않습니다
        </p>
      </div>

      <Controls
        dark={dark}
        width={width}
        showingAll={currentId === null}
        onToggleDark={onToggleDark}
        onToggleWidth={onToggleWidth}
        onShowAll={onShowAll}
      />

      <nav className="flex flex-col gap-1 px-3 pb-6">
        {concepts.map((c, i) => (
          <ConceptButton
            key={c.id}
            concept={c}
            n={i + 1}
            active={c.id === currentId}
            onClick={() => onSelect(c.id)}
          />
        ))}
      </nav>
    </aside>
  );
}

/** 보기 방식 조작부 — 명암·폭·전체보기 */
function Controls({
  dark,
  width,
  showingAll,
  onToggleDark,
  onToggleWidth,
  onShowAll,
}: {
  dark: boolean;
  width: 'full' | 'mobile';
  showingAll: boolean;
  onToggleDark: () => void;
  onToggleWidth: () => void;
  onShowAll: () => void;
}) {
  return (
    <>
      <div className="flex gap-2 px-5 pb-2">
        <Toggle label={dark ? '다크' : '라이트'} onClick={onToggleDark} />
        <Toggle label={width === 'mobile' ? '모바일' : '데스크톱'} onClick={onToggleWidth} />
      </div>
      <div className="px-5 pb-4">
        <button
          type="button"
          onClick={onShowAll}
          className="w-full rounded-md px-2 py-2 text-xs font-medium"
          style={{
            background: showingAll ? 'var(--lab-accent)' : 'var(--lab-chrome-soft)',
            color: 'var(--lab-ink)',
          }}
        >
          전체 보기 (16개 한눈에)
        </button>
      </div>
    </>
  );
}

function ConceptButton({
  concept,
  n,
  active,
  onClick,
}: {
  concept: Concept;
  n: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md px-3 py-3 text-left transition-colors"
      style={{
        background: active ? 'var(--lab-chrome-soft)' : 'transparent',
        borderLeft: active ? '3px solid var(--lab-accent)' : '3px solid transparent',
      }}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] tabular-nums" style={{ color: 'var(--lab-dim)' }}>
          {String(n).padStart(2, '0')}
        </span>
        <span className="text-sm font-medium">{concept.name}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--lab-dim)' }}>
        {concept.tagline}
      </p>
      {/* 근거를 같이 보여준다 — 취향이 아니라 어디서 온 형태인지 알고 고르게 */}
      <p className="mt-1 text-[10px]" style={{ color: 'var(--lab-accent)' }}>
        {concept.reference}
      </p>
    </button>
  );
}

function Toggle({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-md px-2 py-1.5 text-xs"
      style={{ background: 'var(--lab-chrome-soft)', color: 'var(--lab-ink)' }}
    >
      {label}
    </button>
  );
}
