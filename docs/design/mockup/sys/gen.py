#!/usr/bin/env python3
""""Moving Poster" mockups from one source.

python3 gen.py proto            -> proto/sys-{home,detail,list}-{ko,en}/index.html (static Tailwind pages + vanilla JS)
python3 gen.py dc <css-blob>    -> design2/project/*.dc.html (12 canvas artboards, same markup, DCLogic state)
"""
import html as _h
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCR = os.path.dirname(HERE)
PROTO = os.path.join(SCR, "proto")
FONT_BLOB = "/_blob/76760fbe63bd614486cd18b85bb00898"

MODE = "proto"  # or "dc"
CTX = {}  # loc, page, mobile


def esc(s):
    return _h.escape(s, quote=True)


def cls(*parts):
    return " ".join(p for p in parts if p)


def loc():
    return CTX["loc"]


def t(d):
    return d[loc()] if isinstance(d, dict) else d


def A(proto, dc):
    """Attribute string that differs between the static page and the canvas artboard."""
    s = proto if MODE == "proto" else dc
    return (" " + s) if s else ""


# ───────────────────────────── strings ─────────────────────────────
S = {
    "ko": dict(
        skip="본문으로 건너뛰기", nav_label="섹션 바로가기", logo_label="홍길동, 맨 위로", lang_label="언어 선택",
        motion_pause="움직임 멈추기",
        nav=dict(about="소개", projects="프로젝트", activities="대외활동", awards="수상", society="학회", skills="개발 역량", education="학력", connect="연락처"),
        count="{n}개", view_all="프로젝트 {n}개 모두 보기", related="관련", used_in="사용",
        copy="복사", copied="복사됨", copy_failed="복사 실패", copy_failed_hint="복사하지 못했어요. 선택된 글자를 직접 복사해 주세요.",
        copy_email_sr=("이메일 주소 ", ""), copy_discord_sr=("Discord 사용자명 ", ""),
        copied_email="이메일 주소를 복사했습니다.", copied_discord="Discord 사용자명을 복사했습니다.",
        back_to_top="맨 위로", on_this_page="이 페이지", problem="문제", solution="해결",
        prev="이전 프로젝트", next="다음 프로젝트", other_projects="다른 프로젝트", all_projects="프로젝트 목록", back_home="홈", new_tab="(새 탭)",
        present="현재", enrolled="재학 중", live="배포 중",
        cta_projects="프로젝트 보기", cta_contact="연락하기",
        photo_tag="증명사진 3:4", photo_label="증명사진 자리 (3:4)",
        facts=dict(affil="소속", society="학회", email="이메일", github="GitHub"),
        affil="한국대학교 컴퓨터공학과 재학 중", society_role="THE LAB 교육팀장",
        phrase=dict(team_hackathon="해커톤 팀 프로젝트", club="학회 프로젝트", personal="개인 프로젝트"),
        kind=dict(project="프로젝트", activity="대외활동", award="수상", society="학회", event="학회 행사"),
        event_type=dict(seminar="세미나", hackathon="해커톤", education="교육"),
        lab_desc="AI와 바이브코딩을 가르치고 해커톤을 운영하는 학회",
        tech_cat={"frontend": "프론트엔드", "backend": "백엔드", "ai-ml": "AI"},
        contact=dict(email="이메일", github="GitHub", instagram="Instagram", discord="Discord"),
        footer="© 2026 홍길동",
        d_sections=dict(summary="요약", contributions="내가 한 일", screens="화면", features="핵심 기능", tech="기술 스택", outcomes="결과", challenges="문제와 해결", related="관련 항목"),
        d_facts=dict(period="기간", kind="종류", team="팀", role="역할", status="진행 상태", deploy="배포"),
        ph=dict(summary="[요약 — 팩트시트]", contrib="[내가 한 일 {n}]", feature="[핵심 기능 {n}]", feature_desc="[설명]", problem="[문제]", solution="[해결]",
                team="[인원]", role="[역할]", status="[진행 상태]", deploy_detail="[플랫폼], [확인 시점] 확인", demo="데모 열기", github="GitHub에서 코드 보기", link="[링크]",
                caption="[화면 설명 — 팩트시트]"),
        award_outcome_suffix="(OO재단, 2025.05)",
        slot=dict(web="화면 캡처 16:10", mobile="휴대폰 화면 9:19.5", photo="사진 4:3"),
        slot_aria=dict(web="프로젝트 화면 자리 (16:10)", mobile="휴대폰 화면 자리 (9:19.5)", photo="사진 자리 (4:3)"), cover_aria="행사 사진 자리 (칸에 맞춰 잘림)", cover_label="행사 사진",
        media_kind=dict(web="웹 화면", mobile="휴대폰 화면", photo="사진"), media_short=dict(web="웹", mobile="휴대폰", photo="사진"),
        all_screens="화면 {n}개 모두 보기", more_screens="화면 더 보기 ({n})",
        title_home="홍길동 포트폴리오", title_detail="스터디 타이머 · 홍길동", title_list="프로젝트 · 홍길동",
    ),
    "en": dict(
        skip="Skip to content", nav_label="Sections", logo_label="Gildong Hong, back to top", lang_label="Language",
        motion_pause="Pause motion",
        nav=dict(about="About", projects="Projects", activities="Activities", awards="Awards", society="Society", skills="Skills", education="Education", connect="Connect"),
        count="{n}", view_all="See all {n} projects", related="Related", used_in="Used in",
        copy="Copy", copied="Copied", copy_failed="Copy failed", copy_failed_hint="Couldn’t copy. The text is selected, so copy it by hand.",
        copy_email_sr=("", " email address"), copy_discord_sr=("", " Discord username"),
        copied_email="Email address copied.", copied_discord="Discord username copied.",
        back_to_top="Back to top", on_this_page="On this page", problem="Problem", solution="Solution",
        prev="Previous project", next="Next project", other_projects="Other projects", all_projects="All projects", back_home="Home", new_tab="(new tab)",
        present="Present", enrolled="Enrolled", live="Live",
        cta_projects="View projects", cta_contact="Contact",
        photo_tag="ID photo 3:4", photo_label="ID photo slot (3:4)",
        facts=dict(affil="Affiliation", society="Society", email="Email", github="GitHub"),
        affil="Computer Science and Engineering, Hankuk University (enrolled)", society_role="THE LAB, Head of Education",
        phrase=dict(team_hackathon="Team project at a hackathon", club="Society project", personal="Solo project"),
        kind=dict(project="Project", activity="Activity", award="Award", society="Society", event="Society event"),
        event_type=dict(seminar="Seminar", hackathon="Hackathon", education="Education"),
        lab_desc="A society that teaches AI and vibe coding and runs hackathons",
        tech_cat={"frontend": "Frontend", "backend": "Backend", "ai-ml": "AI"},
        contact=dict(email="Email", github="GitHub", instagram="Instagram", discord="Discord"),
        footer="© 2026 Gildong Hong",
        d_sections=dict(summary="Summary", contributions="What I did", screens="Screens", features="Key features", tech="Tech stack", outcomes="Outcomes", challenges="Problems & solutions", related="Related"),
        d_facts=dict(period="Period", kind="Kind", team="Team", role="Role", status="Status", deploy="Deployment"),
        ph=dict(summary="[Summary — fact sheet]", contrib="[What I did {n}]", feature="[Key feature {n}]", feature_desc="[Description]", problem="[Problem]", solution="[Solution]",
                team="[Team size]", role="[Role]", status="[Status]", deploy_detail="on [Platform], checked [date]", demo="Open demo", github="View code on GitHub", link="[link]",
                caption="[Caption — fact sheet]"),
        award_outcome_suffix="(OO Foundation, 2025.05)",
        slot=dict(web="Screenshot 16:10", mobile="Phone screen 9:19.5", photo="Photo 4:3"),
        slot_aria=dict(web="Project screenshot slot (16:10)", mobile="Phone screenshot slot (9:19.5)", photo="Photo slot (4:3)"), cover_aria="Event photo slot (cropped to fit)", cover_label="Event photo",
        media_kind=dict(web="Web screen", mobile="Phone screen", photo="Photo"), media_short=dict(web="Web", mobile="Phone", photo="Photo"),
        all_screens="See all {n} screens", more_screens="More screens ({n})",
        title_home="Gildong Hong — Portfolio", title_detail="Study Timer · Gildong Hong", title_list="Projects · Gildong Hong",
    ),
}


def s(key):
    return S[loc()][key]


NAV_IDS = ["about", "projects", "activities", "awards", "society", "skills", "education", "connect"]

# ───────────────────────────── content (fictional sample, proto/content.md) ─────────────────────────────
NAME = {"ko": "홍길동", "en": "Gildong Hong"}
ROLES = [
    ("dev", {"ko": "AI·웹 개발", "en": "Builds AI and web apps"}),
    ("education", {"ko": "AI·바이브코딩 교육", "en": "Teaches AI and vibe coding"}),
    ("hackathon", {"ko": "해커톤 운영", "en": "Runs hackathons"}),
]
INTRO = {
    "ko": "일상의 불편을 작은 서비스로 풀어내는 개발자입니다. AI와 웹으로 만들고, 학회에서 바이브코딩을 가르칩니다.",
    "en": "I’m a developer who turns everyday inconveniences into small services. I build with AI and the web, and teach vibe coding at THE LAB.",
}
EMAIL, GITHUB, INSTA, DISCORD = "hong@example.com", "gaudium1257", "gildong.dev", "gildong"

PROJECTS = [
    dict(id="study-timer", kind="project", title={"ko": "스터디 타이머", "en": "Study Timer"},
         tagline={"ko": "함께 공부하는 시간을 기록하는 웹앱", "en": "A web app that records time spent studying together"},
         form="team", category="hackathon", start="2025-03", end="2025-06", live=True, featured=True,
         tech=[("frontend", "Next.js"), ("backend", "Supabase")], motif="clock"),
    dict(id="attendance", kind="project", title={"ko": "학회 출석 관리 서비스", "en": "Society Attendance Service"},
         tagline={"ko": "학회 세션 출석을 QR로 기록", "en": "Records attendance at society sessions with QR codes"},
         form=None, category="club", start="2025-01", end="2025-02", live=False, featured=False,
         tech=[("frontend", "React"), ("backend", "Firebase")], motif="grid"),
    dict(id="lecture-bot", kind="project", title={"ko": "강의 요약 챗봇", "en": "Lecture Summary Chatbot"},
         tagline={"ko": "강의 자료를 요약하고 질문에 답하는 챗봇", "en": "A chatbot that summarizes lecture materials and answers questions"},
         form="personal", category=None, start="2024-09", end="2024-12", live=False, featured=False,
         tech=[("backend", "FastAPI"), ("ai-ml", "OpenAI API")], motif="bubble"),
]
ACTIVITIES = [
    dict(id="act-oo-hackathon", kind="activity", type="competition", title={"ko": "OO 해커톤 참가", "en": "OO Hackathon (participant)"},
         org={"ko": "OO재단", "en": "OO Foundation"}, role={"ko": "프론트엔드", "en": "Frontend"}, start="2025-05"),
    dict(id="act-startup-club", kind="activity", type="community", title={"ko": "교내 창업 동아리", "en": "Campus Startup Club"},
         org={"ko": "한국대학교", "en": "Hankuk University"}, role={"ko": "기획", "en": "Planning"}, start="2024-03", end="2024-12"),
]
AWARDS = [
    dict(id="award-oo-hackathon", kind="award", title={"ko": "OO 해커톤", "en": "OO Hackathon"}, prize={"ko": "대상", "en": "Grand Prize"},
         org={"ko": "OO재단", "en": "OO Foundation"}, start="2025-05"),
    dict(id="award-sw-contest", kind="award", title={"ko": "교내 SW 경진대회", "en": "Campus SW Contest"}, prize={"ko": "우수상", "en": "Excellence Award"},
         org={"ko": "한국대학교", "en": "Hankuk University"}, start="2024-11"),
]
SOCIETY = dict(id="the-lab", kind="society", title="THE LAB",
               desc={"ko": "AI 교육 · 바이브코딩 교육 · 해커톤 운영", "en": "AI education · Vibe-coding education · Hackathon operations"},
               roles=[({"ko": "교육팀장", "en": "Head of Education"}, "2025-03", None),
                      ({"ko": "교육팀원", "en": "Education team member"}, "2024-09", "2025-02")])
EVENTS = [
    dict(id="evt-ai-seminar", kind="event", type="seminar", title={"ko": "AI 세미나", "en": "AI Seminar"}, role={"ko": "발표", "en": "Speaker"}, start="2025-11"),
    dict(id="evt-ai-hackathon", kind="event", type="hackathon", title={"ko": "교내 AI 해커톤 운영", "en": "Campus AI Hackathon operations"}, role={"ko": "운영총괄", "en": "Lead organizer"}, start="2025-08"),
    dict(id="evt-vibe-intro", kind="event", type="education", title={"ko": "바이브코딩 입문 교육", "en": "Intro to Vibe Coding"}, role={"ko": "강사", "en": "Instructor"}, start="2025-03"),
]
SKILLS = [
    ("frontend", ["Next.js", "React", "TypeScript"]),
    ("backend", ["FastAPI", "Supabase", "Firebase"]),
    ("ai-ml", ["OpenAI API"]),
]
EDU = dict(school={"ko": "한국대학교", "en": "Hankuk University"}, major={"ko": "컴퓨터공학과", "en": "Computer Science and Engineering"}, start="2024-03")
EDGES = [("study-timer", "award-oo-hackathon"), ("study-timer", "act-oo-hackathon")]  # content.md: 스터디 타이머 관련 only
# Media per project, by KIND only: real files are owner-supplied captures; the mockup shows honest labelled slots.
# Cover = first web item; the featured/detail poster also shows the first phone item. No media -> motif cover.
MEDIA = {"study-timer": ["web", "mobile", "mobile", "web"], "attendance": ["web"], "lecture-bot": []}
EVENT_PHOTO = {"evt-ai-hackathon"}  # events whose tile shows a (placeholder) photo instead of shape art

INDEX = {x["id"]: x for x in PROJECTS + ACTIVITIES + AWARDS + EVENTS + [SOCIETY]}
KIND_ORDER = ["project", "award", "activity", "event", "society"]


def related(i):
    out = [b if a == i else a for a, b in EDGES if i in (a, b)]
    return sorted(out, key=lambda r: KIND_ORDER.index(INDEX[r]["kind"]))


