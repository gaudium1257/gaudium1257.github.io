# Variant 디자인 요청 프롬프트

[Variant](https://variant.com)에서 포트폴리오 사이트의 1차 디자인 시안을 뽑기 위한 프롬프트입니다.

## 사용법

- **1단계 — 방향 탐색:** 아래 A~G는 레이아웃 구조 자체가 서로 다른 방향입니다. **방향마다 새 스레드**에서 하나씩 넣어야 앞 결과에 끌려가지 않습니다. 마음에 드는 방향 1~2개를 고르세요.
- **2단계 — 다듬기:** 고른 방향의 스레드에서 "상세 페이지", "모바일" 후속 프롬프트를 이어서 넣습니다.
- 공통 조건(섹션 구성, 한 번 클릭으로 이동, 가독성, 보라색)은 모든 프롬프트에 짧게만 넣었습니다. 레이아웃·색감·타이포를 구체적으로 못 박으면 시안이 전부 비슷해지기 때문입니다.
- 본문은 영어(Variant가 더 안정적), 시안 속 문구는 한국어로 나오게 했습니다. 홍길동과 프로젝트들은 화면을 채우기 위한 **가짜 데이터**입니다.
- 고른 시안은 스크린샷이나 내보낸 코드로 전달해 주세요. 그 디자인을 기준으로 구현합니다.

---

## 1단계 — 방향별 탐색 프롬프트

### A. 벤토 대시보드 — 한 화면 요약

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: a BENTO GRID DASHBOARD. The whole home page fits in about one screen as a grid of tiles in different sizes — a big intro tile, a wide featured-project tile, small tiles for award count, latest society event, skills cloud, contact. Each tile is a summary; clicking it opens that section's full view. No traditional navigation bar — the grid itself is the navigation.
Style: light, airy lavender surfaces, playful but tidy, large radius tiles, one bold violet accent tile.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### B. 탭 앱 — 스크롤 없는 화면 전환

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: it feels like an APP, not a web page. A compact header with the name and a segmented tab bar; only one section is shown at a time inside a fixed-height content area, and switching tabs swaps the content with a smooth transition. The page itself never scrolls; long lists scroll inside their panel or open in a side drawer. Projects show as a list on the left with a live preview pane on the right.
Style: dark mode, deep violet-black background, soft purple highlights, crisp UI-like components.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### C. 에디토리얼 매거진 — 큰 타이포와 목차

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: an EDITORIAL MAGAZINE. The hero is a huge typographic name next to a numbered table of contents (01 소개, 02 프로젝트 …) that doubles as the navigation. Asymmetric grid, generous margins, projects presented like magazine features with a large number, title and short deck. A thin sticky index bar appears after scrolling past the hero.
Style: off-white paper background, near-black text, purple used like ink for numbers, rules and links only. Serif display headlines paired with a clean sans body.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### D. 개발자 툴 — 커맨드 팔레트 / 에디터 느낌

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: inspired by a CODE EDITOR / DEVELOPER TOOL. A file-tree style explorer on the left (소개.md, projects/, awards/ …), content opens like editor tabs, and a ⌘K command palette lets visitors jump to any project, award or section by typing. A slim status bar at the bottom shows the language toggle and contact links. It must still read as a friendly portfolio, not a fake terminal — body text stays in a readable sans font.
Style: dark, neutral charcoal with electric purple accents and subtle glow, monospace only for labels and metadata.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### E. 타임라인 중심 — 활동 간 연결을 한눈에

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: TIMELINE-FIRST. Below a short intro, one horizontal master timeline (by month/semester) plots projects, 대외활동, awards and society events together as colored lanes, so it's visible that a hackathon project led to an award during a society event. Filter toggles turn lanes on and off; clicking an item opens a detail card beside the timeline. Skills, education and contact sit in a compact strip below.
Style: clean light UI, each lane a different tint of purple/violet/indigo, information-dense but calm.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### F. 플레이풀 — 그라디언트와 하단 독 내비게이션

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version, desktop. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동". Visitors (recruiters, hackathon judges) must reach any section in one click and never face a long scroll. Readable Korean typography, purple as the brand color.

Layout concept: PLAYFUL AND EXPRESSIVE. A floating dock at the bottom of the screen (like the macOS dock) holds icon buttons for every section and the language toggle. Big friendly intro with a 3D or illustrated avatar, projects as a horizontally swipeable row of large tilted cards, awards as sticker-like badges, society events as colorful event tickets.
Style: soft purple-to-pink gradients, frosted glass panels, chunky rounded shapes, still with high-contrast readable text.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

### G. 자유 탐색 — 구조를 Variant에 맡기기

```text
Personal portfolio website for a Korean university student developer (AI + web projects; runs an academic society that teaches AI and vibe coding and organizes hackathons). Bilingual with a visible KO/EN toggle; show the Korean version. Sections: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처 (GitHub, Email, Instagram, Discord), footer "© 2026 홍길동".

Only three hard requirements: any section is one click away, no long scrolling, readable Korean text. Purple is the brand color, but any shade, mood and layout is welcome. Explore radically different layout ideas rather than a standard sidebar + card grid — surprise me.

Fictional sample content in Korean: 홍길동, "AI와 웹으로 문제를 푸는 개발자". Projects: 스터디 타이머 (팀·해커톤, Next.js/Supabase), 강의 요약 챗봇 (개인, FastAPI/OpenAI API), 학회 출석 관리 서비스 (학회, React/Firebase). Award: OO 해커톤 대상. Society events: 바이브코딩 입문 교육, 교내 AI 해커톤 운영.
```

---

## 2단계 — 고른 방향 다듬기 (같은 스레드에서 이어서)

### 프로젝트 상세 화면

```text
Now design the project detail view in exactly this style and layout system, Korean, desktop.

It must be scannable without long scrolling and keep a clear way back to the project list. Include: title, tagline, badges (category, status, "배포 중 · Vercel"), period, team size and my role, buttons (GitHub, 데모, 발표 자료); 요약; 핵심 기능 (3–5 short items); 내가 한 일 (visually emphasized — recruiters look for this); 구조; 기술 스택; 문제와 해결 (problem → solution pairs); 결과; 배운 점; a screenshot gallery that doesn't push content far down; 관련 항목 chips linking to related awards, activities and society events; previous / next project.
```

### 모바일

```text
Now show the main page on mobile (375px wide) in exactly this style, Korean.

Every section stays one tap away, the KO/EN toggle stays visible, long lists stay collapsed, tap targets are at least 44px, and there is no horizontal page scrolling.
```
