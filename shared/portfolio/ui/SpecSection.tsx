import type { SpecItem } from '@portfolio/content';
import { formatPeriod } from '../service/select';
import type { EditingSlots } from '../types';

/** About 의 한 분류. 항목이 없으면 통째로 숨긴다 (스펙 A-3). */
export function SpecSection({
  category,
  label,
  items,
  editing = {},
}: {
  category: string;
  label: string;
  items: SpecItem[];
  editing?: EditingSlots;
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby={`${category}-heading`} className="space-y-3">
      <h2
        id={`${category}-heading`}
        className="eyebrow-rule text-sm font-semibold tracking-wide uppercase"
      >
        {label}
      </h2>
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{item.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatPeriod(item.startedOn, item.endedOn)}
                </span>
              </div>
              {item.organization ? (
                <p className="text-xs text-muted-foreground">{item.organization}</p>
              ) : null}
              {item.description ? (
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              ) : null}
            </div>
            {editing.renderItemAction?.('spec', item.id)}
          </li>
        ))}
      </ul>
    </section>
  );
}