def title_of(it):
    if it["kind"] == "award":
        return f'{t(it["title"])} {t(it["prize"])}'
    return t(it["title"])


def ym(v):
    y, m = v.split("-")[:2]
    return f"{y}.{m}"


def period(start, end=None, open_label=None):
    if end is None and open_label is None:
        return ym(start)
    return f"{ym(start)}\u00a0–\u00a0{ym(end) if end else open_label}"


def form_label(p):
    """A plain phrase a visitor understands ("해커톤 팀 프로젝트"), not the schema's form/category enums."""
    if p["form"] == "team" and p["category"] == "hackathon":
        return s("phrase")["team_hackathon"]
    if p["category"] == "club":
        return s("phrase")["club"]
    return s("phrase")["personal"]


# ───────────────────────────── links ─────────────────────────────
BOARD = {"home": "Main", "detail": "Project", "list": "Projects"}


def page_href(page, lc=None, hash_=None):
    lc = lc or loc()
    if page == CTX["page"] and lc == loc():
        return f"#{hash_}" if hash_ else ("#about" if page == "home" else "#main")
    if MODE == "proto":
        return f"../sys-{page}-{lc}/index.html" + (f"#{hash_}" if hash_ else "")
    name = BOARD[page] if page == "home" or not CTX["mobile"] else f"{BOARD[page]}-mobile"
    if page == "home" and CTX["mobile"]:
        name = "Mobile"
    return name + ("-en" if lc == "en" else "") + ".dc.html"


def item_href(i):
    it = INDEX[i]
    if it["kind"] == "project":
        return page_href("detail")  # the canvas has one detail sample (Study Timer)
    target = "society" if it["kind"] == "society" else i
    return page_href("home", hash_=target)


# ───────────────────────────── shape vocabulary ─────────────────────────────
HOV = "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-snap"
HOV5 = "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap"
FC = "forced-colors:bg-[CanvasText]"

KEY = {
    "dev": "size-3 rounded-full bg-primary",
    "education": "size-3 bg-ink",
    "hackathon": "tri size-3.5 bg-primary",
    "seminar": "h-2 w-3.5 rounded-t-full bg-ink",
    "study": "size-3 rounded-tl-full bg-primary",
    "other": "size-3 rotate-45 scale-75 bg-ink",
}
KEY_DARK = {
    "education": "size-3 bg-white",
    "hackathon": "tri size-3.5 bg-primary-300",
    "seminar": "h-2 w-3.5 rounded-t-full bg-white",
}


def key_glyph(kind, dark=False):
    return f'<span aria-hidden="true" class="{cls("shrink-0", (KEY_DARK if dark else KEY)[kind], FC)}"></span>'


def kind_mark(c, size="size-12"):
    """48px collection emblem next to every h2 (64px on the list page). Percent geometry so it scales."""
    base = f"relative {size} shrink-0 overflow-hidden"
    m = {
        "projects": ("bg-ink", '<span class="absolute bottom-[8%] left-[8%] size-2/3 rounded-full bg-primary"></span><span class="absolute right-0 top-0 size-1/3 rounded-bl-full bg-primary-300"></span>'),
        "activities": ("bg-primary-100", '<span class="tri absolute inset-x-[8%] bottom-0 top-[17%] bg-ink"></span>'),
        "awards": ("grid place-items-center bg-ink", '<span class="grid size-2/3 place-items-center rounded-full bg-primary"><span class="size-[38%] rounded-full bg-white"></span></span>'),
        "society": ("bg-white", '<span class="absolute left-0 top-0 size-[58%] bg-ink"></span><span class="absolute bottom-0 right-0 size-[58%] bg-primary"></span>'),
        "skills": ("grid grid-cols-2 grid-rows-2", '<span class="rounded-br-full bg-ink"></span><span class="rounded-bl-full bg-primary"></span><span class="rounded-tr-full bg-primary-300"></span><span class="rounded-tl-full bg-primary-700"></span>'),
        "education": ("bg-primary-50", '<span class="absolute inset-x-[8%] top-[17%] h-[42%] rounded-t-full bg-primary"></span><span class="absolute inset-x-[8%] bottom-[17%] h-[17%] bg-ink"></span><span class="absolute bottom-[33%] left-1/4 top-[58%] w-[12%] bg-ink"></span><span class="absolute bottom-[33%] right-1/4 top-[58%] w-[12%] bg-ink"></span>'),
        "connect": ("", '<span class="absolute left-0 top-[17%] size-2/3 rounded-full bg-ink"></span><span class="absolute right-0 top-[17%] size-2/3 rounded-full bg-primary"></span>'),
    }[c]
    return f'<span aria-hidden="true" class="{cls(base, m[0])}">{m[1]}</span>'


def kind_mark_sm(kind, dark=False, ref=None):
    """14px mark of the target's collection, at the start of every relation link."""
    if kind == "project":
        return ('<span aria-hidden="true" class="relative size-3.5 shrink-0 bg-white"><span class="absolute inset-0.75 rounded-full bg-primary"></span></span>' if dark
                else '<span aria-hidden="true" class="relative size-3.5 shrink-0 bg-ink"><span class="absolute inset-0.75 rounded-full bg-primary-300"></span></span>')
    if kind == "activity":
        return '<span aria-hidden="true" class="tri size-3.5 shrink-0 bg-ink"></span>'
    if kind == "award":
        return '<span aria-hidden="true" class="grid size-3.5 shrink-0 place-items-center rounded-full bg-award"><span class="size-1.5 rounded-full bg-white"></span></span>'
    if kind == "society":
        return '<span aria-hidden="true" class="relative size-3.5 shrink-0"><span class="absolute left-0 top-0 size-2 bg-ink"></span><span class="absolute bottom-0 right-0 size-2 bg-primary"></span></span>'
    if kind == "event":
        return key_glyph(INDEX[ref]["type"], dark)
    raise KeyError(kind)


def related_links(i, extra="", dark=False):
    rel = related(i)
    if not rel:
        return ""
    links = []
    for r in rel:
        it = INDEX[r]
        color = "text-white focus-visible:outline-primary-300" if dark else ("text-award" if it["kind"] == "award" else "text-primary")
        links.append(
            f'<a href="{item_href(r)}" class="{cls("inline-flex min-h-6 items-center gap-1.5 font-semibold underline-offset-4 hover:underline", color)}">'
            f'{kind_mark_sm(it["kind"], dark, r)}<span class="sr-only">{s("kind")[it["kind"]]}: </span>{esc(title_of(it))}</a>'
        )
    return (f'<p class="{cls("grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 text-ui leading-copy", "text-primary-200" if dark else "text-muted", extra)}">'
            f'<span>{s("related")}</span><span class="flex flex-wrap gap-x-4 gap-y-1">{"".join(links)}</span></p>')


def activity_thumb(typ, size="size-14 sm:size-16"):
    inner = {
        "competition": '<span class="tri absolute inset-x-[12%] bottom-0 top-[19%] bg-primary"></span><span class="absolute right-[9%] top-[9%] size-[19%] rounded-full bg-ink"></span>',
        "community": '<span class="absolute bottom-0 left-0 size-1/2 bg-ink"></span><span class="absolute right-0 top-0 size-1/2 rounded-full bg-primary-300"></span><span class="absolute bottom-0 right-0 size-1/2 rounded-tl-full bg-primary"></span>',
    }[typ]
    return f'<span aria-hidden="true" class="relative {size} shrink-0 overflow-hidden bg-white">{inner}</span>'


def medal_thumb(idx, size="size-14 sm:size-16"):
    bg, bar = ("bg-ink", "bg-primary-300") if idx % 2 == 0 else ("bg-primary-100", "bg-ink")
    return (f'<span aria-hidden="true" class="relative grid {size} shrink-0 place-items-center overflow-hidden {bg}">'
            f'<span class="grid size-[69%] place-items-center rounded-full bg-primary"><span class="size-[36%] rounded-full bg-white"></span></span>'
            f'<span class="absolute inset-x-0 bottom-0 h-[9%] {bar}"></span></span>')


def item_thumb(i, size="size-14 sm:size-16"):
    it = INDEX[i]
    if it["kind"] == "award":
        return medal_thumb(AWARDS.index(it), size)
    return activity_thumb(it["type"], size)


# ───────────────────────────── project covers ─────────────────────────────
PAL = {
    "primary": dict(bg="bg-primary", a="bg-white", b="bg-ink", c="bg-primary-300", c2="bg-primary-200", c3="bg-primary-700"),
    "tint": dict(bg="bg-primary-100", a="bg-ink", b="bg-primary", c="bg-primary-300", c2="bg-primary-200", c3="bg-primary-700"),
    "ink": dict(bg="bg-ink", a="bg-primary", b="bg-primary-300", c="bg-white", c2="bg-primary-200", c3="bg-primary-700"),
}
SIZES = {
    "feature": "aspect-video sm:aspect-16/10 lg:aspect-auto lg:min-h-100",
    "card": "aspect-3/1 sm:aspect-auto sm:min-h-55",
    "hero": "aspect-16/10 lg:aspect-4/3",
    "thumb": "aspect-5/2 sm:aspect-4/3",
    "mini": "size-20",
}


def palette_of(p):
    """Featured = primary; the rest take tint / ink / primary in newest-first order."""
    if p["featured"]:
        return "primary"
    rest = [x for x in PROJECTS if not x["featured"]]
    return ["tint", "ink", "primary"][rest.index(p) % 3]


def m_clock(P, mini, pop):
    loop = (lambda c: "") if mini else (lambda c: c)
    ticks = "" if mini else (
        f'<div class="absolute left-1/2 top-[6%] h-[7%] w-[3%] -translate-x-1/2 {P["b"]}"></div>'
        f'<div class="absolute bottom-[6%] left-1/2 h-[7%] w-[3%] -translate-x-1/2 {P["b"]}"></div>'
        f'<div class="absolute left-[6%] top-1/2 h-[3%] w-[7%] -translate-y-1/2 {P["b"]}"></div>'
        f'<div class="absolute right-[6%] top-1/2 h-[3%] w-[7%] -translate-y-1/2 {P["b"]}"></div>')
    studiers = "" if mini else (
        f'<div class="{cls("absolute bottom-[12%] right-[8%] flex w-[34%] items-end gap-[6%]", pop(2))}">'
        f'<div class="aspect-square flex-1 rounded-full {P["a"]} motion-safe:animate-hop motion-safe:anim-offset-22"></div>'
        f'<div class="aspect-square flex-1 rounded-full {P["c"]} motion-safe:animate-hop motion-safe:anim-offset-14"></div>'
        f'<div class="aspect-square flex-1 rounded-full {P["b"]} motion-safe:animate-hop motion-safe:anim-offset-6"></div></div>'
        f'<div class="absolute bottom-[8%] right-[8%] h-[4%] w-[34%] {P["a"]}"></div>')
    return (
        f'<div class="{cls("absolute left-[8%] top-[12%] aspect-square h-[76%]", pop(0))}">'
        f'<div class="size-full rounded-full {P["a"]} {HOV} motion-safe:group-hover:-translate-x-[6%]">'
        f'<div class="{cls("absolute inset-0", loop("motion-safe:animate-quarter-step motion-safe:anim-offset-90"))}"><div class="absolute left-1/2 top-0 size-1/2 rounded-tr-full {P["c"]}"></div></div>'
        f'{ticks}<div class="absolute left-1/2 top-1/2 size-[12%] -translate-1/2 rounded-full {P["b"]}"></div></div></div>'
        f'<div class="{cls("absolute right-[9%] top-0 aspect-2/1 w-[26%]", pop(1))}"><div class="size-full rounded-b-full {P["b"]} {HOV} motion-safe:group-hover:translate-y-[12%]"></div></div>'
        f'{studiers}'
    )


def m_grid(P, mini, pop):
    fin = f'<div class="col-span-2 row-span-2 grid place-items-center {P["a"]}"><div class="grid size-[64%] place-items-center {P["bg"]}"><div class="size-1/2 {P["a"]}"></div></div></div>'
    blink = (lambda o: "") if mini else (lambda o: f"motion-safe:animate-blink-step motion-safe:anim-offset-{o}")
    grid = (
        f'<div class="{cls("absolute left-1/2 top-1/2 aspect-square h-[72%] -translate-1/2", pop(0))}">'
        f'<div class="grid size-full grid-cols-5 grid-rows-5 gap-[5%] {HOV} motion-safe:group-hover:rotate-90">'
        f'{fin}<div class="{P["a"]}"></div>{fin}<div class="col-start-3 row-start-2"></div>'
        f'<div class="{cls(P["b"], blink(8))}"></div><div></div><div class="rounded-full {P["b"]}"></div><div class="{P["a"]}"></div><div></div>'
        f'{fin}<div class="{P["b"]}"></div><div></div><div class="{cls(P["a"], blink(2))}"></div><div></div><div class="{P["a"]}"></div><div class="rounded-tl-full {P["b"]}"></div>'
        f'</div></div>')
    scan = "" if mini else f'<div class="absolute inset-x-[14%] top-[12%] h-[3%] {P["b"]} [--scan-to:2400%] motion-safe:animate-scan-step motion-safe:anim-offset-20"></div>'
    return grid + scan


def m_bubble(P, mini, pop):
    st = (lambda o: "") if mini else (lambda o: f"motion-safe:animate-stretch-step motion-safe:anim-offset-{o}")
    bars = (
        f'<div class="{cls("absolute left-[10%] top-[16%] flex h-[34%] w-[52%] flex-col justify-between", pop(1))}">'
        f'<div class="{cls("h-[16%] w-full origin-left", P["b"], st(23))}"></div>'
        f'<div class="{cls("h-[16%] w-[70%] origin-left", P["c2"], st(17))}"></div>'
        f'<div class="{cls("h-[16%] w-[86%] origin-left", P["b"], st(11))}"></div>'
        f'<div class="{cls("h-[16%] w-[56%] origin-left", P["c2"], st(5))}"></div></div>')
    if mini:
        bars = (f'<div class="absolute left-[10%] top-[16%] flex h-[34%] w-[52%] flex-col justify-between">'
                f'<div class="h-[22%] w-full {P["b"]}"></div><div class="h-[22%] w-[70%] {P["c2"]}"></div><div class="h-[22%] w-[86%] {P["b"]}"></div></div>')
    bubble = (
        f'<div class="{cls("absolute bottom-[12%] right-[10%] aspect-square h-[52%]", pop(0))}">'
        f'<div class="relative size-full rounded-full rounded-bl-none {P["a"]} {HOV} motion-safe:group-hover:-translate-x-[10%] motion-safe:group-hover:-translate-y-[6%]">'
        f'<div class="absolute inset-x-[24%] top-[36%] h-[10%] bg-white"></div><div class="absolute left-[24%] top-[54%] h-[10%] w-[34%] bg-white"></div></div></div>')
    corner = f'<div class="{cls("absolute bottom-0 left-0 aspect-square h-[30%]", pop(2))}"><div class="size-full rounded-tr-full {P["c3"]}"></div></div>'
    return bars + bubble + corner


