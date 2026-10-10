/** UI strings (not content). `en.ts` must have exactly the same shape — tsc enforces it. */
const ko = {
  meta: {
    title: "포트폴리오",
    description:
      "프로젝트, 대외활동, 수상경력, 학회 활동을 모은 포트폴리오입니다.",
  },
  nav: {
    about: "소개",
    projects: "프로젝트",
    activities: "대외활동",
    awards: "수상",
    society: "학회",
    skills: "개발 역량",
    education: "학력",
    connect: "연락처",
  },
  common: {
    languageToggle: "English",
    related: "관련 항목",
    present: "현재",
    backToHome: "홈으로",
    viewDetails: "자세히 보기",
  },
  project: {
    summary: "요약",
    features: "핵심 기능",
    contributions: "내가 한 일",
    techStack: "기술 스택",
    status: "현재 상태",
    outcomes: "결과",
    challenges: "문제와 해결",
    architecture: "구조",
    learnings: "배운 점",
    links: "링크",
    team: "팀 구성",
    period: "기간",
  },
  projectStatus: {
    "in-progress": "진행 중",
    completed: "완료",
    maintained: "운영 중",
    archived: "보관됨",
  },
  deploymentStatus: {
    live: "배포 중",
    "not-deployed": "미배포",
    discontinued: "서비스 종료",
    unknown: "확인 필요",
  },
  footer: {
    rights: "All rights reserved.",
  },
};

export type Dictionary = typeof ko;
export default ko;
