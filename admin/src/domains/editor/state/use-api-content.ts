import { useCallback, useEffect, useState } from 'react';
import {
  buildIndex,
  visiblePapers,
  visiblePosts,
  visibleProjects,
  visibleSpecs,
  type PortfolioContent,
} from '@portfolio/portfolio';
import {
  blogPostSchema,
  paperReviewSchema,
  profileSchema,
  projectSchema,
  specItemSchema,
} from '@portfolio/content';
import { loadAll } from '../data/content-api';

/**
 * admin 의 콘텐츠 출처: 개발 서버 API (ADR-0003, ADR-0005).
 * viewer 와 달리 편집 즉시 반영되어야 하므로 런타임에 읽는다.
 *
 * **공개 여부 필터를 적용하지 않는다** — 편집자는 비공개 항목도 봐야 한다.
 */
const EMPTY: PortfolioContent = {
  profile: { name: '', headline: '', intro: '', links: [] },
  specs: [],
  papers: [],
  projects: [],
  posts: [],
  searchIndex: [],
};

export function useApiContent() {
  const [content, setContent] = useState<PortfolioContent>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [profile, specs, papers, projects, posts] = await Promise.all([
        loadAll('profile', profileSchema),
        loadAll('spec', specItemSchema),
        loadAll('paper', paperReviewSchema),
        loadAll('project', projectSchema),
        loadAll('post', blogPostSchema),
      ]);
      const sortedPapers = visiblePapers(papers, { includePrivate: true });
      const sortedProjects = visibleProjects(projects, { includePrivate: true });
      const sortedPosts = visiblePosts(posts, { includePrivate: true });
      setContent({
        profile: profile[0] ?? EMPTY.profile,
        specs: visibleSpecs(specs, { includePrivate: true }),
        papers: sortedPapers,
        projects: sortedProjects,
        posts: sortedPosts,
        searchIndex: buildIndex({
          papers: sortedPapers,
          projects: sortedProjects,
          posts: sortedPosts,
        }),
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '콘텐츠를 불러오지 못했습니다.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { content, error, loaded, refresh };
}