MOTIFS = {"clock": m_clock, "grid": m_grid, "bubble": m_bubble}


def cover(p, size, gate=None, extra=""):
    P = PAL[palette_of(p)]
    mini = size == "mini"
    # The detail hero cover pops its modules in on load (same easing as the home poster)
    pop = (lambda d: f"motion-safe:animate-pop motion-safe:anim-delay-{d}" if d else "motion-safe:animate-pop") if size == "hero" else (lambda d: "")
    inner = MOTIFS[p["motif"]](P, mini, pop)
    gate_attr = gate_attrs(gate) if gate else ""
    return f'<div aria-hidden="true"{gate_attr} class="{cls("relative overflow-hidden", P["bg"], SIZES[size], "play-gate" if gate else "", extra)}">{inner}</div>'


def gate_attrs(name):
    return A("data-gate", f'data-gate="{name}" data-inview="{{{{gates.{name}}}}}"')



# ───────────────────────────── project media ─────────────────────────────
# Real media (owner-supplied captures) get the big cells; the project's motif keeps its identity around them.
# Mockup-only: a labelled tint slot stands in for each capture (production: <img alt width height>, ring-line edge).
NOPOP = lambda d: ""  # noqa: E731
KINDS = ["web", "mobile", "photo"]
ASPECT = {"web": "aspect-16/10", "mobile": "aspect-6/13", "photo": "aspect-4/3"}  # 6/13 = 9:19.5


def kinds_of(pid):
    return [k for k in KINDS if k in MEDIA.get(pid, [])]


MEDIA_GLYPH = {  # 14px kind marks (captions, counts) — same vocabulary as the link-kind and tech marks
    "web": f'<span aria-hidden="true" class="aspect-16/10 w-3.5 shrink-0 bg-primary {FC}"></span>',
    "mobile": f'<span aria-hidden="true" class="aspect-6/13 h-3.5 shrink-0 bg-ink {FC}"></span>',
    "photo": f'<span aria-hidden="true" class="grid aspect-4/3 w-3.5 shrink-0 place-items-center bg-ink {FC}"><span class="size-1.5 rounded-full bg-white"></span></span>',
}


def slot(kind, place="", labelled=True, short=False, cover=False):
    """Honest placeholder for a REAL capture: tint + generic image sign (sun + hills, like the ID-photo silhouette)
    + a tag naming the kind and its exact ratio. Never a drawing of the app."""
    box = {"web": "w-[30%]", "mobile": "w-[56%]", "photo": "w-[34%]"}[kind]
    glyph = (f'<div aria-hidden="true" class="absolute left-1/2 top-[58%] aspect-16/10 {box} -translate-1/2">'
             '<div class="absolute right-[4%] top-0 aspect-square w-[22%] rounded-full bg-primary-300"></div>'
             '<div class="tri absolute bottom-0 left-0 aspect-8/7 w-[64%] bg-primary-300"></div>'
             '<div class="tri absolute bottom-0 left-[40%] aspect-8/7 w-[44%] bg-primary-300"></div></div>')
    # cover=True: a photo cropped to whatever frame it sits in (event photos), so the tag names no ratio
    aria = s("cover_aria") if cover else s("slot_aria")[kind]
    role = f' role="img" aria-label="{aria}"' if labelled else ""
    label = s("cover_label") if cover else f'{s("media_short")[kind]} {s("slot")[kind].split(" ")[-1]}' if short else s("slot")[kind]
    tag = f'<span class="absolute left-2 right-2 top-2 w-fit bg-white px-2 py-0.5 text-sm font-medium leading-snug text-ink-2 sm:left-3 sm:top-3 sm:py-1">{label}</span>'
    return f'<div{role} data-slot="{kind}"{' data-fit="cover"' if cover else ""} class="{cls("relative overflow-hidden bg-primary-100 ring-1 ring-inset ring-line", place)}">{glyph}{tag}</div>'


# shape pieces, percent geometry so a cell can stretch without turning circles into ellipses
def cell(bg, inner, place, extra="", sizer=None, stage=False):
    size = f'<div aria-hidden="true" class="{sizer} w-full"></div>' if sizer else ""
    if stage:
        inner = f'<div class="absolute inset-x-0 top-1/2 aspect-square -translate-y-1/2">{inner}</div>'
    return f'<div aria-hidden="true" class="{cls("relative overflow-hidden", bg, place, extra)}">{size}{inner}</div>'


def sq(by):
    return f"absolute left-1/2 top-1/2 aspect-square {'h' if by == 'h' else 'w'}-[72%] -translate-1/2"


def clock_face(face, wedge, dot_, by="h"):
    return (f'<div class="{sq(by)} rounded-full {face}"><div class="absolute left-1/2 top-0 size-1/2 rounded-tr-full {wedge}"></div>'
            f'<div class="absolute left-1/2 top-1/2 size-[16%] -translate-1/2 rounded-full {dot_}"></div></div>')


def hang(color, inset="inset-x-[8%]"):
    return f'<div class="absolute {inset} top-0 aspect-2/1 rounded-b-full {color} {HOV} motion-safe:group-hover:translate-y-[10%]"></div>'


def studiers(c1, c2, c3, bar, loop=True):
    hop = (lambda o: f"motion-safe:animate-hop motion-safe:anim-offset-{o}") if loop else (lambda o: "")
    return (f'<div class="absolute inset-x-[12%] bottom-[20%] flex items-end gap-[7%]">'
            f'<div class="{cls("aspect-square flex-1 rounded-full", c1, hop(22))}"></div>'
            f'<div class="{cls("aspect-square flex-1 rounded-full", c2, hop(14))}"></div>'
            f'<div class="{cls("aspect-square flex-1 rounded-full", c3, hop(6))}"></div></div>'
            f'<div class="absolute inset-x-[12%] bottom-[12%] h-[7%] {bar}"></div>')


def hourglass(color, w="w-[64%]"):
    return (f'<div class="absolute inset-0 flex flex-col items-center justify-center">'
            f'<div class="tri aspect-8/7 {w} rotate-180 {color}"></div><div class="tri aspect-8/7 {w} {color}"></div></div>')


def arch_sun(arch_, sun, w="w-[64%]"):
    return (f'<div class="absolute bottom-0 left-1/2 aspect-2/1 {w} -translate-x-1/2 overflow-hidden rounded-t-full {arch_}">'
            f'<div class="absolute bottom-0 left-1/2 aspect-square h-[56%] -translate-x-1/2 rounded-full {sun} motion-safe:animate-sun-step motion-safe:anim-offset-33"></div></div>')


def slide_bar(semi):
    return (f'<div class="absolute inset-y-0 left-0 w-1/2 motion-safe:animate-slide-step motion-safe:anim-offset-27">'
            f'<div class="absolute inset-x-[6%] bottom-0 aspect-2/1 rounded-t-full {semi}"></div></div>')


def quarter(color, corner="tl", fit="h"):
    pos = {"tl": "rounded-tl-full", "tr": "rounded-tr-full", "br": "rounded-br-full", "bl": "rounded-bl-full"}[corner]
    anchor = ({"tl": "right-0", "bl": "right-0", "tr": "left-0", "br": "left-0"}[corner] + " inset-y-0") if fit == "h" else \
             ({"tl": "bottom-0", "tr": "bottom-0", "br": "top-0", "bl": "top-0"}[corner] + " inset-x-0")
    return f'<div class="absolute {anchor} aspect-square {pos} {color}"></div>'


def dot(color, size="h-[52%]", pos="left-1/2 top-1/2 -translate-1/2"):
    return f'<div class="absolute {pos} aspect-square {size} rounded-full {color}"></div>'


def arch(color, w="w-[64%]", pos="left-1/2 -translate-x-1/2"):
    return f'<div class="absolute bottom-0 {pos} aspect-2/1 {w} rounded-t-full {color}"></div>'


def tri_up(color, h="h-[72%]", pos="left-1/2 -translate-x-1/2"):
    return f'<div class="tri absolute bottom-0 {pos} aspect-8/7 {h} {color}"></div>'


def diamond(color, size="h-[42%]"):
    return f'<div class="absolute left-1/2 top-1/2 aspect-square {size} -translate-1/2 rotate-45 {color}"></div>'


def split_circle(left, right, size="h-[72%]"):
    return (f'<div class="absolute left-1/2 top-1/2 aspect-square {size} -translate-1/2 overflow-hidden rounded-full {right}">'
            f'<div class="absolute inset-y-0 left-0 w-1/2 {left}"></div></div>')


def finder(outer, mid, core, by="h"):
    return (f'<div class="{sq(by)} grid place-items-center {outer} {HOV} motion-safe:group-hover:rotate-90">'
            f'<div class="grid size-[66%] place-items-center {mid}"><div class="size-1/2 {core}"></div></div></div>')


def bit_row(colors, h="h-[44%]"):
    out = "".join(f'<div class="{cls("aspect-square h-full", c)}"></div>' for c in colors)
    return f'<div class="absolute inset-x-[10%] top-1/2 flex {h} -translate-y-1/2 justify-between">{out}</div>'


def bubble(color, line="bg-white", by="h"):
    return (f'<div class="{sq(by)}"><div class="relative size-full rounded-full rounded-bl-none {color} {HOV} motion-safe:group-hover:-translate-y-[8%]">'
            f'<div class="absolute inset-x-[24%] top-[36%] h-[11%] {line}"></div><div class="absolute left-[24%] top-[56%] h-[11%] w-[34%] {line}"></div></div></div>')


def lines(c1, c2):
    return (f'<div class="absolute inset-x-[14%] top-1/2 flex h-[52%] -translate-y-1/2 flex-col justify-between">'
            f'<div class="h-[18%] w-full {c1}"></div><div class="h-[18%] w-[70%] {c2}"></div><div class="h-[18%] w-[86%] {c1}"></div></div>')


# ── L3: the featured card and the detail hero share one mini poster (the hero poster's grammar, made small).
# Module unit h = 65fr. Web 16:10 over 3 rows = 312 x 195 (cols 130+65+117); phone 9:19.5 over 4 rows = 120 x 260.
# Rows 1 and 5 get h from in-flow sizers, rows 2-4 from the web cell; row 5 is 1fr, so a taller text column only
# stretches the bottom module row (the plinth), never a capture. Below 640 the phone column is dropped (the gallery
# still shows the phone captures) so the web capture can be large.
L3 = {
    "A": "col-start-1 row-start-1", "B": "col-start-2 row-start-1", "C": "col-start-3 row-start-1", "S1": "col-start-4 row-start-1",
    "BIG": "col-span-3 col-start-1 row-span-3 row-start-2 aspect-16/10", "S2": "col-start-4 row-span-3 row-start-2",
    "D": "col-span-2 col-start-1 row-start-5", "E": "col-start-3 row-start-5", "S3": "col-start-4 row-start-5",
    "PHONE": "hidden col-start-5 row-span-4 row-start-1 aspect-6/13 sm:block", "P2": "hidden col-start-5 row-start-5 sm:block",
    "T1": "col-span-2 col-start-4 row-span-2 row-start-1", "T2": "col-span-2 col-start-4 row-start-3", "T3": "col-span-2 col-start-4 row-span-2 row-start-4",
}
L3_SIZER = {"A": "aspect-2/1", "B": "aspect-square", "C": "aspect-9/5", "S1": "aspect-square", "D": "aspect-3/1", "E": "aspect-9/5",
            "S3": "aspect-square", "P2": "aspect-24/13", "T1": "aspect-37/26", "T2": "aspect-37/13"}
L3_GRID_PHONE = "grid grid-cols-[130fr_65fr_117fr_65fr] grid-rows-[auto_auto_auto_auto_1fr] sm:grid-cols-[130fr_65fr_117fr_65fr_120fr]"
L3_GRID = "grid grid-cols-[130fr_65fr_117fr_65fr_120fr] grid-rows-[auto_auto_auto_auto_1fr]"


def l3_modules(p, phone):
    """With media: module cells carry the project's motif pieces. Every cell touches a capture, so none is white or
    primary-100 (a white UI capture would bleed into it). Relay: hops at 2/10/18s, sun 15s, slide 21s."""
    mo = p["motif"]
    if mo == "clock":
        c = [cell("bg-primary", hang("bg-ink"), L3["A"]),
             cell("bg-ink", clock_face("bg-white", "bg-primary-300", "bg-ink"), L3["B"]),
             cell("bg-primary-200", arch_sun("bg-primary", "bg-primary-50"), L3["C"]),
             cell("bg-ink", slide_bar("bg-primary-300"), L3["D"]),
             cell("bg-primary", studiers("bg-white", "bg-primary-300", "bg-ink", "bg-white"), L3["E"])]
        if phone:
            return c + [cell("bg-primary-300", quarter("bg-ink", "bl"), L3["S1"]),
                        cell("bg-primary-700", hourglass("bg-primary-200", "w-[60%]"), L3["S2"]),
                        cell("bg-primary-200", quarter("bg-ink", "tl", "w"), L3["S3"])]
        return c + [cell("bg-primary-300", hourglass("bg-ink", "w-[28%]"), L3["T1"]),
                    cell("bg-primary-700", dot("bg-primary-200"), L3["T2"]),
                    cell("bg-ink", quarter("bg-primary-300", "tl"), L3["T3"])]
    if mo == "grid":
        c = [cell("bg-ink", bit_row(["bg-white", "", "bg-primary-300"]), L3["A"]),
             cell("bg-primary-200", finder("bg-ink", "bg-primary-200", "bg-ink"), L3["B"]),
             cell("bg-primary", bit_row(["bg-white", "bg-ink", "bg-white"]), L3["C"]),
             cell("bg-primary-300", bit_row(["bg-ink", "", "bg-ink", "bg-white", "", "bg-ink"], h="h-[36%]"), L3["D"]),
             cell("bg-ink", quarter("bg-primary", "tl"), L3["E"])]
        if phone:
            return c + [cell("bg-primary-200", dot("bg-ink"), L3["S1"]), cell("bg-primary", "", L3["S2"]), cell("bg-primary-300", quarter("bg-ink", "br", "w"), L3["S3"])]
        return c + [cell("bg-primary-300", finder("bg-ink", "bg-primary-300", "bg-ink"), L3["T1"]),
                    cell("bg-ink", dot("bg-primary-300", "h-[44%]"), L3["T2"]),
                    cell("bg-primary-200", dot("bg-ink", "h-[44%]"), L3["T3"])]
    if mo == "bubble":
        c = [cell("bg-primary-200", hang("bg-ink"), L3["A"]),
             cell("bg-primary", bubble("bg-white", "bg-primary"), L3["B"]),
             cell("bg-primary-300", lines("bg-ink", "bg-white"), L3["C"]),
             cell("bg-ink", bit_row(["rounded-full bg-primary-300", "rounded-full bg-primary", "rounded-full bg-white"]), L3["D"]),
             cell("bg-primary", quarter("bg-primary-300", "br"), L3["E"])]
        if phone:
            return c + [cell("bg-ink", dot("bg-primary-300"), L3["S1"]), cell("bg-primary-700", "", L3["S2"]), cell("bg-primary-200", quarter("bg-ink", "tl", "w"), L3["S3"])]
        return c + [cell("bg-primary-300", bubble("bg-ink", "bg-primary-300"), L3["T1"]),
                    cell("bg-ink", lines("bg-white", "bg-primary-300"), L3["T2"]),
                    cell("bg-primary", quarter("bg-primary-200", "tr"), L3["T3"])]
    raise KeyError(mo)


