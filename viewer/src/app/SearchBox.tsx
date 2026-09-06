import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button, Input } from '@portfolio/ui';
import { useSearch, type SearchEntry } from '@viewer/domains/portfolio';
import { SearchResults } from './SearchResults';

/**
 * 검색 (스펙 S-1~S-6).
 * - 열면 포커스가 입력으로 이동한다 (S-1)
 * - 검색어는 URL 에 남는다 (S-4) — useSearch 가 처리
 * - Esc 로 닫는다 (S-6)
 */
export function SearchBox({ index }: { index: SearchEntry[] }) {
  const { query, setQuery, results, isActive } = useSearch(index);
  // URL 에 검색어가 있으면 새로고침 후에도 열린 상태를 유지한다
  const [open, setOpen] = useState(() => query.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setQuery('');
  }

  function goTo(entry: SearchEntry) {
    close();
    navigate(entry.path);
  }

  if (!open) {
    return (
      <Button variant="ghost" size="icon" aria-label="검색 열기" onClick={() => setOpen(true)}>
        <Search className="size-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') close();
          }}
          placeholder="논문 · 프로젝트 · 글 검색"
          aria-label="검색어"
          className="h-9 w-44 sm:w-60"
        />
        <Button variant="ghost" size="icon" aria-label="검색 닫기" onClick={close}>
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {isActive ? <SearchResults query={query} results={results} onSelect={goTo} /> : null}
    </div>
  );
}
