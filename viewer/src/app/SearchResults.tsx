import { kindLabel, type SearchEntry } from '@viewer/domains/portfolio';

/** 검색 결과 드롭다운. 결과 없음을 분명히 알린다 (스펙 S-5). */
export function SearchResults({
  query,
  results,
  onSelect,
}: {
  query: string;
  results: SearchEntry[];
  onSelect: (entry: SearchEntry) => void;
}) {
  return (
    <div
      className="absolute right-0 z-30 mt-2 w-[min(22rem,80vw)] rounded-md border border-border bg-popover p-2 shadow-lg"
      role="region"
      aria-label="검색 결과"
    >
      {results.length === 0 ? (
        <p className="px-2 py-3 text-sm text-muted-foreground">
          &lsquo;{query}&rsquo; 에 대한 결과가 없습니다.
        </p>
      ) : (
        <ul className="max-h-80 overflow-y-auto">
          {results.map((entry) => (
            <li key={`${entry.kind}:${entry.id}`}>
              <button
                type="button"
                onClick={() => onSelect(entry)}
                className="w-full rounded px-2 py-2 text-left hover:bg-accent"
              >
                <span className="block text-xs text-muted-foreground">{kindLabel(entry.kind)}</span>
                <span className="block text-sm font-medium">{entry.title}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