L3_P2 = {"clock": ("bg-primary", "bg-white"), "grid": ("bg-ink", "bg-primary-300"), "bubble": ("bg-primary", "bg-primary-300")}
L3_PLAIN = {  # no media: the big cell shows the full motif, the modules turn into the hero poster's quiet primitives
    "ink": lambda: [cell("bg-primary-200", hang("bg-primary"), L3["A"]), cell("bg-primary", dot("bg-white"), L3["B"]),
                    cell("bg-primary-100", tri_up("bg-primary"), L3["C"]), cell("bg-primary-100", arch("bg-ink", "w-[40%]", "left-[12%]"), L3["D"]),
                    cell("bg-primary", quarter("bg-primary-300", "br"), L3["E"]), cell("bg-primary-300", split_circle("bg-ink", "bg-primary"), L3["T1"]),
                    cell("bg-white", diamond("bg-ink"), L3["T2"]), cell("bg-primary-200", arch("bg-ink", "w-[56%]"), L3["T3"])],
    "tint": lambda: [cell("bg-primary-300", hang("bg-ink"), L3["A"]), cell("bg-ink", dot("bg-primary-300"), L3["B"]),
                     cell("bg-primary", tri_up("bg-white"), L3["C"]), cell("bg-primary-200", arch("bg-ink", "w-[40%]", "left-[12%]"), L3["D"]),
                     cell("bg-ink", quarter("bg-primary", "tl"), L3["E"]), cell("bg-primary", split_circle("bg-ink", "bg-white"), L3["T1"]),
                     cell("bg-primary-200", diamond("bg-ink"), L3["T2"]), cell("bg-primary-300", arch("bg-ink", "w-[56%]"), L3["T3"])],
    "primary": lambda: [cell("bg-primary-200", hang("bg-ink"), L3["A"]), cell("bg-ink", dot("bg-primary-300"), L3["B"]),
                        cell("bg-primary-100", tri_up("bg-ink"), L3["C"]), cell("bg-primary-300", arch("bg-ink", "w-[40%]", "left-[12%]"), L3["D"]),
                        cell("bg-ink", quarter("bg-primary-300", "tl"), L3["E"]), cell("bg-primary-100", split_circle("bg-ink", "bg-primary"), L3["T1"]),
                        cell("bg-ink", diamond("bg-primary-300"), L3["T2"]), cell("bg-primary-200", arch("bg-ink", "w-[56%]"), L3["T3"])],
}


def l3_sized(c):
    for k, place in L3.items():
        if k in L3_SIZER and f'{place}">' in c:
            return c.replace(f'{place}">', f'{place}"><div aria-hidden="true" class="{L3_SIZER[k]} w-full"></div>', 1)
    return c


def poster_l3(p, labelled=False, gate=None, extra="", pop=False):
    ks = MEDIA.get(p["id"], [])
    web, phone = "web" in ks, "mobile" in ks
    if web:
        big = slot("web", L3["BIG"], labelled)
        cells = l3_modules(p, phone)
    else:
        P = PAL[palette_of(p)]
        big = f'<div aria-hidden="true" class="{cls("relative overflow-hidden", P["bg"], L3["BIG"])}">{MOTIFS[p["motif"]](P, False, NOPOP)}</div>'
        cells, phone = L3_PLAIN[palette_of(p)](), False
    cells = [l3_sized(c) for c in cells]
    if pop:  # detail hero: modules pop in on load (captures never animate)
        cells = [c.replace('class="relative overflow-hidden', f'class="relative overflow-hidden motion-safe:animate-pop motion-safe:anim-delay-{n % 4 + 1}', 1) for n, c in enumerate(cells)]
    ph = ""
    if phone:
        bg, fg = L3_P2[p["motif"]]
        ph = slot("mobile", L3["PHONE"], labelled, short=True) + l3_sized(cell(bg, arch(fg, "w-[46%]"), L3["P2"]))
    gate_attr = gate_attrs(gate) if gate else ""
    hidden = "" if labelled else ' aria-hidden="true"'
    grid = L3_GRID_PHONE if phone else L3_GRID
    return f'<div{hidden}{gate_attr} class="{cls("group/poster relative overflow-hidden", grid, "play-gate" if gate else "", extra)}">{big}{"".join(cells)}{ph}</div>'


# ── UNIT: cards and list rows. A 16:10 capture + a spine of three square modules (29:15 overall).
# Spine = the motif at mini size, then one module per media kind present, then palette accents.
SPINE_COL = {"primary": [("bg-ink", "bg-primary-300"), ("bg-primary-300", "bg-ink")], "ink": [("bg-primary", "bg-white"), ("bg-primary-300", "bg-ink")]}


def spine_pal(p):
    return "primary" if palette_of(p) == "tint" else palette_of(p)  # spines sit beside light captures: never the tint palette


def mod_kind(kind, bg, fg):
    inner = {
        "web": f'<span class="absolute left-1/2 top-1/2 aspect-16/10 w-[60%] -translate-1/2 {fg}"></span>',
        "mobile": f'<span class="absolute left-1/2 top-1/2 aspect-6/13 h-[64%] -translate-1/2 {fg}"></span>',
        "photo": f'<span class="absolute left-1/2 top-1/2 grid aspect-4/3 w-[60%] -translate-1/2 place-items-center {fg}"><span class="size-[44%] rounded-full {bg}"></span></span>',
    }[kind]
    return f'<div class="relative overflow-hidden {bg}">{inner}</div>'


def spine_mods(p, n):
    cols = SPINE_COL[spine_pal(p)]
    P = PAL[spine_pal(p)]
    out = [f'<div class="relative overflow-hidden {P["bg"]}">{MOTIFS[p["motif"]](P, True, NOPOP)}</div>']
    for i, k in enumerate(kinds_of(p["id"])[: n - 1]):
        out.append(mod_kind(k, *cols[i % 2]))
    while len(out) < n:
        bg, fg = cols[(len(out) - 1) % 2]
        out.append(f'<div class="relative overflow-hidden {bg}"><span class="absolute bottom-0 right-0 size-[70%] rounded-tl-full {fg}"></span></div>')
    return out


def unit(p, extra="", gate=None):
    ks = MEDIA.get(p["id"], [])
    if "web" not in ks:  # no web capture: the motif cover takes the unit's exact footprint (honest default)
        P = PAL[palette_of(p)]
        g = gate_attrs(gate) if gate else ""
        return (f'<div aria-hidden="true"{g} class="{cls("relative aspect-29/15 overflow-hidden", P["bg"], "play-gate" if gate else "", extra)}">'
                f'{MOTIFS[p["motif"]](P, False, NOPOP)}</div>')
    return (f'<div aria-hidden="true" class="{cls("grid aspect-29/15 grid-cols-[minmax(0,24fr)_minmax(0,5fr)]", extra)}">'
            f'{slot("web", labelled=False)}<div class="grid grid-rows-3">{"".join(spine_mods(p, 3))}</div></div>')


def kind_counts(p, extra=""):
    ks = MEDIA.get(p["id"], [])
    if not ks:
        return ""
    items = "".join(f'<span class="inline-flex items-center gap-1.5">{MEDIA_GLYPH[k]}<span>{s("media_short")[k]} <span class="tabular-nums">{ks.count(k)}</span></span></span>'
                    for k in kinds_of(p["id"]))
    return f'<span class="{cls("inline-flex flex-wrap gap-x-3 gap-y-1 text-ink-2", extra)}">{items}</span>'


# ── Gallery (detail "화면 / Screens"): justified rows on the square module. Each row's template uses fr = the items'
# aspect ratios at a common height, so a capture and a spine of three squares end on the same line. Wide captures get a
# row each with the spine alternating sides; phone captures pair up between two spines. Below 640 the spines drop out.
GM = {  # the clock motif taken apart
    "F": ("bg-primary", '<span class="absolute inset-[16%] rounded-full bg-white"></span><span class="absolute left-1/2 top-1/2 size-[12%] -translate-1/2 rounded-full bg-ink"></span>'),
    "W": ("bg-ink", '<span class="absolute bottom-0 left-0 size-[76%] rounded-tr-full bg-primary-300"></span>'),
    "A": ("bg-primary-200", '<span class="absolute left-[18%] top-0 aspect-2/1 w-[64%] rounded-b-full bg-ink"></span>'),
    "D": ("bg-primary-50", '<span class="absolute inset-x-[14%] bottom-[24%] flex items-end gap-[8%]"><span class="aspect-square flex-1 rounded-full bg-primary"></span><span class="aspect-square flex-1 rounded-full bg-primary-300"></span><span class="aspect-square flex-1 rounded-full bg-ink"></span></span><span class="absolute inset-x-[14%] bottom-[16%] h-[6%] bg-ink"></span>'),
    "Q": ("bg-white", '<span class="absolute inset-0 rounded-tl-full bg-primary"></span>'),
    "S": ("bg-primary-700", '<span class="absolute bottom-0 left-1/2 aspect-2/1 w-[72%] -translate-x-1/2 rounded-t-full bg-primary-200"></span>'),
    "T": ("bg-primary-50", '<span class="absolute left-[18%] top-[18%] h-[64%] w-[32%] rounded-l-full bg-ink"></span><span class="absolute left-1/2 top-[18%] h-[64%] w-[32%] rounded-r-full bg-primary"></span>'),
    "C": ("bg-primary-300", '<span class="absolute inset-[26%] rounded-full bg-ink"></span>'),
}
GAL_COLS = [["F", "D", "W"], ["A", "Q", "S"], ["W", "T", "C"], ["S", "F", "A"]]
WIDE_FR = {"web": ("24fr", "5fr"), "photo": ("4fr", "1fr")}


def gcol(i):
    mods = "".join(f'<div class="relative aspect-square overflow-hidden {GM[x][0]}">{GM[x][1]}</div>' for x in GAL_COLS[i % len(GAL_COLS)])
    return f'<div aria-hidden="true" class="hidden grid-rows-3 self-start sm:grid">{mods}</div>'


def gfig(kind):
    return (f'<figure class="min-w-0">{slot(kind, ASPECT[kind])}'
            f'<figcaption class="mt-2 flex items-start gap-2 text-sm text-muted"><span class="mt-1 flex">{MEDIA_GLYPH[kind]}</span>'
            f'<span><span class="font-semibold text-ink-2">{s("media_kind")[kind]}</span> {s("ph")["caption"]}</span></figcaption></figure>')


def gallery(p, fold_after=4):
    items = MEDIA.get(p["id"], [])
    rows, c, w, i = [], 0, 0, 0
    while i < len(items):
        k = items[i]
        if k != "mobile":
            a, b = WIDE_FR[k]
            if w % 2 == 0:
                rows.append((1, f'<div class="grid gap-3 sm:grid-cols-[minmax(0,{a})_minmax(0,{b})]">{gfig(k)}{gcol(c)}</div>'))
            else:
                rows.append((1, f'<div class="grid gap-3 sm:grid-cols-[minmax(0,{b})_minmax(0,{a})]">{gcol(c)}{gfig(k)}</div>'))
            c, w, i = c + 1, w + 1, i + 1
            continue
        if i + 1 < len(items) and items[i + 1] == "mobile":
            rows.append((2, f'<div class="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,13fr)_minmax(0,18fr)_minmax(0,18fr)_minmax(0,13fr)]">{gcol(c)}{gfig("mobile")}{gfig("mobile")}{gcol(c + 1)}</div>'))
            i += 2
        else:
            rows.append((1, f'<div class="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,13fr)_minmax(0,18fr)_minmax(0,13fr)_minmax(0,13fr)]">{gcol(c)}{gfig("mobile")}{gcol(c + 1)}{gcol(c + 2)}</div>'))
            i += 1
        c += 2
    shown, rest, count = [], [], 0
    for n_items, html in rows:
        (shown if count < fold_after else rest).append(html)
        count += n_items
    more = ""
    if rest:
        n_rest = len(items) - sum(n for n, _ in rows[: len(shown)])
        more = (f'<details class="group/more"><summary class="inline-flex h-11 cursor-pointer list-none items-center gap-2.5 border border-ink px-4 text-ui font-semibold text-ink transition-colors hover:bg-primary-50 [&::-webkit-details-marker]:hidden">'
                f'<span aria-hidden="true" class="size-3 bg-ink motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap group-open/more:rotate-45"></span>{s("more_screens").format(n=n_rest)}</summary>'
                f'<div class="mt-8 grid gap-8">{"".join(rest)}</div></details>')
    return f'<div class="mt-5 grid gap-8">{"".join(shown)}{more}</div>'


# ───────────────────────────── layout ─────────────────────────────
def nav_attrs(i, variant):
    cur_page = CTX["page"]
    if cur_page != "home":
        # sub-pages: 프로젝트 is the current section, statically
        return ' data-current="true" aria-current="true"' if i == "projects" else ""
    proto = f'data-nav="{i}"' + (' data-current="true" aria-current="location"' if i == "about" else "")
    dc = f'data-nav="{i}" data-current="{{{{nav.{i}.cur}}}}" aria-current="{{{{nav.{i}.aria}}}}" onClick="{{{{nav.{i}.click}}}}"'
    return A(proto, dc)


