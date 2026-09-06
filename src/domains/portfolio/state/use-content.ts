import { useMemo } from 'react';
import { loadPosts, loadProfile, loadProjects } from '../data/content-source';
import { visiblePosts, visibleProjects } from '../service/select';
import type { Post, Profile, Project } from '@/shared/content';

/**
 * 런타임 상태 레이어. 콘텐츠는 빌드 타임 상수라 로딩 상태가 없다 (ADR-0003).
 */
export interface PortfolioContent {
  profile: Profile;
  projects: Project[];
  posts: Post[];
}

export function usePortfolioContent(): PortfolioContent {
  return useMemo(
    () => ({
      profile: loadProfile(),
      projects: visibleProjects(loadProjects()),
      posts: visiblePosts(loadPosts()),
    }),
    [],
  );
}
