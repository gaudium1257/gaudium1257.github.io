import { useState } from 'react';
import { CONCEPTS } from './concepts';
import { loadContent } from './content';
import { ContactSheet } from './ContactSheet';
import { Sidebar } from './Sidebar';

const content = loadContent();

/**
 * 디자인 시안 비교소 (EP-0005). **로컬 전용이다.**
 *
 * 두 가지 방식으로 본다:
 *  - 전체 보기: 16개를 나란히 놓고 고른다. 하나씩 넘기면 앞 인상이 남아 비교가 흐려진다
 *  - 낱장 보기: 고른 하나를 실제 크기로 확인한다
 */
export function Lab() {
  const [id, setId] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [width, setWidth] = useState<'full' | 'mobile'>('full');

  const current = CONCEPTS.find((c) => c.id === id) ?? null;

  return (
    <div className="flex h-screen" style={{ background: 'var(--lab-chrome)' }}>
      <Sidebar
        concepts={CONCEPTS}
        currentId={current?.id ?? null}
        dark={dark}
        width={width}
        onSelect={setId}
        onShowAll={() => setId(null)}
        onToggleDark={() => setDark((v) => !v)}
        onToggleWidth={() => setWidth((w) => (w === 'full' ? 'mobile' : 'full'))}
      />

      <main className="flex-1 overflow-y-auto">
        {current ? (
          <div className="flex justify-center p-6">
            <div
              className="h-fit min-h-full w-full overflow-hidden shadow-2xl transition-all"
              style={{ maxWidth: width === 'mobile' ? 390 : 1100 }}
            >
              {current.render({ content, dark })}
            </div>
          </div>
        ) : (
          <ContactSheet concepts={CONCEPTS} content={content} dark={dark} onOpen={setId} />
        )}
      </main>
    </div>
  );
}