def nav_link(i, variant):
    href = page_href("home", hash_=i) if CTX["page"] != "home" else f"#{i}"
    label = s("nav")[i]
    if variant == "bar":
        return (f'<li><a href="{href}"{nav_attrs(i, variant)} class="group relative flex h-16 items-center px-2 text-ui font-medium text-muted transition-colors hover:text-ink focus-visible:z-20 focus-visible:-outline-offset-2 data-[current=true]:text-ink xl:px-3">{label}'
                f'<span aria-hidden="true" class="absolute inset-x-2 bottom-0 z-10 h-1 origin-left scale-x-0 bg-primary group-data-[current=true]:scale-x-100 forced-colors:bg-[CanvasText] motion-safe:transition-transform motion-safe:duration-300 xl:inset-x-3"></span></a></li>')
    return (f'<li><a href="{href}"{nav_attrs(i, variant)} class="group relative flex h-9 items-center justify-center bg-white text-sm font-medium text-muted transition-colors hover:text-ink focus-visible:z-20 focus-visible:-outline-offset-2 data-[current=true]:text-ink md:h-11 md:text-ui short:h-10 short:whitespace-nowrap short:px-3">{label}'
            f'<span aria-hidden="true" class="absolute inset-x-3 bottom-0 z-10 h-1 scale-x-0 bg-primary group-data-[current=true]:scale-x-100 forced-colors:bg-[CanvasText] motion-safe:transition-transform motion-safe:duration-300"></span></a></li>')


def motion_toggle():
    # Toggle button: the label stays "Pause motion"; aria-pressed="true" means paused
    attrs = A(f'data-motion-toggle aria-pressed="false" aria-label="{s("motion_pause")}" title="{s("motion_pause")}"',
              f'aria-pressed="{{{{motion.pressed}}}}" aria-label="{s("motion_pause")}" title="{s("motion_pause")}" onClick="{{{{motion.toggle}}}}"')
    return (f'<button type="button"{attrs} class="group ml-auto grid size-8 shrink-0 place-items-center border border-line text-ink transition-colors hover:border-ink motion-reduce:hidden lg:ml-3">'
            f'<span aria-hidden="true" class="flex gap-0.75 group-aria-pressed:hidden"><span class="h-3 w-0.75 bg-current"></span><span class="h-3 w-0.75 bg-current"></span></span>'
            f'<span aria-hidden="true" class="tri hidden size-3 rotate-90 bg-current group-aria-pressed:block"></span></button>')


def lang_toggle():
    out = []
    for lc, lab in (("ko", "KO"), ("en", "EN")):
        cur = ' aria-current="page"' if lc == loc() else ""
        out.append(f'<a href="{page_href(CTX["page"], lc)}" hreflang="{lc}" lang="{lc}"{cur} class="grid place-items-center px-2.5 text-ink transition-colors hover:bg-primary-50 aria-[current=page]:bg-ink aria-[current=page]:text-white forced-colors:aria-[current=page]:underline forced-colors:aria-[current=page]:decoration-2 forced-colors:aria-[current=page]:underline-offset-4">{lab}</a>')
    return f'<div role="group" aria-label="{s("lang_label")}" class="flex h-8 shrink-0 border border-ink text-sm font-semibold motion-reduce:ml-auto lg:motion-reduce:ml-3">{"".join(out)}</div>'


def header():
    logo_href = "#about" if CTX["page"] == "home" else page_href("home")
    logo = (f'<a href="{logo_href}" aria-label="{s("logo_label")}" class="group/logo flex shrink-0 items-center gap-2.5">'
            f'<span aria-hidden="true" class="grid size-7 grid-cols-2 grid-rows-2">'
            f'<span class="rounded-tl-full bg-primary motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover/logo:rotate-90"></span>'
            f'<span class="bg-ink"></span>'
            f'<span class="rounded-full bg-primary-300 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover/logo:scale-75"></span>'
            f'<span class="tri bg-ink motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover/logo:-translate-y-0.5"></span></span>'
            f'<span translate="no" class="text-lg font-bold tracking-tight text-ink transition-colors group-hover/logo:text-primary">{t(NAME)}</span></a>')
    bar = "".join(nav_link(i, "bar") for i in NAV_IDS)
    cell = "".join(nav_link(i, "cell") for i in NAV_IDS)
    return (
        '<header class="sticky top-0 z-50 bg-white tiny:static after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-line">'
        f'<div class="shell flex h-11 items-center gap-3 lg:h-16 lg:gap-4">{logo}'
        f'<nav aria-label="{s("nav_label")}" class="ml-auto hidden lg:block"><ul class="flex">{bar}</ul></nav>'
        f'{motion_toggle()}{lang_toggle()}</div>'
        f'<nav aria-label="{s("nav_label")}" class="border-t border-line lg:hidden"><ul class="grid grid-cols-4 gap-px bg-line md:grid-cols-8 short:flex short:overflow-x-auto short:overscroll-x-contain short:bg-white">{cell}</ul></nav>'
        '</header>'
    )


PLINTH = [
    ("bg-white", '<div class="absolute inset-0 rounded-tl-full bg-ink motion-safe:animate-quarter-step motion-safe:anim-offset-93"></div>'),
    ("bg-primary", '<div class="absolute inset-[20%] rounded-full bg-white"></div>'),
    ("bg-primary-50", '<div class="tri absolute inset-x-[8%] bottom-0 top-[12%] bg-primary-300"></div>'),
    ("bg-ink", '<div class="absolute inset-x-0 bottom-0 aspect-2/1 rounded-t-full bg-primary-300"></div>'),
    ("bg-white", '<div class="absolute inset-[10%] overflow-hidden rounded-full bg-primary"><div class="absolute inset-y-0 left-0 w-1/2 bg-ink"></div></div>'),
    ("grid place-items-center bg-primary-200", '<div class="size-[44%] bg-ink motion-safe:animate-diamond-step motion-safe:anim-offset-39"></div>'),
    ("bg-white", '<div class="tri-corner absolute inset-0 bg-primary"></div>'),
    ("bg-primary-100", '<div class="absolute inset-x-0 top-0 aspect-2/1 rounded-b-full bg-ink"></div>'),
    ("bg-primary", '<div class="absolute inset-0 rounded-br-full bg-primary-300"></div>'),
    ("bg-white", '<div class="absolute inset-[22%] rounded-full bg-ink"></div>'),
    ("bg-primary-50", '<div class="absolute inset-x-[14%] top-[28%] h-[16%] bg-primary"></div><div class="absolute inset-x-[14%] bottom-[28%] h-[16%] bg-ink"></div>'),
    ("bg-ink", '<div class="tri absolute inset-x-[16%] bottom-0 top-[20%] bg-primary"></div>'),
    ("bg-white", '<div class="absolute inset-0 rounded-tr-full bg-primary-300"></div>'),
    ("bg-primary-700", '<div class="absolute inset-[24%] rounded-full bg-primary-200"></div>'),
    ("bg-primary-50", '<div class="absolute inset-x-[12%] bottom-0 aspect-2/1 rounded-t-full bg-ink"></div>'),
    ("bg-primary", '<div class="tri-corner absolute inset-0 rotate-180 bg-primary-300"></div>'),
    ("bg-white", '<div class="absolute left-[10%] top-1/2 size-[38%] -translate-y-1/2 rounded-full bg-ink"></div><div class="absolute right-[10%] top-1/2 size-[38%] -translate-y-1/2 rounded-full bg-primary"></div>'),
    ("bg-primary-300", '<div class="absolute inset-1/4 bg-ink"></div>'),
    ("bg-white", '<div class="absolute inset-x-0 top-0 aspect-2/1 rounded-b-full bg-primary"></div>'),
    ("bg-ink", '<div class="absolute inset-0 rounded-bl-full bg-primary"></div>'),
    ("bg-primary-50", '<div class="absolute inset-[16%] rounded-full bg-primary-300"></div>'),
    ("bg-primary", '<div class="absolute inset-x-0 bottom-0 aspect-2/1 rounded-t-full bg-white"></div>'),
    ("bg-white", '<div class="tri absolute inset-x-[10%] bottom-0 top-[14%] bg-ink"></div>'),
    ("bg-primary-200", '<div class="absolute inset-0 rounded-tl-full bg-ink"></div>'),
]


def footer():
    mods = []
    for n, (bg, shape) in enumerate(PLINTH, 1):
        hide = "hidden sm:block" if 9 <= n <= 12 else ("hidden lg:block" if n >= 13 else "")
        mods.append(f'<div class="{cls("relative aspect-square overflow-hidden", bg, hide)}">{shape}</div>')
    top = "#about" if CTX["page"] == "home" else "#main"
    glyphs = "".join(key_glyph(k) for k in ("dev", "education", "hackathon", "seminar"))
    return (
        '<footer class="border-t border-line">'
        f'<div class="shell pt-6"><div aria-hidden="true"{gate_attrs("plinth")} class="play-gate grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-24">{"".join(mods)}</div></div>'
        f'<div class="shell flex flex-wrap items-center gap-x-6 gap-y-3 py-4 text-sm text-muted">'
        f'<span aria-hidden="true" class="flex items-end gap-1">{glyphs}</span><span>{s("footer")}</span>'
        f'<a href="{top}" class="ml-auto inline-flex min-h-6 items-center font-semibold text-ink hover:text-primary">{s("back_to_top")}</a></div>'
        '</footer>'
    )


def copy_button(key, value):
    pre, post = s(f"copy_{key}_sr")
    status = s(f"copied_{key}")
    data = json.dumps({"idle": s("copy"), "done": s("copied"), "fail": s("copy_failed"), "hint": s("copy_failed_hint"), "status": status}, ensure_ascii=False)
    attrs = A(f"data-copy=\"{value}\" data-copy-key=\"{key}\" data-copy-text='{data}'", f'data-done="{{{{copy.{key}.done}}}}" onClick="{{{{copy.{key}.go}}}}"')
    label = A("data-copy-label", "")
    text = s("copy") if MODE == "proto" else f"{{{{copy.{key}.label}}}}"
    pre_s = f'<span class="sr-only">{pre}</span>' if pre else ""
    post_s = f'<span class="sr-only">{post}</span>' if post else ""
    return (f'<button type="button"{attrs} class="relative inline-flex h-7 shrink-0 items-center gap-1.5 border border-line bg-white px-2 text-sm font-semibold text-ink-2 transition-colors after:absolute after:-inset-2 hover:border-ink hover:text-ink data-[done=true]:border-live data-[done=true]:text-live data-[done=fail]:border-award data-[done=fail]:text-award">'
            '<span aria-hidden="true" class="grid size-3 grid-cols-2 gap-px"><span class="bg-current"></span><span class="bg-current"></span><span class="bg-current"></span><span class="bg-current opacity-30"></span></span>'
            f'{pre_s}<span{label}>{text}</span>{post_s}</button>')


def status_region():
    if MODE == "proto":
        return '<p role="status" aria-live="polite" class="sr-only" data-copy-status></p>'
    return '<p role="status" aria-live="polite" class="sr-only">{{status}}</p>'


def ext(href, text, extra=""):
    return f'<a href="{href}" target="_blank" rel="noopener noreferrer" class="{extra}">{text}<span class="sr-only"> {s("new_tab")}</span></a>'


def section_heading(sid, count=None, more=None):
    c = f'<span class="pt-1 text-ui tabular-nums text-muted">{s("count").format(n=count)}</span>' if count and not more else ""
    m = (f'<a href="{more}" class="ml-auto inline-flex min-h-6 items-center text-ui font-semibold text-primary underline-offset-4 hover:underline">'
         f'{s("view_all").format(n=count)}</a>') if more else ""
    return (f'<div class="flex flex-wrap items-center gap-x-4 gap-y-2">{kind_mark(sid)}'
            f'<h2 id="{sid}-title" class="text-h2-sm font-bold text-ink lg:text-h2">{s("nav")[sid]}</h2>{c}{m}</div>')


SEC = ""  # anchor offset = root scroll-padding (ROOT_CLS / dc helmet)


# ───────────────────────────── home ─────────────────────────────
def poster():
    pop = "motion-safe:animate-pop"
    return (
        '<div class="group/poster mt-6 w-full max-w-140 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center lg:justify-self-end xl:self-auto">'
        '<div class="grid aspect-square grid-cols-5 grid-rows-5">'
        f'<div aria-hidden="true" class="relative overflow-hidden {pop} motion-safe:anim-delay-4"><div class="absolute inset-0 rounded-tl-full bg-ink motion-safe:animate-quarter-step motion-safe:anim-offset-93"></div></div>'
        f'<div aria-hidden="true" class="relative grid place-items-center {pop} motion-safe:anim-delay-3"><div class="size-[62%] rounded-full bg-primary-300 {HOV} motion-safe:group-hover/poster:translate-x-1/3"></div></div>'
        f'<div aria-hidden="true" class="relative col-span-2 overflow-hidden {pop}"><div class="absolute inset-0 rounded-t-full bg-primary"></div>'
        '<div class="absolute bottom-0 left-1/2 aspect-square h-[46%] -translate-x-1/2 rounded-full bg-primary-200 motion-safe:animate-sun-step motion-safe:anim-offset-33"></div></div>'
        f'<div aria-hidden="true" class="relative overflow-hidden bg-primary-50 {pop} motion-safe:anim-delay-1"><div class="tri-corner absolute inset-0 bg-primary-400 {HOV} motion-safe:group-hover/poster:-translate-x-1/4"></div></div>'
        f'<div aria-hidden="true" class="relative col-span-2 row-span-2 overflow-hidden bg-primary-50 {pop} motion-safe:anim-delay-2"><div class="absolute inset-[6%] overflow-hidden rounded-full bg-primary {HOV} motion-safe:group-hover/poster:-rotate-45"><div class="absolute inset-y-0 left-0 w-1/2 bg-ink"></div></div></div>'
        f'<div role="img" aria-label="{s("photo_label")}" class="relative col-span-3 col-start-3 row-span-4 row-start-2 overflow-hidden bg-primary-100">'
        '<div aria-hidden="true" class="absolute left-1/2 top-[20%] aspect-square w-[34%] -translate-x-1/2 rounded-full bg-primary-300"></div>'
        '<div aria-hidden="true" class="absolute -bottom-px left-1/2 aspect-2/1 w-[78%] -translate-x-1/2 rounded-t-full bg-primary-300"></div>'
        f'<span class="absolute left-3 top-3 bg-white px-2 py-1 text-sm font-medium text-ink-2">{s("photo_tag")}</span></div>'
        f'<div aria-hidden="true" class="relative col-start-1 row-start-4 overflow-hidden {pop} motion-safe:anim-delay-3"><div class="tri absolute inset-x-[4%] bottom-0 top-[8%] bg-primary-300 {HOV} motion-safe:group-hover/poster:-translate-y-[8%]"></div></div>'
        f'<div aria-hidden="true" class="relative col-start-2 row-start-4 grid place-items-center bg-primary-200 {pop} motion-safe:anim-delay-1"><div class="size-[44%] bg-ink motion-safe:animate-diamond-step motion-safe:anim-offset-39"></div></div>'
        f'<div aria-hidden="true" class="relative col-span-2 col-start-1 row-start-5 overflow-hidden bg-ink {pop} motion-safe:anim-delay-2"><div class="absolute inset-y-0 left-0 w-1/2 motion-safe:animate-slide-step motion-safe:anim-offset-27"><div class="absolute inset-0 rounded-t-full bg-primary-300"></div></div></div>'
        '</div></div>'
    )


