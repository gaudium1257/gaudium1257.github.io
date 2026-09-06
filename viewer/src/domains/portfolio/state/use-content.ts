import { useMemo } from 'react';
import {
  buildIndex,
  visiblePapers,
  visiblePosts,
  visibleProjects,
  visibleSpecs,
  type PortfolioContent,
} from '@portfolio/portfolio';
import {
  loadPapers,
  loadPosts,
  loadProfile,
  loadProjects,
  loadSpecs,
} from '../data/content-source';

/**
 * viewer 의 콘텐츠 출처: 빌드 타임 상수 (ADR-0003).
 * 런타임 요청이 없어 로딩 상태가 존재하지 않는다.
 */
export function usePortfolioContent(): PortfolioContent {
  return useMemo(() => {
    const papers = visiblePapers(loadPapers());
    const projects = visibleProjects(loadProjects());
    const posts = visiblePosts(loadPosts());
    return {
      profile: loadProfile(),
      specs: visibleSpecs(loadSpecs()),
      papers,
      projects,
      posts,
      searchIndex: buildIndex({ papers, projects, posts }),
    };
  }, []);
}
