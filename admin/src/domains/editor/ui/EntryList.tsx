import type { ContentEntry } from '../types';

export function EntryList({
  entries,
  error,
  selectedId,
  onSelect,
}: {
  entries: ContentEntry[];
  error: string | null;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    );
  }
  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">아직 항목이 없습니다.</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {entries.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelect(entry.id)}
            aria-current={entry.id === selectedId ? 'true' : undefined}
            className={
              entry.id === selectedId
                ? 'block w-full bg-accent px-3 py-2 text-left text-sm font-medium'
                : 'block w-full px-3 py-2 text-left text-sm hover:bg-accent'
            }
          >
            <span className="block truncate">{entry.title || entry.id}</span>
            <span className="block truncate text-xs text-muted-foreground">{entry.id}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