LINK_U = "text-ink underline decoration-primary-300 decoration-2 underline-offset-4 hover:decoration-primary"


def fact_row(label, dd, dd_cls="text-ink"):
    return (f'<div class="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-x-3 py-2.5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-x-4 lg:py-2">'
            f'<dt class="text-muted">{label}</dt>'
            f'<dd class="{dd_cls}">{dd}</dd></div>')


def hero():
    legend = "".join(f'<li class="flex items-center gap-2">{key_glyph(k)}{t(lbl)}</li>' for k, lbl in ROLES)
    if loc() == "ko":
        h1 = (f'<div class="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-7">'
              f'<h1 id="about-title" translate="no" class="text-name-sm font-bold text-ink sm:text-7xl xl:text-name">{NAME["ko"]}</h1>'
              f'<p lang="en" translate="no" class="text-ui text-muted">{NAME["en"]}</p></div>')
    else:
        h1 = (f'<div class="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:mt-7">'
              f'<h1 id="about-title" translate="no" class="text-name-en-sm font-bold text-ink sm:text-6xl xl:text-name-en">{NAME["en"]}</h1>'
              f'<p lang="ko" translate="no" class="text-ui text-muted">{NAME["ko"]}</p></div>')
    f = s("facts")
    facts = (
        fact_row(f["affil"], s("affil"), "text-pretty text-ink")
        + fact_row(f["society"], f'<a href="#society" class="{LINK_U}">{s("society_role")}</a>', "")
        + fact_row(f["email"], f'<a href="mailto:{EMAIL}" translate="no" data-copy-value="email" class="{LINK_U} wrap-anywhere">{EMAIL}</a>{copy_button("email", EMAIL)}', "flex flex-wrap items-center gap-x-3 gap-y-1")
        + fact_row(f["github"], ext(f"https://github.com/{GITHUB}", f"<span translate=\"no\">github.com/{GITHUB}</span>", f"{LINK_U} wrap-anywhere"), "")
    )
    ctas = (
        f'<a href="#projects" class="group inline-flex h-12 items-center gap-3 border border-transparent bg-ink pl-5 pr-4 text-ui font-semibold text-white transition-colors hover:bg-primary">{s("cta_projects")}'
        '<span aria-hidden="true" class="relative size-4"><span class="absolute inset-0 rounded-full bg-primary-300 motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover:scale-75"></span></span></a>'
        f'<a href="#connect" class="group inline-flex h-12 items-center gap-3 border border-ink px-5 text-ui font-semibold text-ink transition-colors hover:bg-primary-50">{s("cta_contact")}'
        '<span aria-hidden="true" class="size-3 bg-ink motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover:rotate-45"></span></a>'
    )
    return (
        f'<section id="about" aria-labelledby="about-title" class="{SEC}">'
        '<div class="shell grid gap-x-12 pb-10 pt-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-16 lg:pt-14">'
        f'<div class="lg:col-span-6"><ul class="{cls("flex flex-wrap gap-x-5 gap-y-2 text-ui font-medium text-ink-2", "lg:gap-x-4 lg:text-sm" if loc() == "en" else "")}">{legend}</ul>{h1}</div>'
        f'{poster()}'
        '<div class="mt-7 lg:col-span-6 lg:row-start-2 lg:mt-8 xl:self-end">'
        f'<p class="max-w-136 text-pretty text-lg leading-prose text-ink-2">{t(INTRO)}</p>'
        f'<dl class="mt-7 max-w-136 divide-y divide-line border-y border-line text-ui lg:mt-6">{facts}</dl>'
        f'<div class="mt-7 flex flex-wrap gap-3">{ctas}</div>'
        '</div></div></section>'
    )


def chips(items, extra=""):
    return f'<ul class="{cls("flex flex-wrap gap-1.5", extra)}">' + "".join(f'<li translate="no" class="border border-line px-2 text-sm text-ink-2">{esc(x)}</li>' for x in items) + "</ul>"


STRETCH = "after:absolute after:inset-0 hover:text-primary focus-visible:outline-none"
CARD_FOCUS = "active:border-ink has-[[data-stretch]:focus-visible]:outline-2 has-[[data-stretch]:focus-visible]:outline-offset-2 has-[[data-stretch]:focus-visible]:outline-primary"


def live_badge():
    return f'<span class="inline-flex items-center gap-1.5 text-live"><span aria-hidden="true" class="size-2 rounded-full bg-live {FC}"></span>{s("live")}</span>'


def meta(p, extra=""):
    """Kind phrase and period as two spans spaced by layout (no middle-dot strings)."""
    live = live_badge() if p["live"] else ""
    return (f'<p class="{cls("flex flex-wrap items-center gap-x-3 gap-y-1 text-ui font-semibold text-muted", extra)}">'
            f'<span>{form_label(p)}</span><span class="tabular-nums">{period(p["start"], p["end"])}</span>{live}</p>')


def project_feature(p):
    tech = [x for _, x in p["tech"]]
    return (
        f'<article class="group relative mt-6 grid border border-line transition-colors hover:border-ink {CARD_FOCUS} lg:grid-cols-12">'
        f'{poster_l3(p, gate="feature", extra="lg:col-span-7")}'
        '<div class="flex flex-col p-5 sm:p-8 lg:col-span-5 lg:p-10">'
        f'{meta(p)}'
        f'<h3 class="mt-3 text-2xl font-bold tracking-tight text-ink"><a href="{item_href(p["id"])}" data-stretch class="{STRETCH}">{t(p["title"])}</a></h3>'
        f'<p class="mt-2 text-base leading-copy text-ink-2">{t(p["tagline"])}</p>'
        f'{chips(tech, "mt-5")}'
        f'{related_links(p["id"], "relative z-10 mt-6 border-t border-line pt-4 lg:mt-auto")}'
        '</div></article>'
    )


def project_card(p, gate):
    tech = [x for _, x in p["tech"]]
    return (
        f'<article class="group relative flex flex-col border border-line transition-colors hover:border-ink {CARD_FOCUS}">'
        f'{unit(p, gate=gate)}'
        '<div class="flex flex-1 flex-col p-5 sm:p-6">'
        f'{meta(p)}'
        f'<h3 class="mt-2 text-lg font-bold tracking-tight text-ink"><a href="{item_href(p["id"])}" data-stretch class="{STRETCH}">{t(p["title"])}</a></h3>'
        f'<p class="mt-1 text-ui text-ink-2">{t(p["tagline"])}</p>'
        f'{chips(tech, "mt-4 sm:mt-auto sm:pt-4")}'
        f'{related_links(p["id"], "relative z-10 mt-3")}'
        '</div></article>'
    )


def projects_section():
    feat = next(p for p in PROJECTS if p["featured"])
    rest = [p for p in PROJECTS if not p["featured"]][:2]
    cards = "".join(project_card(p, f"card{n}") for n, p in enumerate(rest, 1))
    return (
        f'<section id="projects" aria-labelledby="projects-title" class="{SEC} border-t border-line"><div class="shell py-8 sm:py-10 lg:py-12">'
        f'{section_heading("projects", count=len(PROJECTS), more=page_href("list"))}'
        f'{project_feature(feat)}<div class="mt-6 grid gap-6 sm:grid-cols-2">{cards}</div></div></section>'
    )


def entry_row(it, thumb):
    # phones: title, then date, then org; wider: title and date share a line. The prize is a field, not an accent word.
    if it["kind"] == "award":
        sub = f'<span class="font-semibold text-award">{t(it["prize"])}</span><span class="text-ink-2">{t(it["org"])}</span>'
    else:
        sub = f'<span class="text-ink-2">{t(it["org"])}</span><span class="text-muted">{t(it["role"])}</span>'
    return (
        f'<li id="{it["id"]}" class="flex gap-4 bg-surface p-4 sm:gap-5 sm:p-5">{thumb}'
        '<div class="min-w-0 flex-1"><div class="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-4">'
        f'<h3 class="text-lg font-bold text-ink">{t(it["title"])}</h3><span class="text-ui tabular-nums text-muted">{period(it["start"], it.get("end"))}</span></div>'
        f'<p class="mt-0.5 flex flex-wrap gap-x-3 text-ui">{sub}</p>{related_links(it["id"], "mt-2")}</div></li>'
    )


def activities_awards():
    acts = "".join(entry_row(a, activity_thumb(a["type"])) for a in ACTIVITIES[:3])
    aws = "".join(entry_row(a, medal_thumb(n)) for n, a in enumerate(AWARDS[:3]))
    return (
        '<div class="border-t border-line"><div class="shell grid gap-x-12 gap-y-10 py-8 sm:py-10 lg:grid-cols-2 lg:py-12">'
        f'<section id="activities" aria-labelledby="activities-title" class="{SEC}">{section_heading("activities", count=len(ACTIVITIES))}<ul class="mt-6 grid gap-3 lg:mt-7">{acts}</ul></section>'
        f'<section id="awards" aria-labelledby="awards-title" class="{SEC}">{section_heading("awards", count=len(AWARDS))}<ul class="mt-6 grid gap-3 lg:mt-7">{aws}</ul></section>'
        '</div></div>'
    )


def has(kind, sel):
    return f"group-has-[[data-kind={kind}]:hover]/soc:{sel}"


def lab_module(kind, first):
    """THE LAB module for one event type. Hovering a matching event tile rings the module (a relationship cue that also
    works with reduced motion); the first module runs its kind's ambient step."""
    ring = cls(has(kind, "ring-4"), has(kind, "ring-inset"), has(kind, "ring-white"))
    if kind == "seminar":
        amb = "motion-safe:animate-sun-step motion-safe:anim-offset-46" if first else ""
        return (f'<div class="relative overflow-hidden bg-primary {ring}"><div class="absolute bottom-0 left-1/2 aspect-2/1 w-[72%] -translate-x-1/2 overflow-hidden rounded-t-full bg-primary-300">'
                f'<div class="{cls("absolute bottom-0 left-1/2 aspect-square h-[56%] -translate-x-1/2 rounded-full bg-primary-50", amb)}"></div></div></div>')
    if kind == "hackathon":
        amb = "motion-safe:animate-hop motion-safe:anim-offset-9" if first else ""
        return f'<div class="relative overflow-hidden bg-primary-700 {ring}"><div class="{cls("tri absolute bottom-0 left-1/2 aspect-8/7 h-[72%] -translate-x-1/2 bg-white", amb)}"></div></div>'
    if kind == "education":
        amb = "motion-safe:animate-diamond-step motion-safe:anim-offset-45" if first else ""
        return f'<div class="relative grid place-items-center overflow-hidden bg-primary-300 {ring}"><div class="{cls("aspect-square h-[46%] bg-ink", amb)}"></div></div>'
    raise KeyError(kind)


EVENT_ART = {
    "seminar": ('<div class="absolute bottom-0 left-1/2 aspect-2/1 w-[64%] -translate-x-1/2 rounded-t-full bg-primary"></div>'
                '<div class="absolute bottom-0 left-1/2 aspect-2/1 w-[30%] -translate-x-1/2 rounded-t-full bg-ink"></div>'),
    "hackathon": ('<div class="absolute inset-x-[8%] bottom-0 flex items-end justify-center gap-[4%]">'
                  '<div class="tri aspect-8/7 w-[56%] bg-primary"></div><div class="tri aspect-8/7 w-[34%] bg-ink"></div></div>'),
    "education": ('<div class="absolute inset-x-[14%] bottom-0 flex items-end gap-[8%]">'
                  '<div class="aspect-square w-[58%] bg-primary"></div><div class="aspect-square w-[30%] bg-ink"></div></div>'),
}


def event_tile(e):
    # phone + 1024-1279: horizontal tile (art left); 640-1023 and >=1280: vertical tile with a fixed-height art panel.
    # An event may show a photo (owner-supplied) in the art panel instead of the shape art; the mockup shows the slot.
    art_cls = "relative min-h-24 overflow-hidden bg-primary-100 sm:h-36 sm:flex-none lg:h-auto xl:h-36"
    if e["id"] in EVENT_PHOTO:
        art = slot("photo", art_cls.replace("bg-primary-100 ", ""), labelled=True, cover=True)
    else:
        art = f'<div aria-hidden="true" class="{art_cls}">{EVENT_ART[e["type"]]}</div>'
    return (
        f'<li id="{e["id"]}" data-kind="{e["type"]}" class="grid grid-cols-[7.5rem_minmax(0,1fr)] bg-white sm:flex sm:flex-col lg:grid xl:flex">'
        f'{art}<div class="p-4 sm:p-5">'
        f'<p class="flex items-center gap-2 text-sm font-semibold text-primary-700">{key_glyph(e["type"])}{s("event_type")[e["type"]]}</p>'
        f'<h3 class="mt-1 text-lg font-bold leading-snug text-ink sm:mt-2">{t(e["title"])}</h3>'
        f'<p class="mt-1 flex flex-wrap gap-x-3 text-ui"><span class="text-ink-2">{t(e["role"])}</span><span class="tabular-nums text-muted">{ym(e["start"])}</span></p></div></li>'
    )


