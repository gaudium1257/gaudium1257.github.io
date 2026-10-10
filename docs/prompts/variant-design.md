# Variant 디자인 요청 프롬프트

[Variant](https://variant.com)에 붙여넣어 포트폴리오 사이트의 1차 디자인 시안을 뽑기 위한 프롬프트입니다.

- Variant는 영어 프롬프트에서 결과가 더 안정적이라 본문은 영어로 썼습니다. 시안에 들어가는 예시 문구는 한국어로 나오게 지정해 두었습니다.
- **1번(메인 화면)** 을 먼저 넣고 마음에 드는 방향이 나오면, 같은 스레드에서 **2번(프로젝트 상세)** 과 **3번(모바일)** 을 이어서 요청하세요.
- 예시 내용(홍길동, 가상의 프로젝트)은 화면을 채우기 위한 가짜 데이터입니다. 실제 내용은 구현할 때 `content/`에서 들어갑니다.
- 고른 시안은 스크린샷이나 내보낸 코드로 전달해 주시면, 그 디자인을 기준으로 구현합니다.

---

## 1. 메인 화면 (데스크톱)

```text
Design a personal portfolio website for a Korean university student developer who works on AI and web projects, and runs an academic society that teaches AI and vibe coding and organizes hackathons. The site is bilingual (Korean / English) and this screen shows the Korean version on desktop (1440px wide).

WHO READS IT AND WHY
Recruiters, hackathon judges and potential collaborators. They skim for 30 seconds, then jump straight to one thing: a specific project, the awards, or contact info. The design must make every section reachable in one click and keep the page short. No endless scrolling.

NAVIGATION (most important)
- Persistent navigation that is always visible: either a fixed left sidebar (name, one-line headline, section links, contact icons, language toggle) with content on the right, or a sticky top bar. The current section is highlighted as you scroll (scroll-spy).
- Sections in this order: 소개, 프로젝트, 대외활동, 수상, 학회, 개발 역량, 학력, 연락처.
- A "KO / EN" language toggle that is always visible.
- Each section is compact: show the most important 3–4 items, plus a "전체 보기" link/expander for the rest. Nothing should require a long scroll to get past.
- Projects can be filtered with chips (전체 · 개인 · 팀 · 해커톤 · 학회) and by tech tag.
- Items link to each other: a project card shows small chips like "🏆 OO 해커톤 대상" or "학회 해커톤" that link to the related award or activity, and vice versa.

SECTIONS AND CONTENT
1. 소개: name, one-line headline, 1–2 sentence intro, and 3 quick stats in small tiles (e.g. projects count, awards count, hackathons organized). No large hero image; get to the content fast.
2. 프로젝트: card grid. Each card has a thumbnail, title, one-line tagline, category badge (개인/팀/해커톤), status badge (배포 중 / 완료 / 진행 중), 3–4 tech tags, period, and related-award chip if any. Clicking a card opens the project detail page.
3. 대외활동: compact timeline or list. Title, organization, period, role, one line of what was done, links to related projects.
4. 수상: compact list. Prize level (대상, 최우수상…), competition name, organizer, date, link to the related project.
5. 학회: society name and short description, my roles over time (e.g. 교육팀장 → 회장), and a small grid/timeline of events I ran: AI 교육, 바이브코딩 교육, 해커톤 — each with date, my role and type badge.
6. 개발 역량: skills grouped by category (Language, Frontend, Backend, AI/ML, Infra, Tools). Plain tags/icons, no progress bars or percentage ratings. Hovering a skill can show which projects used it.
7. 학력: school, major, period, status (재학 중 / 졸업).
8. 연락처: GitHub, Email, Instagram, Discord as clear buttons with icons, and a copy-to-clipboard for the email.
Footer: "© 2026 홍길동. All rights reserved."

VISUAL STYLE
- Theme color: purple. Use one primary purple (around #7C3AED) with a tinted neutral palette (very light lavender-gray surfaces, near-black purple-tinted text). Purple for accents, active nav, links and badges; not for large blocks of body text.
- Readability first: body text 16–17px, line height ~1.7, line length under ~70 characters, clear heading hierarchy, high contrast (WCAG AA), generous whitespace.
- Typography that works for both Korean and English, e.g. Pretendard.
- Clean, modern and calm, not flashy. Subtle borders and soft shadows on cards, rounded corners, restrained motion.
- Light mode. Keep it easy to derive a dark mode later.

SAMPLE CONTENT (fictional placeholder, write it in Korean)
Name 홍길동, headline "AI와 웹으로 문제를 푸는 개발자". Projects such as "스터디 타이머" (팀 · 해커톤 · Next.js, Supabase), "강의 요약 챗봇" (개인 · Python, FastAPI, OpenAI API), "학회 출석 관리 서비스" (학회 · React, Firebase). Awards such as "OO 해커톤 대상". Society events such as "바이브코딩 입문 교육 (2025-03)", "교내 AI 해커톤 운영 (2025-08)".
```

## 2. 프로젝트 상세 화면 (같은 스레드에서 이어서)

```text
Now design the project detail page in the same style, desktop 1440px, Korean.

The persistent navigation stays visible, with a clear "← 프로젝트 목록" back link. The page must be scannable without long scrolling:
- Header: title, tagline, badges (category, status, deployment status like "배포 중 · Vercel"), period, team size and my role, and primary buttons (GitHub, 데모, 발표 자료).
- A sticky table of contents (on the side) for: 요약, 핵심 기능, 내가 한 일, 구조, 기술 스택, 문제와 해결, 결과, 배운 점, 관련 항목.
- 핵심 기능: 3–5 feature cards with a short title and one-sentence description.
- 내가 한 일: a concise bullet list, visually distinct because it's what recruiters look for.
- 기술 스택: grouped tags.
- 문제와 해결: problem → solution pairs.
- 결과: short bullets (awards, demos, users), each with an optional link.
- Screenshot gallery that doesn't push other content far down (e.g. a carousel or a compact grid).
- 관련 항목: chips linking to related awards, activities and society events.
- Previous / next project links at the bottom.
```

## 3. 모바일 (같은 스레드에서 이어서)

```text
Now show the main page on mobile (375px wide), same style and content, Korean.

- Navigation collapses into a compact sticky top bar with name, KO/EN toggle and a menu button, and/or a horizontally scrollable row of section tabs that highlights the current section. Every section must stay one tap away.
- Cards stack in one column; project filter chips scroll horizontally.
- Long lists stay collapsed behind "전체 보기".
- Contact buttons are large enough to tap (at least 44px).
- No horizontal page scrolling anywhere.
```
