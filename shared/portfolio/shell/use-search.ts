import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search, type SearchEntry } from '../service/search';

/**
 * 검색 상태는 URL 에 둔다 — 공유·새로고침·뒤로가기가 동작해야 한다 (스펙 S-4, GR-5).
 */
export function useSearch(index: SearchEntry[]) {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';

  const setQuery = useCallback(
    (next: string) => {
      const updated = new URLSearchParams(params);
      if (next) updated.set('q', next);
      else updated.delete('q');
      // 검색어 입력마다 히스토리를 쌓지 않는다 — 뒤로가기가 한 글자씩 되돌아가면 못 쓴다
      setParams(updated, { replace: true });
    },
    [params, setParams],
  );

  const results = useMemo(() => search(index, query), [index, query]);

  return { query, setQuery, results, isActive: query.trim().length > 0 };
}