def society_section():
    types = []
    for e in EVENTS:
        if e["type"] not in types:
            types.append(e["type"])
    roles = "".join(f'<div><dt class="text-lg font-bold">{t(r)}</dt><dd class="tabular-nums text-primary-200">{period(a, b, s("present"))}</dd></div>' for r, a, b in SOCIETY["roles"])
    mods = "".join(lab_module(k, n == 0) for n, k in enumerate(types[:3]))
    tiles = "".join(event_tile(e) for e in EVENTS[:3])
    return (
        f'<section id="society" aria-labelledby="society-title" class="{SEC} bg-surface"><div class="shell py-8 sm:py-10 lg:py-12">'
        f'{section_heading("society")}'
        '<div class="group/soc mt-6 grid gap-4 lg:mt-8 lg:grid-cols-12 lg:gap-6">'
        '<div class="grid overflow-hidden bg-ink text-white sm:grid-cols-[minmax(0,1fr)_8.5rem] lg:col-span-6 lg:grid-cols-[minmax(0,1fr)_6rem]">'
        '<div class="p-6 sm:p-8">'
        f'<h3 translate="no" class="text-2xl font-bold tracking-tight">{SOCIETY["title"]}</h3>'
        f'<p class="mt-2 text-pretty text-ui text-primary-200">{s("lab_desc")}</p>'
        f'<dl class="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-ui">{roles}</dl>'
        f'{related_links("the-lab", "mt-5 border-t border-white/20 pt-4", dark=True)}'
        '</div>'
        f'<div aria-hidden="true"{gate_attrs("lab")} class="play-gate grid h-16 grid-cols-3 sm:h-auto sm:grid-cols-1 sm:grid-rows-3">{mods}</div>'
        '</div>'
        f'<ul class="grid gap-4 sm:grid-cols-3 lg:col-span-6 lg:grid-cols-1 xl:grid-cols-3">{tiles}</ul>'
        '</div></div></section>'
    )


PRIM = {"frontend": "", "backend": "rounded-full", "ai-ml": "tri"}
PRIM_AMB = {"frontend": "motion-safe:animate-diamond-step motion-safe:anim-offset-45", "backend": "motion-safe:animate-pulse-step motion-safe:anim-offset-13", "ai-ml": "motion-safe:animate-hop motion-safe:anim-offset-5"}
SKILL_COL = [("bg-ink", ("bg-primary-300", "bg-primary")), ("bg-primary", ("bg-white", "bg-ink")), ("bg-primary-200", ("bg-primary", "bg-ink"))]


CAT_INDEX = {cat: n for n, (cat, _) in enumerate(SKILLS)}


def used_in(names):
    return [p for p in PROJECTS if any(x in names for _, x in p["tech"])]


def skills_section():
    tiles = []
    for g, (cat, items) in enumerate(SKILLS):
        bg, tones = SKILL_COL[g % 3]
        shown = items[:8]
        prims = "".join(
            f'<span class="grid size-8 place-items-center"><span class="{cls("size-6", PRIM[cat], tones[n % 2], PRIM_AMB[cat] if n == 0 else "", "")}"></span></span>'
            for n, _ in enumerate(shown))
        cols = "grid-cols-2 px-1.5" if len(shown) >= 5 else ""
        projs = used_in(items)
        links = "".join(
            f'<a href="{item_href(p["id"])}" class="inline-flex min-h-6 items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">{kind_mark_sm("project")}{t(p["title"])}</a>' for p in projs)
        chips_ = "".join(f'<li translate="no" class="bg-white px-2.5 py-0.5 text-primary-900 sm:py-1">{esc(x)}</li>' for x in items)
        tiles.append(
            '<li class="group grid grid-cols-[3rem_minmax(0,1fr)] bg-surface sm:grid-cols-[4rem_minmax(0,1fr)] xl:grid-cols-[4.5rem_minmax(0,1fr)]">'
            f'<div aria-hidden="true" class="{cls("grid content-center justify-items-center gap-2 py-4 md:py-5", bg, cols)}">{prims}</div>'
            '<div class="min-w-0 p-4 xl:p-6">'
            f'<h3 class="text-lg font-bold text-ink">{s("tech_cat")[cat]}</h3>'
            f'<ul class="mt-2 flex flex-wrap gap-1.5 text-ui font-medium sm:mt-3 sm:gap-2">{chips_}</ul>'
            f'<p class="mt-2 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 text-ui leading-copy text-muted sm:mt-3"><span>{s("used_in")}</span><span class="flex flex-wrap gap-x-4 gap-y-1">{links}</span></p>'
            '</div></li>')
    return (
        f'<section id="skills" aria-labelledby="skills-title" class="{SEC} border-t border-line"><div class="shell py-8 sm:py-10 lg:py-12">'
        f'{section_heading("skills")}<ul{gate_attrs("skills")} class="play-gate mt-6 grid gap-4 lg:mt-8 lg:grid-cols-3">{"".join(tiles)}</ul></div></section>'
    )


def contact_cell(label, value_html, button="", link=False):
    return (f'<div class="{cls("flex min-h-16 flex-col justify-center bg-white px-4 py-3 sm:min-h-20 sm:p-5", "relative" if link else "")}">'
            f'<dt class="text-sm font-medium text-muted">{label}</dt>'
            f'<dd class="mt-0.5 flex items-center justify-between gap-4 text-base font-semibold text-ink"><span class="min-w-0 wrap-anywhere">{value_html}</span>{button}</dd></div>')


def edu_connect():
    c = s("contact")
    cells = (
        contact_cell(c["email"], f'<a href="mailto:{EMAIL}" translate="no" data-copy-value="email" class="after:absolute after:inset-0 hover:text-primary">{EMAIL}</a>', copy_button("email", EMAIL).replace('class="relative inline-flex', 'class="relative z-10 inline-flex', 1), link=True)
        + contact_cell(c["github"], ext(f"https://github.com/{GITHUB}", f"<span translate=\"no\">github.com/{GITHUB}</span>", "after:absolute after:inset-0 hover:text-primary"), link=True)
        + contact_cell(c["instagram"], f'<span translate="no">@{INSTA}</span>')
        + contact_cell(c["discord"], f'<span translate="no" data-copy-value="discord">{DISCORD}</span>', copy_button("discord", DISCORD))
    )
    module = (
        f'<div aria-hidden="true"{gate_attrs("contact")} class="play-gate grid h-16 grid-cols-3 border-t border-ink lg:h-auto lg:grid-cols-1 lg:grid-rows-3 lg:border-l lg:border-t-0">'
        '<div class="relative grid place-items-center bg-primary-100"><span class="relative aspect-3/2 h-[56%]"><span class="absolute left-0 aspect-square h-full rounded-full bg-ink"></span><span class="absolute right-0 aspect-square h-full rounded-full bg-primary"></span></span></div>'
        '<div class="relative grid place-items-center bg-ink"><span class="aspect-square h-[56%] rounded-tl-full bg-primary-300 motion-safe:animate-quarter-step motion-safe:anim-offset-90"></span></div>'
        '<div class="relative overflow-hidden bg-primary"><span class="tri absolute bottom-0 left-1/2 aspect-8/7 h-[68%] -translate-x-1/2 bg-white"></span></div>'
        '</div>'
    )
    edu = (
        f'<section id="education" aria-labelledby="education-title" class="{SEC} lg:col-span-5">{section_heading("education")}'
        '<div class="mt-6 flex items-stretch overflow-hidden bg-surface lg:mt-7"><div class="min-w-0 flex-1 p-5 sm:p-6">'
        f'<h3 class="text-lg font-bold text-ink">{t(EDU["school"])}</h3><p class="mt-0.5 text-pretty text-ui text-ink-2">{t(EDU["major"])}</p>'
        f'<p class="mt-1 text-ui tabular-nums text-muted">{period(EDU["start"], None, s("enrolled"))}</p></div>'
        '<div aria-hidden="true" class="relative flex w-32 shrink-0 items-end gap-1.5 px-4 pt-6 sm:w-44">'
        f'<span class="h-[62%] flex-1 rounded-t-full bg-primary-300"></span>'
        f'<span class="h-[86%] flex-1 rounded-t-full bg-primary"></span>'
        f'<span class="h-[62%] flex-1 rounded-t-full bg-ink"></span>'
        '<span class="absolute inset-x-0 bottom-0 h-2 bg-ink"></span></div></div></section>'
    )
    con = (
        f'<section id="connect" aria-labelledby="connect-title" class="{SEC} lg:col-span-7">{section_heading("connect")}'
        f'<div class="mt-6 grid border border-ink lg:mt-7 lg:grid-cols-[minmax(0,1fr)_6rem]"><dl class="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">{cells}</dl>{module}</div></section>'
    )
    return f'<div class="border-t border-line"><div class="shell grid gap-x-12 gap-y-10 py-8 sm:py-10 lg:grid-cols-12 lg:py-12">{edu}{con}</div></div>'


def home_body():
    return f'<main id="main">{hero()}{projects_section()}{activities_awards()}{society_section()}{skills_section()}{edu_connect()}</main>'


# ───────────────────────────── detail ─────────────────────────────
DETAIL_TOC = ["summary", "contributions", "screens", "features", "tech", "outcomes", "challenges", "related"]
DETAIL_MARKS = None  # removed: one square tick per section, like the TOC (the gallery carries the page's geometry)


def toc_attrs(i):
    proto = f'data-toc="{i}"' + (' aria-current="location"' if i == DETAIL_TOC[0] else "")
    dc = f'data-toc="{i}" aria-current="{{{{toc.{i}.aria}}}}" onClick="{{{{toc.{i}.click}}}}"'
    return A(proto, dc)


def ph(text, extra=""):
    return f'<span class="{cls("font-normal text-muted", extra)}">{text}</span>'


def bullet_li(content, tone="text-muted"):
    return f'<li class="flex gap-3 text-base leading-prose {tone}"><span aria-hidden="true" class="mt-2.5 size-2 shrink-0 bg-primary"></span><span class="min-w-0">{content}</span></li>'


def detail_body():
    p = PROJECTS[0]
    pp = s("ph")
    df = s("d_facts")
    award = INDEX["award-oo-hackathon"]
    n_media = len(MEDIA.get(p["id"], []))
    # placeholders until the fact sheet supplies the URLs: same box, dashed edge, not interactive
    buttons = (
        f'<span class="inline-flex h-11 items-center gap-2.5 border border-dashed border-ink px-4 text-ui font-semibold text-ink"><span aria-hidden="true" class="size-3 rounded-full bg-primary"></span>{pp["demo"]} {ph(pp["link"])}</span>'
        f'<span class="inline-flex h-11 items-center gap-2.5 border border-dashed border-ink px-4 text-ui font-semibold text-ink"><span aria-hidden="true" class="size-3 bg-ink"></span>{pp["github"]} {ph(pp["link"])}</span>'
    )

    def fcell(label, val, tab=False):
        return (f'<div class="border-b border-line py-4 pr-4"><dt class="text-sm text-muted">{label}</dt>'
                f'<dd class="{cls("mt-0.5 text-ui font-semibold text-ink", "tabular-nums" if tab else "")}">{val}</dd></div>')

    facts = (fcell(df["period"], period(p["start"], p["end"]), True) + fcell(df["kind"], form_label(p))
             + fcell(df["team"], ph(pp["team"])) + fcell(df["role"], ph(pp["role"]))
             + fcell(df["status"], ph(pp["status"])) + fcell(df["deploy"], f'{s("live")}<span class="block text-sm font-normal text-muted">{pp["deploy_detail"]}</span>'))
    glyphs = "".join(MEDIA_GLYPH[k] for k in kinds_of(p["id"]))
    all_link = (f'<a href="#screens" class="mt-3 inline-flex min-h-6 items-center gap-2 text-ui font-semibold text-primary underline-offset-4 hover:underline">'
                f'<span aria-hidden="true" class="flex items-end gap-1">{glyphs}</span>{s("all_screens").format(n=n_media)}</a>') if n_media > 1 else ""
    # phones: intro -> poster -> actions/facts (the product shows right after the title); desktop: text 5 / poster 7
    hero_ = (
        '<div class="shell grid gap-x-12 pb-12 pt-6 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pb-16 lg:pt-12">'
        '<div class="lg:col-span-5">'
        f'<a href="{page_href("list")}" class="inline-flex min-h-6 items-center text-ui font-semibold text-primary underline-offset-4 hover:underline">{s("all_projects")}</a>'
        f'<h1 class="mt-5 text-5xl font-bold leading-display tracking-display text-ink lg:text-title">{t(p["title"])}</h1>'
        f'<p class="mt-4 max-w-160 text-pretty text-lg leading-copy text-ink-2">{t(p["tagline"])}</p></div>'
        f'<div class="group mt-6 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:mt-0">{poster_l3(p, labelled=True, gate="hero", pop=True)}{all_link}</div>'
        '<div class="mt-7 lg:col-span-5 lg:row-start-2 lg:mt-8">'
        f'<div class="flex flex-wrap items-center gap-3">{buttons}{live_badge() if p["live"] else ""}</div>'
        f'<dl class="mt-8 grid grid-cols-2 border-t border-ink">{facts}</dl></div></div>'
    )
    names = s("d_sections")
    toc = "".join(
        f'<li><a href="#{i}"{toc_attrs(i)} class="group flex items-center gap-3 py-2 text-ui text-muted transition-colors hover:text-ink aria-[current=location]:text-ink">'
        f'<span aria-hidden="true" class="size-2.5 shrink-0 border-2 border-ink group-aria-[current=location]:border-primary group-aria-[current=location]:bg-primary forced-colors:group-aria-[current=location]:bg-[CanvasText]"></span>{names[i]}</a></li>'
        for i in DETAIL_TOC)

    def sec(i, body):
        return (f'<section id="{i}" aria-labelledby="{i}-title" class="{SEC}"><h2 id="{i}-title" class="flex items-center gap-3 text-2xl font-bold tracking-tight text-ink">'
                f'<span aria-hidden="true" class="size-3 shrink-0 bg-ink"></span>{names[i]}</h2>{body}</section>')

    tech_rows = "".join(
        f'<li class="grid grid-cols-[2.5rem_7rem_minmax(0,1fr)] items-center gap-3 border-b border-line py-3">'
        f'<span aria-hidden="true" class="grid size-10 place-items-center {SKILL_COL[CAT_INDEX[cat]][0]}"><span class="{cls("size-6", PRIM[cat], SKILL_COL[CAT_INDEX[cat]][1][0])}"></span></span>'
        f'<span class="text-sm font-semibold text-muted">{s("tech_cat")[cat]}</span>{chips([name])}</li>'
        for n, (cat, name) in enumerate(p["tech"]))
    rel_cards = "".join(
        f'<li><a href="{item_href(r)}" class="group flex items-center gap-4 border border-line p-4 transition-colors hover:border-ink active:border-ink">{item_thumb(r, "size-12")}'
        f'<span class="min-w-0"><span class="sr-only">{s("kind")[INDEX[r]["kind"]]}: </span><span class="block text-sm font-semibold tabular-nums text-muted">{ym(INDEX[r]["start"])}</span>'
        f'<span class="block text-ui font-bold text-ink">{title_of(INDEX[r])}</span></span>'
        f'<span aria-hidden="true" class="tri ml-auto size-3 shrink-0 rotate-90 bg-ink motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover:translate-x-1"></span></a></li>'
        for r in related(p["id"]))
    outcome = (f'<a href="{item_href(award["id"])}" class="inline-flex items-center gap-1.5 font-semibold text-award underline-offset-4 hover:underline">'
               f'{kind_mark_sm("award")}<span class="sr-only">{s("kind")["award"]}: </span>{title_of(award)}</a> <span class="whitespace-nowrap">{s("award_outcome_suffix")}</span>')
    body = (
        sec("summary", f'<p class="mt-5 max-w-160 text-lg leading-read">{ph(pp["summary"])}</p>')
        + sec("contributions", '<ul class="mt-5 grid max-w-160 gap-3">' + "".join(bullet_li(pp["contrib"].format(n=n)) for n in (1, 2, 3)) + "</ul>")
        + sec("screens", gallery(p))
        + sec("features", '<dl class="mt-5 max-w-160 divide-y divide-line border-y border-line">' + "".join(
            f'<div class="grid gap-1 py-5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8"><dt class="text-base font-bold text-muted">{pp["feature"].format(n=n)}</dt><dd class="text-ui text-muted">{pp["feature_desc"]}</dd></div>'
            for n in (1, 2, 3)) + "</dl>")
        + sec("tech", f'<ul class="mt-5 max-w-160 border-t border-line">{tech_rows}</ul>')
        + sec("outcomes", f'<ul class="mt-5 grid max-w-160 gap-3">{bullet_li(outcome, "text-ink-2")}</ul>')
        + sec("challenges",
              '<ul class="mt-5 grid gap-4"><li class="grid gap-3 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">'
              f'<div class="bg-surface p-5"><p class="text-sm font-semibold text-muted">{s("problem")}</p><p class="mt-1 text-base leading-prose text-muted">{pp["problem"]}</p></div>'
              '<div aria-hidden="true" class="grid h-11 place-items-center md:h-auto"><div class="flex rotate-90 items-center gap-1 md:rotate-0">'
              '<span class="size-3 bg-ink"></span><span class="h-0.5 w-4 bg-ink-2"></span><span class="size-3 rounded-full bg-primary"></span></div></div>'
              f'<div class="border border-ink p-5"><p class="text-sm font-semibold text-primary-700">{s("solution")}</p><p class="mt-1 text-base leading-prose text-muted">{pp["solution"]}</p></div>'
              '</li></ul>')
        + sec("related", f'<ul class="mt-5 grid gap-3 sm:grid-cols-2">{rel_cards}</ul>')
    )
    order = PROJECTS
    i = order.index(p)
    prev_p, next_p = order[i - 1], order[(i + 1) % len(order)]
    pager = (
        f'<nav aria-label="{s("other_projects")}" class="border-t border-line"><div class="shell grid sm:grid-cols-2">'
        f'<a href="{item_href(prev_p["id"])}" class="group flex items-center gap-4 py-6">{cover(prev_p, "mini", extra="shrink-0")}'
        f'<span class="min-w-0"><span class="block text-sm text-muted">{s("prev")}</span><span class="block text-lg font-bold text-ink transition-colors group-hover:text-primary">{t(prev_p["title"])}</span></span></a>'
        f'<a href="{item_href(next_p["id"])}" class="group flex items-center gap-4 border-t border-line py-6 sm:flex-row-reverse sm:border-l sm:border-t-0 sm:pl-6 sm:text-right">{cover(next_p, "mini", extra="shrink-0")}'
        f'<span class="min-w-0"><span class="block text-sm text-muted">{s("next")}</span><span class="block text-lg font-bold text-ink transition-colors group-hover:text-primary">{t(next_p["title"])}</span></span></a>'
        '</div></nav>'
    )
    return (
        f'<main id="main">{hero_}'
        '<div class="border-t border-line"><div class="shell grid gap-x-12 py-12 lg:grid-cols-12 lg:py-16">'
        f'<nav aria-label="{s("on_this_page")}" class="lg:col-span-3"><div class="lg:sticky lg:top-24"><p class="text-sm font-semibold text-muted">{s("on_this_page")}</p>'
        f'<ul class="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">{toc}</ul></div></nav>'
        f'<div class="mt-10 min-w-0 space-y-14 lg:col-span-9 lg:mt-0 lg:max-w-184">{body}</div>'
        f'</div></div>{pager}</main>'
    )


