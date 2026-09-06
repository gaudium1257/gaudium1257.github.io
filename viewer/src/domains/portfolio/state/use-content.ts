import { useMemo } from 'react';
import type { BlogPost, PaperReview, Profile, Project, SpecItem } from '@portfolio/content';
import {
  loadPapers,
  loadPosts,
  loadProfile,
  loadProjects,
  loadSpecs,
} from '../data/content-source';
import { visiblePapers, visiblePosts, visibleProjects, visibleSpecs } from '../service/select';
import { buildIndex, type SearchEntry } from '../service/search';

/**
 * 런타임 상태 레이어. 콘텐츠는 빌드 타임 상수라 로딩 상태가 없다 (ADR-0003).
 */
export interface PortfolioContent {
  profile: Profile;
  specs: SpecItem[];
  papers: PaperReview[];
  projects: Project[];
  posts: BlogPost[];
  searchIndex: SearchEntry[];
}

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
