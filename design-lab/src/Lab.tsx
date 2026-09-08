import { useState } from 'react';
import { CONCEPTS } from './concepts';
import { loadContent } from './content';
import { Sidebar } from './Sidebar';

const content = loadContent();

/**
 * 디자인 시안 비교소 (EP-0005). **로컬 전용이다.**
 *
 * 시안을 하나씩 보여주면 비교가 안 된다 — 목록에서 즉시 갈아끼우고,
 * 같은 조건(같은 콘텐츠·같은 폭·같은 명암)에서 나란히 판단한다.
 */
export function Lab() {
  const [id, setId] = useState(CONCEPTS[0]?.id ?? '');
  const [dark, setDark] = useState(false);
  const [width, setWidth] = useState<'full' | 'mobile'>('full');

  const current = CONCEPTS.find((c) => c.id === id) ?? CONCEPTS[0];
  if (!current) return null;

  return (
    <div className="flex h-screen" style={{ background: 'var(--lab-chrome)' }}>
      <Sidebar
        concepts={CONCEPTS}
        currentId={current.id}
        dark={dark}
        width={width}
        onSelect={setId}
        onToggleDark={() => setDark((v) => !v)}
        onToggleWidth={() => setWidth((w) => (w === 'full' ? 'mobile' : 'full'))}
      />

      <main className="flex flex-1 justify-center overflow-y-auto p-6">
        {/* 미리보기는 실제 뷰포트처럼 흰 판 위에 올린다 — 껍데기 색이 시안에 섞이지 않게 */}
        <div
          className="h-fit min-h-full w-full overflow-hidden shadow-2xl transition-all"
          style={{ maxWidth: width === 'mobile' ? 390 : 1100 }}
        >
          {current.render({ content, dark })}
        </div>
      </main>
    </div>
  );
}