# ───────────────────────────── list ─────────────────────────────
def list_body():
    rows = []
    for n, p in enumerate(PROJECTS):
        tech = [x for _, x in p["tech"]]
        status = live_badge() if p["live"] else ""
        rows.append(
            f'<li class="group relative grid gap-5 border-b border-line py-6 transition-colors hover:bg-primary-50/40 active:bg-primary-50 {CARD_FOCUS} sm:grid-cols-[16rem_minmax(0,1fr)] sm:items-start lg:grid-cols-[20rem_minmax(0,1fr)_auto] lg:items-center lg:gap-8">'
            f'{unit(p, gate=f"row{n}")}'
            '<div class="min-w-0">'
            f'{meta(p, "lg:[&>.text-live]:hidden")}'
            f'<h2 class="mt-1 text-2xl font-bold tracking-tight text-ink"><a href="{item_href(p["id"])}" data-stretch class="{STRETCH}">{t(p["title"])}</a></h2>'
            f'<p class="mt-1.5 text-ui text-ink-2">{t(p["tagline"])}</p>{chips(tech, "mt-3")}{related_links(p["id"], "relative z-10 mt-3")}</div>'
            f'<div class="hidden text-sm font-semibold lg:flex lg:flex-col lg:items-end lg:gap-3">{status}{kind_counts(p, "justify-end font-medium")}'
            '<span aria-hidden="true" class="tri mt-1 size-3.5 rotate-90 bg-ink motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-snap motion-safe:group-hover:translate-x-1"></span></div></li>'
        )
    return (
        '<main id="main" class="shell py-10 lg:py-14">'
        f'<a href="{page_href("home")}" class="inline-flex min-h-6 items-center text-ui font-semibold text-primary underline-offset-4 hover:underline">{s("back_home")}</a>'
        f'<div class="mt-6 flex items-center gap-4">{kind_mark("projects", "size-16")}<h1 class="text-5xl font-bold tracking-display text-ink">{s("nav")["projects"]}</h1>'
        f'<span class="pt-2 text-ui tabular-nums text-muted">{s("count").format(n=len(PROJECTS))}</span></div>'
        f'<ol class="mt-10 border-t border-ink">{"".join(rows)}</ol></main>'
    )


# ───────────────────────────── page shells ─────────────────────────────
def body_for(page):
    skip = f'<a href="#main" class="sr-only z-60 bg-ink px-4 py-2 text-ui text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{s("skip")}</a>'
    main = {"home": home_body, "detail": detail_body, "list": list_body}[page]()
    return f'{skip}{header()}{main}{footer()}{status_region()}'


ROOT_CLS = "scroll-smooth scroll-pt-32 md:scroll-pt-24 lg:scroll-pt-20 tiny:scroll-pt-0 motion-reduce:scroll-auto data-[motion=off]:[--play:paused]"
TITLES = {"home": "title_home", "detail": "title_detail", "list": "title_list"}

PROTO_JS = open(os.path.join(HERE, "page.js"), encoding="utf8").read()
DC_JS = open(os.path.join(HERE, "dc-logic.js"), encoding="utf8").read()


def render_proto(page, lc):
    global MODE
    MODE = "proto"
    CTX.update(loc=lc, page=page, mobile=False)
    font = '@font-face{font-family:"Pretendard Variable";src:url("../../design/fonts/PretendardVariable.woff2") format("woff2");font-weight:45 920;font-display:swap}'
    return (f'<!doctype html>\n<html lang="{lc}" class="{ROOT_CLS}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            f'<title>{s(TITLES[page])}</title>\n<style>{font}</style>\n<link rel="stylesheet" href="../sys.css">\n</head>\n<body>\n{body_for(page)}\n<script>\n{PROTO_JS}</script>\n</body>\n</html>\n')


def dc_cfg(page):
    copy = {}
    if page == "home":
        copy = {"email": {"value": EMAIL, "status": s("copied_email")}, "discord": {"value": DISCORD, "status": s("copied_discord")}}
    gates = {"home": ["feature", "card1", "card2", "lab", "skills", "contact", "plinth"], "detail": ["hero", "plinth"], "list": ["row0", "row1", "row2", "plinth"]}[page]
    return {
        "nav": NAV_IDS if page == "home" else None,
        "toc": DETAIL_TOC if page == "detail" else None,
        "gates": gates, "copy": copy,
        "copyIdle": s("copy"), "copied": s("copied"), "copyFail": s("copy_failed"), "copyHint": s("copy_failed_hint"),
    }


def render_dc(page, lc, mobile, css_blob, w, h):
    global MODE
    MODE = "dc"
    CTX.update(loc=lc, page=page, mobile=mobile)
    helmet = ('<style>\n'
              f'@font-face{{font-family:"Pretendard Variable";src:url({FONT_BLOB}) format("woff2");font-weight:45 920;font-style:normal;font-display:swap}}\n'
              'body{margin:0}\nhtml{scroll-behavior:smooth;scroll-padding-top:8rem}\n@media (width>=48rem){html{scroll-padding-top:6rem}}\n@media (width>=64rem){html{scroll-padding-top:5rem}}\n@media (max-height:240px){html{scroll-padding-top:0}}\n@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}\n'
              '</style>')
    root = f'<div data-motion="{{{{motion.state}}}}" class="data-[motion=off]:[--play:paused]">{body_for(page)}</div>'
    js = DC_JS.replace("__CFG__", json.dumps(dc_cfg(page), ensure_ascii=False))
    props = json.dumps({"$preview": {"width": w, "height": h}})
    return (f'<!doctype html>\n<html lang="{lc}">\n<head>\n<meta charset="utf-8">\n<title>{s(TITLES[page])}</title>\n<script src="./support.js"></script>\n'
            f'<link rel="stylesheet" href="{css_blob}">\n</head>\n<body>\n<x-dc>\n<helmet>\n{helmet}\n</helmet>\n{root}\n</x-dc>\n'
            f"<script type=\"text/x-dc\" data-dc-script data-props='{props}'>\n{js}</script>\n</body>\n</html>\n")


BOARDS = [  # file, page, loc, mobile
    ("Main.dc.html", "home", "ko", False), ("Project.dc.html", "detail", "ko", False), ("Projects.dc.html", "list", "ko", False),
    ("Mobile.dc.html", "home", "ko", True), ("Project-mobile.dc.html", "detail", "ko", True), ("Projects-mobile.dc.html", "list", "ko", True),
    ("Main-en.dc.html", "home", "en", False), ("Project-en.dc.html", "detail", "en", False), ("Projects-en.dc.html", "list", "en", False),
    ("Mobile-en.dc.html", "home", "en", True), ("Project-mobile-en.dc.html", "detail", "en", True), ("Projects-mobile-en.dc.html", "list", "en", True),
]
BOARD_TITLES = {
    ("home", "ko", False): "홈 · 1440", ("detail", "ko", False): "프로젝트 상세 · 1440", ("list", "ko", False): "프로젝트 목록 · 1440",
    ("home", "ko", True): "홈 · 390", ("detail", "ko", True): "프로젝트 상세 · 390", ("list", "ko", True): "프로젝트 목록 · 390",
    ("home", "en", False): "Home · 1440", ("detail", "en", False): "Project detail · 1440", ("list", "en", False): "All projects · 1440",
    ("home", "en", True): "Home · 390", ("detail", "en", True): "Project detail · 390", ("list", "en", True): "All projects · 390",
}


def main():
    if sys.argv[1] == "proto":
        for page in ("home", "detail", "list"):
            for lc in ("ko", "en"):
                d = os.path.join(PROTO, f"sys-{page}-{lc}")
                os.makedirs(d, exist_ok=True)
                with open(os.path.join(d, "index.html"), "w", encoding="utf8") as f:
                    f.write(render_proto(page, lc))
        print("proto pages written")
        return
    if sys.argv[1] == "dc":
        css_blob, out = sys.argv[2], sys.argv[3]
        heights = json.load(open(os.path.join(HERE, "heights.json")))
        os.makedirs(os.path.join(out, "project"), exist_ok=True)
        boards, order = {}, []
        x_desk = {"home": 0, "detail": 1520, "list": 3040}
        x_mob = {"home": 4560, "detail": 5030, "list": 5500}
        row_h = max(heights.values()) + 420
        for fname, page, lc, mobile in BOARDS:
            w = 390 if mobile else 1440
            h = heights[f"{page}-{lc}-{w}"]
            with open(os.path.join(out, "project", fname), "w", encoding="utf8") as f:
                f.write(render_dc(page, lc, mobile, css_blob, w, h))
            e = {"x": (x_mob if mobile else x_desk)[page], "y": 0 if lc == "ko" else row_h, "w": w, "h": h, "title": BOARD_TITLES[(page, lc, mobile)]}
            if not mobile:
                e["expand"] = "fill"
            e["is_interactive"] = True
            boards[fname] = e
            order.append(fname)
        canvas = {
            "v": 3, "createdOnFiles": {"v": 1, "at": "2026-10-10T07:30:00Z"}, "title": "홍길동 포트폴리오", "launch": {"view": "canvas"}, "pages": [],
            "boards": boards, "order": order,
            "notes": {
                "title": {"x": 0, "y": -300, "text": "한국어 — 홈 · 프로젝트 상세 · 전체 목록 · 모바일", "kind": "title1", "maxW": 5890},
                "english": {"x": 0, "y": row_h - 300, "text": "English — Home · Project detail · All projects · Mobile", "kind": "title1", "maxW": 5890},
            },
            "designSystems": [],
        }
        with open(os.path.join(out, "project", "canvas.json"), "w", encoding="utf8") as f:
            json.dump(canvas, f, ensure_ascii=False, indent=1)
        print("dc boards written", out)


if __name__ == "__main__":
    main()
