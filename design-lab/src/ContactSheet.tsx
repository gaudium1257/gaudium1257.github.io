import type { Concept } from './concepts';
import type { LabContent } from './content';

/** 축소 비율. 1100px 짜리 시안을 이 배율로 줄여 격자에 올린다 */
const SCALE = 0.32;
const FRAME_W = 1100;
const FRAME_H = 820;

/**
 * 전체 보기 — 16개를 한 화면에 늘어놓는다 (EP-0005).
 *
 * 하나씩 넘겨 보면 앞 시안의 인상이 남아 비교가 흐려진다.
 * **나란히 놓아야 고를 수 있다.** 각 칸은 실제 시안을 그대로 축소한 것이라
 * 따로 스크린샷을 관리할 필요가 없다 — 코드를 고치면 이 화면도 같이 바뀐다.
 */
export function ContactSheet({
  concepts,
  content,
  dark,
  onOpen,
}: {
  concepts: Concept[];
  content: LabContent;
  dark: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-3">
      {concepts.map((concept, i) => (
        <Thumb
          key={concept.id}
          concept={concept}
          n={i + 1}
          content={content}
          dark={dark}
          onOpen={() => onOpen(concept.id)}
        />
      ))}
    </div>
  );
}

function Thumb({
  concept,
  n,
  content,
  dark,
  onOpen,
}: {
  concept: Concept;
  n: number;
  content: LabContent;
  dark: boolean;
  onOpen: () => void;
}) {
  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full overflow-hidden rounded-lg text-left"
        style={{
          height: FRAME_H * SCALE,
          background: 'var(--lab-thumb)',
          border: '1px solid var(--lab-edge)',
        }}
        aria-label={`${concept.name} 시안 크게 보기`}
      >
        {/*
         * 시안은 자기 폭(1100px)에서 그려진 뒤 축소된다.
         * 컨테이너를 줄이면 시안의 반응형이 발동해 데스크톱 모습이 안 나온다.
         */}
        <div
          style={{
            width: FRAME_W,
            height: FRAME_H,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
            pointerEvents: 'none',
          }}
        >
          {concept.render({ content, dark })}
        </div>
      </button>

      <figcaption className="pt-2" style={{ color: 'var(--lab-ink)' }}>
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] tabular-nums" style={{ color: 'var(--lab-dim)' }}>
            {String(n).padStart(2, '0')}
          </span>
          <span className="text-sm font-medium">{concept.name}</span>
        </div>
        <p className="mt-0.5 text-xs" style={{ color: 'var(--lab-dim)' }}>
          {concept.tagline}
        </p>
      </figcaption>
    </figure>
  );
}
