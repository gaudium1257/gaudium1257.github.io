#!/usr/bin/env python3
""""Clean Stack" mockups from one source (replaces "Moving Poster").

python3 gen.py proto            -> proto/sys-{home,detail,detail2,list}-{ko,en}/index.html (static Tailwind pages + vanilla JS)
python3 gen.py dc <css-blob> <out> -> <out>/project/*.dc.html (canvas artboards, same markup, DCLogic state)

Principles: (1) text carries the page; (2) every claim points to evidence (a tech lists the projects that used it,
a project shows its GitHub repository, awards and projects link both ways); (3) a framed panel means "built from
code data" (stack map, repository card), biography stays plain rows; (4) pages are assembled from a few data-driven
components, and the project page composes its blocks from the data each project has (one default template).
"""
import html as _h
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SCR = os.path.dirname(HERE)
PROTO = os.path.join(SCR, "proto")
FONT_BLOB = "/_blob/76760fbe63bd614486cd18b85bb00898"
NBSP = " "

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
    s_ = proto if MODE == "proto" else dc
    return (" " + s_) if s_ else ""


# ───────────────────────────── strings ─────────────────────────────
S = {
    "ko": dict(
        title_home="홍길동 포트폴리오", title_detail="스터디 타이머 — 홍길동", title_detail2="강의 요약 챗봇 — 홍길동", title_list="프로젝트 — 홍길동",
        skip="본문으로 건너뛰기", nav_label="섹션 바로가기", lang_label="언어 선택", lang_names=dict(ko="한국어", en="English"),
        nav=dict(about="소개", skills="기술 스택", projects="프로젝트", activities="대외활동", awards="수상",
                 society="학회", education="학력", connect="연락처"),
        photo="증명사진 3:4", photo_aria="증명사진 자리 (3:4)",
        facts=dict(affiliation="소속", society="학회", email="이메일", github="GitHub"),
        affiliation="한국대학교 컴퓨터공학과 재학 중", society_role="THE LAB 교육팀장",
        copy="복사", copied="복사됨", copy_failed="복사 실패", copy_failed_hint="복사하지 못했어요. 선택된 글자를 직접 복사해 주세요.",
        copy_email_sr=("이메일 주소 ", ""), copy_discord_sr=("Discord 사용자명 ", ""),
        copied_email="이메일 주소를 복사했습니다.", copied_discord="Discord 사용자명을 복사했습니다.",
        stack_help="숫자는 그 기술을 쓴 프로젝트 수예요. 숙련도가 아니에요. 기술을 누르면 그 기술로 만든 프로젝트만 보여요.",
        stack_none="점선은 아직 프로젝트에 기록되지 않은 기술이에요.",
        sr_count="프로젝트 {n}개: {names}", sr_none="기록된 프로젝트 없음",
        cat={"language": "언어", "frontend": "프론트엔드", "backend": "백엔드", "mobile": "모바일", "ai-ml": "AI", "data": "데이터",
             "database": "DB", "infra": "인프라", "tooling": "도구", "other": "기타"},
        stack_label="기술 스택",
        count="{n}개", view_all="프로젝트 {n}개 모두 보기", list_link="프로젝트 목록",
        filter_status="{tech} 사용 프로젝트 {n}개", filter_clear="필터 해제", filter_label="기술로 거르기",
        phrase=dict(team_hackathon="해커톤 팀 프로젝트", club="학회 프로젝트", personal="개인 프로젝트"),
        live="배포 중", related="관련", highlights_sr="핵심",
        kind=dict(project="프로젝트", award="수상", activity="대외활동", event="학회 행사", society="학회"),
        repo_ph="[저장소]", star_sr="GitHub 별", stars_ph="[★ 수]", commit="최근 커밋", commit_ph="[yyyy.mm]",
        provenance="별과 최근 커밋은 [yyyy.mm.dd] 기준 GitHub 값이에요.",
        slot=dict(web=("웹 화면", "16:10"), mobile=("휴대폰", "9:19.5"), photo=("사진", "4:3")),
        slot_aria=dict(web="웹 화면 자리 (16:10)", mobile="휴대폰 화면 자리 (9:19.5)", photo="사진 자리 (4:3)"),
        media_kind=dict(web="웹 화면", mobile="휴대폰 화면", photo="사진"),
        present="현재", enrolled="재학 중",
        lab_desc="AI 교육, 바이브코딩 교육, 해커톤 운영", lab_roles="역할", lab_events="행사",
        event_type=dict(seminar="세미나", hackathon="해커톤", education="교육"),
        contact=dict(email="이메일", github="GitHub", instagram="Instagram", discord="Discord"),
        new_tab="(새 탭)", footer="© 2026 홍길동", back_to_top="맨 위로",
        # detail
        crumbs_label="이동 경로", crumbs=("홈", "프로젝트"), toc="이 페이지",
        d_facts=dict(period="기간", kind="종류", team="팀", role="역할", status="진행 상태", deploy="배포"),
        ph=dict(team="[인원]", role="[역할]", status="[진행 상태]", deploy_detail="[플랫폼], [확인 시점] 확인", deploy_status="[배포 상태]",
                summary="[요약 — 팩트시트. 무엇을, 누구를 위해, 어떤 문제를 푸는지 2–4문장]",
                arch="[구조 — 팩트시트의 architecture. 코드에서 확인한 구성만]",
                contrib="[내가 한 일 {n}]", feature="[핵심 기능 {n}]", feature_desc="[설명]", highlight="[핵심 {n} — 팩트시트]",
                problem="[문제]", solution="[해결]", outcome="[결과 — 근거가 있는 것만]", learning="[배운 점 — 본인 확인]",
                caption="[화면 설명 — 팩트시트]", link="[링크]", snapshot="[yyyy.mm.dd]", license="[라이선스]", langs="[언어 비율]"),
        demo="데모 열기",
        repo_title="GitHub 저장소", stars="별", license="라이선스",
        repo_note="{d} 기준 GitHub 값이에요.",
        langs_title="GitHub 언어 비율", langs_note="측정값, {d} 기준",
        tech_link_sr="이 기술을 쓴 프로젝트 보기",
        shared="같은 기술을 쓴 다른 프로젝트",
        sec=dict(summary="요약", contrib="내가 한 일", screens="화면", features="핵심 기능", stack="기술 스택", arch="구조",
                 challenges="문제와 해결", outcomes="결과", learnings="배운 점", related="관련 항목"),
        problem="문제", solution="해결", related_award="관련 수상",
        all_screens="화면 {n}개 모두 보기", more_screens="화면 더 보기 ({n})", full_size="원본 크기로 보기",
        prev="이전 프로젝트", next="다음 프로젝트", all_projects="프로젝트 {n}개 모두 보기", other_projects="다른 프로젝트",
        back_home="홈으로",
    ),
    "en": dict(
        title_home="Gildong Hong — Portfolio", title_detail="Study Timer — Gildong Hong", title_detail2="Lecture Summary Chatbot — Gildong Hong",
        title_list="Projects — Gildong Hong",
        skip="Skip to content", nav_label="Sections", lang_label="Language", lang_names=dict(ko="한국어", en="English"),
        nav=dict(about="About", skills="Tech stack", projects="Projects", activities="Activities", awards="Awards",
                 society="Society", education="Education", connect="Contact"),
        photo="ID photo 3:4", photo_aria="ID photo slot (3:4)",
        facts=dict(affiliation="Affiliation", society="Society", email="Email", github="GitHub"),
        affiliation="Computer Science and Engineering, Hankuk University (enrolled)", society_role="THE LAB, Head of Education",
        copy="Copy", copied="Copied", copy_failed="Copy failed", copy_failed_hint="Couldn’t copy. The text is selected, so copy it by hand.",
        copy_email_sr=("", " email address"), copy_discord_sr=("", " Discord username"),
        copied_email="Email address copied.", copied_discord="Discord username copied.",
        stack_help="Numbers count the projects that used each technology, not skill level. Pick one to see only those projects.",
        stack_none="Dashed items aren’t recorded in a project yet.",
        sr_count="projects: {n} ({names})", sr_none="no recorded projects",
        cat={"language": "Language", "frontend": "Frontend", "backend": "Backend", "mobile": "Mobile", "ai-ml": "AI", "data": "Data",
             "database": "Database", "infra": "Infra", "tooling": "Tooling", "other": "Other"},
        stack_label="Tech stack",
        count="{n}", view_all="See all projects ({n})", list_link="Project list",
        filter_status="Projects using {tech}: {n}", filter_clear="Clear filter", filter_label="Filter by technology",
        phrase=dict(team_hackathon="Team project at a hackathon", club="Society project", personal="Solo project"),
        live="Live", related="Related", highlights_sr="Highlights",
        kind=dict(project="Project", award="Award", activity="Activity", event="Society event", society="Society"),
        repo_ph="[repo]", star_sr="GitHub stars", stars_ph="[★ count]", commit="Last commit", commit_ph="[yyyy.mm]",
        provenance="Stars and last commit are from GitHub as of [yyyy.mm.dd].",
        slot=dict(web=("Web screen", "16:10"), mobile=("Phone", "9:19.5"), photo=("Photo", "4:3")),
        slot_aria=dict(web="Web screen slot (16:10)", mobile="Phone screen slot (9:19.5)", photo="Photo slot (4:3)"),
        media_kind=dict(web="Web screen", mobile="Phone screen", photo="Photo"),
        present="Present", enrolled="Enrolled",
        lab_desc="AI education, vibe-coding education, hackathon operations", lab_roles="Roles", lab_events="Events",
        event_type=dict(seminar="Seminar", hackathon="Hackathon", education="Education"),
        contact=dict(email="Email", github="GitHub", instagram="Instagram", discord="Discord"),
        new_tab="(new tab)", footer="© 2026 Gildong Hong", back_to_top="Back to top",
        crumbs_label="Breadcrumb", crumbs=("Home", "Projects"), toc="On this page",
        d_facts=dict(period="Period", kind="Type", team="Team", role="Role", status="Status", deploy="Deployment"),
        ph=dict(team="[Team size]", role="[Role]", status="[Status]", deploy_detail="on [Platform], checked [date]", deploy_status="[Deployment status]",
                summary="[Summary — fact sheet. What it is, who it is for, what problem it solves, in 2–4 sentences]",
                arch="[Architecture — from the fact sheet. Only what the code shows]",
                contrib="[What I did {n}]", feature="[Key feature {n}]", feature_desc="[Description]", highlight="[Highlight {n} — fact sheet]",
                problem="[Problem]", solution="[Solution]", outcome="[Outcome — with evidence only]", learning="[Learning — confirmed by the owner]",
                caption="[Caption — fact sheet]", link="[link]", snapshot="[yyyy.mm.dd]", license="[license]", langs="[languages]"),
        demo="Open demo",
        repo_title="GitHub repository", stars="Stars", license="License",
        repo_note="From GitHub as of {d}.",
        langs_title="GitHub languages", langs_note="measured, as of {d}",
        tech_link_sr="see projects using this technology",
        shared="Other projects using the same technology",
        sec=dict(summary="Summary", contrib="What I did", screens="Screens", features="Key features", stack="Tech stack", arch="Architecture",
                 challenges="Problems and solutions", outcomes="Outcomes", learnings="Learnings", related="Related"),
        problem="Problem", solution="Solution", related_award="Related award",
        all_screens="See all screens ({n})", more_screens="More screens ({n})", full_size="View full size",
        prev="Previous project", next="Next project", all_projects="See all projects ({n})", other_projects="Other projects",
        back_home="Back to home",
    ),
}


def s(key):
    return S[loc()][key]


NAV_IDS = ["about", "skills", "projects", "activities", "awards", "society", "education", "connect"]

# ───────────────────────────── content (fictional sample, proto/content.md) ─────────────────────────────
NAME = {"ko": "홍길동", "en": "Gildong Hong"}
ROLES = {"ko": "AI·웹 개발, AI·바이브코딩 교육, 해커톤 운영", "en": "Builds AI and web apps, teaches AI and vibe coding, runs hackathons"}
INTRO = {
    "ko": "일상의 불편을 작은 서비스로 풀어내는 개발자입니다. AI와 웹으로 만들고, 학회에서 바이브코딩을 가르칩니다.",
    "en": "I’m a developer who turns everyday inconveniences into small services. I build with AI and the web, and teach vibe coding at THE LAB.",
}
EMAIL, GITHUB, INSTA, DISCORD = "hong@example.com", "gaudium1257", "gildong.dev", "gildong"

PROJECTS = [
    dict(id="study-timer", kind="project", title={"ko": "스터디 타이머", "en": "Study Timer"},
         tagline={"ko": "함께 공부하는 시간을 기록하는 웹앱", "en": "A web app that records time spent studying together"},
         phrase="team_hackathon", start="2025-03", end="2025-06", live=True, featured=True, github=True, has={"arch", "challenges", "outcomes", "learnings"},
         tech=[("frontend", "Next.js"), ("backend", "Supabase")]),
    dict(id="attendance", kind="project", title={"ko": "학회 출석 관리 서비스", "en": "Society Attendance Service"},
         tagline={"ko": "학회 세션 출석을 QR로 기록", "en": "Records attendance at society sessions with QR codes"},
         phrase="club", start="2025-01", end="2025-02", live=False, featured=False, github=True, has={"outcomes"},
         tech=[("frontend", "React"), ("backend", "Firebase")]),
    dict(id="lecture-bot", kind="project", title={"ko": "강의 요약 챗봇", "en": "Lecture Summary Chatbot"},
         tagline={"ko": "강의 자료를 요약하고 질문에 답하는 챗봇", "en": "A chatbot that summarizes lecture materials and answers questions"},
         phrase="personal", start="2024-09", end="2024-12", live=False, featured=False, github=True, has={"learnings"},
         tech=[("backend", "FastAPI"), ("ai-ml", "OpenAI API")]),
]
ACTIVITIES = [
    dict(id="act-oo-hackathon", kind="activity", title={"ko": "OO 해커톤 참가", "en": "OO Hackathon (participant)"},
         org={"ko": "OO재단", "en": "OO Foundation"}, role={"ko": "프론트엔드", "en": "Frontend"}, start="2025-05"),
    dict(id="act-startup-club", kind="activity", title={"ko": "교내 창업 동아리", "en": "Campus Startup Club"},
         org={"ko": "한국대학교", "en": "Hankuk University"}, role={"ko": "기획", "en": "Planning"}, start="2024-03", end="2024-12"),
]
AWARDS = [
    dict(id="award-oo-hackathon", kind="award", title={"ko": "OO 해커톤", "en": "OO Hackathon"}, prize={"ko": "대상", "en": "Grand Prize"},
         org={"ko": "OO재단", "en": "OO Foundation"}, start="2025-05"),
    dict(id="award-sw-contest", kind="award", title={"ko": "교내 SW 경진대회", "en": "Campus SW Contest"}, prize={"ko": "우수상", "en": "Excellence Award"},
         org={"ko": "한국대학교", "en": "Hankuk University"}, start="2024-11"),
]
SOCIETY = dict(id="the-lab", kind="society", title="THE LAB",
               roles=[({"ko": "교육팀장", "en": "Head of Education"}, "2025-03", None),
                      ({"ko": "교육팀원", "en": "Education team member"}, "2024-09", "2025-02")])
EVENTS = [
    dict(id="evt-ai-seminar", kind="event", type="seminar", title={"ko": "AI 세미나", "en": "AI Seminar"}, role={"ko": "발표", "en": "Speaker"}, start="2025-11"),
    dict(id="evt-ai-hackathon", kind="event", type="hackathon", title={"ko": "교내 AI 해커톤 운영", "en": "Campus AI Hackathon operations"}, role={"ko": "운영총괄", "en": "Lead organizer"}, start="2025-08"),
    dict(id="evt-vibe-intro", kind="event", type="education", title={"ko": "바이브코딩 입문 교육", "en": "Intro to Vibe Coding"}, role={"ko": "강사", "en": "Instructor"}, start="2025-03"),
]
SKILLS = [  # skills.json groups; names must match projects' techStack (TypeScript has no recorded project yet)
    ("frontend", ["Next.js", "React", "TypeScript"]),
    ("backend", ["FastAPI", "Supabase", "Firebase"]),
    ("ai-ml", ["OpenAI API"]),
]
EDU = dict(school={"ko": "한국대학교", "en": "Hankuk University"}, major={"ko": "컴퓨터공학과", "en": "Computer Science and Engineering"}, start="2024-03")
EDGES = [("study-timer", "award-oo-hackathon"), ("study-timer", "act-oo-hackathon")]  # content.md: 스터디 타이머 관련 only
# Media per project, by kind only: real files are owner-supplied captures; the mockup shows honest labelled slots.
MEDIA = {"study-timer": ["web", "mobile", "mobile", "web"], "attendance": ["web"], "lecture-bot": []}

INDEX = {x["id"]: x for x in PROJECTS + ACTIVITIES + AWARDS + EVENTS + [SOCIETY]}
KIND_ORDER = ["project", "award", "activity", "event", "society"]
TIER = ["language", "frontend", "mobile", "backend", "ai-ml", "database", "data", "infra", "tooling", "other"]  # one fixed category order everywhere
DETAIL_PAGE = {"study-timer": "detail", "lecture-bot": "detail2", "attendance": "detail"}  # the canvas has two detail samples


def related(i):
    out = [b if a == i else a for a, b in EDGES if i in (a, b)]
    return sorted(out, key=lambda r: KIND_ORDER.index(INDEX[r]["kind"]))


def ym(v):
    y, m = v.split("-")[:2]
    return f"{y}.{m}"


def period(start, end=None, open_label=None):
    if end is None and open_label is None:
        return ym(start)
    return f"{ym(start)}{NBSP}–{NBSP}{ym(end) if end else open_label}"


def slug(name):
    out = name.lower().replace("+", "p").replace("#", "sharp").replace(".", "").replace("/", "-")
    return "-".join(out.split())


def hk(x):
    """Canvas template keys can't contain '-' (study-timer -> study_timer)."""
    return x.replace("-", "_")


def uses(name):
    return [p for p in PROJECTS if any(n == name for _, n in p["tech"])]


def grouped(p):
    g = {}
    for c, n in p["tech"]:
        g.setdefault(c, []).append(n)
    return [(c, g[c]) for c in TIER if c in g]


# ───────────────────────────── links ─────────────────────────────
BOARD = {"home": "Main", "detail": "Project", "detail2": "Project-b", "list": "Projects"}


def page_href(page, lc=None, hash_=None, query=None):
    lc = lc or loc()
    if page == CTX["page"] and lc == loc() and not query:
        return f"#{hash_}" if hash_ else ("#about" if page == "home" else "#main")
    if MODE == "proto":
        q = f"?{query}" if query else ""
        return f"../sys-{page}-{lc}/index.html{q}" + (f"#{hash_}" if hash_ else "")
    if page == "home":
        name = "Mobile" if CTX["mobile"] else "Main"
    else:
        name = BOARD[page] + ("-mobile" if CTX["mobile"] else "")
    return name + ("-en" if lc == "en" else "") + ".dc.html"


def item_href(i):
    it = INDEX[i]
    if it["kind"] == "project":
        return page_href(DETAIL_PAGE[i])
    return page_href("home", hash_="society" if it["kind"] == "society" else i)


def title_of(it):
    return t(it["title"])


# ───────────────────────────── small parts ─────────────────────────────
LINK = "text-primary underline decoration-1 underline-offset-4 transition-colors hover:text-primary-700 hover:decoration-2 active:text-primary-700"
GH_MARK = ('<svg aria-hidden="true" viewBox="0 0 16 16" class="size-4 shrink-0 fill-current"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>')
STRETCH = "after:absolute after:inset-0 after:rounded-panel focus-visible:outline-none"
ENTRY_FOCUS = "has-[[data-stretch]:focus-visible]:outline-2 has-[[data-stretch]:focus-visible]:outline-offset-2 has-[[data-stretch]:focus-visible]:outline-primary"


def ph(text, extra=""):
    """Bracketed placeholder for a value the fact sheet hasn't supplied (mockup only)."""
    return f'<span class="{cls("font-normal text-muted", extra)}">{text}</span>'


def ext(href, text, extra=""):
    return f'<a href="{href}" target="_blank" rel="noopener noreferrer" class="{extra}">{text}<span class="sr-only"> {s("new_tab")}</span></a>'


def live_badge():
    return (f'<span class="inline-flex items-center gap-1.5 font-semibold text-live"><span aria-hidden="true" class="size-2 shrink-0 rounded-full bg-live forced-colors:bg-[CanvasText]"></span>{s("live")}</span>')


def tag(text, extra=""):
    return f'<span class="{cls("inline-flex h-6 shrink-0 items-center rounded-tag border border-line px-1.5 text-sm font-medium text-ink-2", extra)}">{text}</span>'


def media_slot(kind, place=""):
    """Honest placeholder for a REAL capture: surface fill, hairline, a centred label naming kind + exact ratio.
    Production: <img width height alt> in the same box; on detail pages wrapped in
    <a href="{full-size file}" target="_blank" class="block cursor-zoom-in"> + <span class="sr-only">{s("full_size")}</span>."""
    name, ratio = s("slot")[kind]
    ratio_cls = {"web": "aspect-16/10", "mobile": "aspect-6/13", "photo": "aspect-4/3"}[kind]
    return (f'<div role="img" aria-label="{s("slot_aria")[kind]}" data-slot="{kind}" class="{cls("relative grid place-items-center overflow-hidden rounded-node bg-surface ring-1 ring-inset ring-line", ratio_cls, place)}">'
            f'<span class="px-1 text-center text-sm leading-snug text-muted">{name}<br>{ratio}</span></div>')


def copy_button(key, value):
    pre, post = s(f"copy_{key}_sr")
    data = json.dumps({"idle": s("copy"), "done": s("copied"), "fail": s("copy_failed"), "hint": s("copy_failed_hint"), "status": s(f"copied_{key}")}, ensure_ascii=False)
    attrs = A(f"data-copy=\"{value}\" data-copy-key=\"{key}\" data-copy-text='{data}'", f'data-done="{{{{copy.{key}.done}}}}" onClick="{{{{copy.{key}.go}}}}"')
    label = A("data-copy-label", "")
    text = s("copy") if MODE == "proto" else f"{{{{copy.{key}.label}}}}"
    pre_s = f'<span class="sr-only">{pre}</span>' if pre else ""
    post_s = f'<span class="sr-only">{post}</span>' if post else ""
    return (f'<button type="button"{attrs} class="relative z-10 inline-flex h-7 shrink-0 items-center rounded-tag border border-line bg-white px-2 text-sm font-medium text-ink-2 transition-colors after:absolute after:-inset-2 hover:border-edge hover:text-ink active:bg-primary-50 data-[done=true]:border-live data-[done=true]:text-live data-[done=fail]:border-award data-[done=fail]:text-award">'
            f'{pre_s}<span{label}>{text}</span>{post_s}</button>')


def status_region():
    if MODE == "proto":
        return '<p role="status" aria-live="polite" class="sr-only" data-copy-status></p>'
    return '<p role="status" aria-live="polite" class="sr-only">{{status}}</p>'


def section_head(i, count=None, action=""):
    c = f'<span class="text-lead font-semibold tabular-nums text-muted">{s("count").format(n=count)}</span>' if count is not None else ""
    return (f'<div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">'
            f'<h2 id="{i}-title" class="flex items-baseline gap-2.5 text-h2 font-bold text-ink">{s("nav")[i]}{c}</h2>{action}</div>')


def related_links(i, extra=""):
    rel = related(i)
    if not rel:
        return ""
    links = []
    for r in rel:
        it = INDEX[r]
        prize = f' <span class="text-award">{t(it["prize"])}</span>' if it["kind"] == "award" else ""
        links.append(f'<a href="{item_href(r)}" class="{cls("relative z-10 font-medium", LINK)}"><span class="sr-only">{s("kind")[it["kind"]]}: </span>{esc(title_of(it))}{prize}</a>')
    return (f'<p class="{cls("flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm leading-copy", extra)}">'
            f'<span class="text-muted">{s("related")}</span>{"".join(links)}</p>')


# ───────────────────────────── tech ─────────────────────────────
def tech_attrs(name):
    sl = slug(name)
    proto = f'data-tech="{sl}" data-label="{esc(name)}"'
    dc = f'data-tech="{sl}" aria-current="{{{{tech.{hk(sl)}.cur}}}}" onClick="{{{{tech.{hk(sl)}.click}}}}"'
    return A(proto, dc)


def tech_node(name):
    """Interactive node (stack map, list filter): a real link that filters the project list; the count is data, not a rating."""
    used = uses(name)
    if not used:
        return (f'<li><span translate="no" class="inline-flex min-h-10 items-center rounded-node border border-dashed border-edge px-3 py-1 text-ui text-muted">'
                f'{esc(name)}<span class="sr-only">, {s("sr_none")}</span></span></li>')
    names = ", ".join(t(p["title"]) for p in used)
    if MODE == "dc":
        href = "#projects" if CTX["page"] == "home" else "#main"
    else:  # without JS the link opens the list filtered by this tech (real site: /[locale]/projects/tech/<slug>/)
        href = page_href("list", query=f"tech={slug(name)}") if CTX["page"] == "home" else f"?tech={slug(name)}"
    return (f'<li><a href="{href}"{tech_attrs(name)} translate="no" class="group inline-flex min-h-10 items-center gap-2 rounded-node border border-edge bg-white py-1 pl-3 pr-1.5 text-ui font-semibold text-ink transition-colors hover:border-primary hover:text-primary active:bg-primary-50 aria-[current=true]:border-primary aria-[current=true]:bg-primary aria-[current=true]:text-white">'
            f'{esc(name)}<span class="sr-only">, {s("sr_count").format(n=len(used), names=names)}</span>'
            f'<span aria-hidden="true" class="grid h-7 min-w-7 place-items-center rounded-tag bg-primary-50 px-1.5 text-sm font-semibold tabular-nums text-primary-700 group-aria-[current=true]:bg-white group-aria-[current=true]:text-primary">{len(used)}</span></a></li>')


def chip(name):
    """Static tech label (project entries). Highlighted when it matches the active filter."""
    sl = slug(name)
    match = A('data-match="false"', f'data-match="{{{{match.{hk(sl)}}}}}"')
    return (f'<li data-node="{sl}"{match} translate="no" class="inline-flex min-h-7 items-center rounded-tag border border-line bg-white px-2 py-0.5 text-sm font-medium text-ink-2 '
            f'data-[match=true]:border-primary data-[match=true]:bg-primary-100 data-[match=true]:text-primary-700">{esc(name)}</li>')


def link_node(name):
    """Detail page: the same node as the stack map (link + project count), going to the home list filtered by this tech."""
    n = len(uses(name))
    href = page_href("home", hash_="projects", query=f"tech={slug(name)}")
    return (f'<li><a href="{href}" translate="no" class="group inline-flex min-h-10 items-center gap-2 rounded-node border border-edge bg-white py-1 pl-3 pr-1.5 text-ui font-semibold text-ink transition-colors hover:border-primary hover:text-primary active:bg-primary-50">'
            f'{esc(name)}<span class="sr-only">, {s("tech_link_sr")}</span>'
            f'<span aria-hidden="true" class="grid h-7 min-w-7 place-items-center rounded-tag bg-primary-50 px-1.5 text-sm font-semibold tabular-nums text-primary-700">{n}</span></a></li>')


def tech_list(p, extra="", link=False):
    """Category-grouped tech in the one fixed TIER order (same order as the stack map). link=True: detail-page nodes."""
    item = link_node if link else chip
    groups = "".join(f'<div class="flex min-w-0 items-center gap-2"><dt class="shrink-0 text-sm text-muted">{s("cat")[c]}</dt>'
                     f'<dd><ul class="flex flex-wrap gap-1.5">{"".join(item(n) for n in names)}</ul></dd></div>' for c, names in grouped(p))
    return f'<dl aria-label="{s("stack_label")}" class="{cls("flex flex-wrap gap-x-5 gap-y-2", extra)}">{groups}</dl>'


def stack_rows(items_by_cat, unrecorded=True, narrow=False):
    rows = []
    for c, names in items_by_cat:
        names = [n for n in names if unrecorded or uses(n)]
        if not names:
            continue
        names = sorted(names, key=lambda n: (-len(uses(n)), n.lower()))  # most-used first, then name
        rows.append(f'<li class="{cls("grid gap-x-4 gap-y-2 border-t border-line py-3 first:border-t-0 sm:grid-cols-[6rem_minmax(0,1fr)]", "lg:grid-cols-1" if narrow else "")}">'
                    f'<h3 class="{cls("text-sm font-semibold text-ink-2 sm:pt-2.5 sm:text-ui", "lg:pt-0" if narrow else "")}">{s("cat")[c]}</h3>'
                    f'<ul class="flex flex-wrap gap-2">{"".join(tech_node(n) for n in names)}</ul></li>')
    return "".join(rows)


def stack_map():
    has_none = any(not uses(n) for _, ns in SKILLS for n in ns)
    legend = (f'<p class="mt-2 flex items-center gap-2 text-ui text-muted"><span aria-hidden="true" class="inline-block h-4 w-6 shrink-0 rounded-tag border border-dashed border-edge"></span>{s("stack_none")}</p>'
              if has_none else "")
    order = sorted(SKILLS, key=lambda g: TIER.index(g[0]))
    return (f'<section id="skills" aria-labelledby="skills-title" class="min-w-0">'
            f'<h2 id="skills-title" class="text-h2 font-bold text-ink">{s("nav")["skills"]}</h2>'
            f'<p class="mt-2 max-w-152 text-ui text-muted">{s("stack_help")}</p>'
            f'<div class="mt-4 rounded-panel bg-surface px-3 py-1 sm:px-5"><ul>{stack_rows(order, narrow=True)}</ul></div>{legend}</section>')


# ───────────────────────────── GitHub ─────────────────────────────
def repo_url(p):
    """Production: the project's links[type=github].url. The mockup links the profile because the repo name is unknown."""
    return f"https://github.com/{GITHUB}/{p['repo']}" if p.get("repo") else f"https://github.com/{GITHUB}"


def repo_line(p):
    """One line of repository data per project entry (values from the committed GitHub snapshot). Only the link sits
    above the card's stretched link, so a click on the stars/commit text still opens the project."""
    return (f'<p class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">'
            + ext(repo_url(p), f'{GH_MARK}<span><span translate="no">{GITHUB}/</span>{s("repo_ph")}</span>', cls("relative z-10 inline-flex min-h-6 items-center gap-1.5 font-medium wrap-anywhere", LINK))
            + f'<span class="tabular-nums"><span aria-hidden="true">★</span><span class="sr-only">{s("star_sr")}</span> {s("stars_ph")}</span>'
            f'<span class="tabular-nums">{s("commit")} {s("commit_ph")}</span></p>')


def repo_card(p):
    P = s("ph")
    return (f'<section aria-labelledby="repo-title" class="rounded-panel bg-surface p-5">'
            f'<h2 id="repo-title" class="flex items-center gap-2 text-ui font-semibold text-ink-2">{GH_MARK}{s("repo_title")}</h2>'
            f'<p class="mt-2 text-lead font-semibold">' + ext(repo_url(p), f'<span translate="no">{GITHUB}/</span>{s("repo_ph")}', cls("wrap-anywhere", LINK)) + '</p>'
            '<dl class="mt-4 grid grid-cols-3 gap-x-4 gap-y-3">'
            f'<div><dt class="text-sm text-muted">{s("stars")}</dt><dd class="mt-0.5 text-ui font-semibold tabular-nums">{ph(s("stars_ph"))}</dd></div>'
            f'<div><dt class="text-sm text-muted">{s("commit")}</dt><dd class="mt-0.5 text-ui font-semibold tabular-nums">{ph(s("commit_ph"))}</dd></div>'
            f'<div><dt class="text-sm text-muted">{s("license")}</dt><dd class="mt-0.5 text-ui font-semibold">{ph(P["license"])}</dd></div></dl>'
            f'<p class="mt-4 border-t border-line pt-3 text-ui text-muted">{s("repo_note").format(d=P["snapshot"])}</p></section>')


# ───────────────────────────── layout ─────────────────────────────
def nav_attrs(i):
    if CTX["page"] != "home":
        return ' data-current="true" aria-current="true"' if i == "projects" else ""
    proto = f'data-nav="{i}"' + (' data-current="true" aria-current="location"' if i == "about" else "")
    dc = f'data-nav="{i}" data-current="{{{{nav.{i}.cur}}}}" aria-current="{{{{nav.{i}.aria}}}}" onClick="{{{{nav.{i}.click}}}}"'
    return A(proto, dc)


def nav_link(i, desktop):
    href = page_href("home", hash_=i) if CTX["page"] != "home" else f"#{i}"
    label = s("nav")[i]
    if desktop:
        c = ("relative flex h-16 items-center px-2.5 text-ui font-medium text-muted transition-colors hover:text-ink focus-visible:z-10 focus-visible:-outline-offset-2 "
             "data-[current=true]:text-ink after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 data-[current=true]:after:opacity-100 "
             "forced-colors:after:bg-[CanvasText] xl:px-3 xl:after:inset-x-3")
    else:
        c = ("relative flex h-9 items-center justify-center text-sm font-medium text-muted transition-colors hover:text-ink active:bg-primary-50 focus-visible:z-10 focus-visible:-outline-offset-2 "
             "data-[current=true]:font-semibold data-[current=true]:text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:bg-primary after:opacity-0 "
             "data-[current=true]:after:opacity-100 forced-colors:after:bg-[CanvasText] md:h-11 md:text-ui")
    return f'<li><a href="{href}"{nav_attrs(i)} class="{c}">{label}</a></li>'


def lang_toggle():
    out = []
    for lc, lab in (("ko", "KO"), ("en", "EN")):
        cur = lc == loc()
        attr = ' aria-current="true"' if cur else f' hreflang="{lc}"'
        st = "bg-ink text-white" if cur else "text-muted hover:text-ink active:bg-primary-50"
        out.append(f'<a href="{page_href(CTX["page"], lc)}" lang="{lc}"{attr} class="relative flex h-8 min-w-10 items-center justify-center px-2.5 text-sm font-semibold transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 focus-visible:z-10 focus-visible:-outline-offset-2 forced-colors:aria-[current=true]:underline {st}">'
                   f'{lab}<span class="sr-only"> {s("lang_names")[lc]}</span></a>')
    return f'<div role="group" aria-label="{s("lang_label")}" class="ml-auto flex shrink-0 overflow-hidden rounded-node border border-line lg:ml-2">{"".join(out)}</div>'


def header():
    logo_href = "#about" if CTX["page"] == "home" else page_href("home")
    desk = "".join(nav_link(i, True) for i in NAV_IDS)
    mob = "".join(nav_link(i, False) for i in NAV_IDS)
    return ('<header class="sticky top-0 z-50 border-b border-line bg-white tiny:static">'
            f'<div class="shell flex h-11 items-center gap-4 lg:h-16">'
            f'<a href="{logo_href}" translate="no" class="text-lg font-bold tracking-tight text-ink transition-colors hover:text-primary">{t(NAME)}</a>'
            f'<nav aria-label="{s("nav_label")}" class="ml-auto hidden lg:block"><ul class="flex">{desk}</ul></nav>{lang_toggle()}</div>'
            f'<nav aria-label="{s("nav_label")}" class="border-t border-line lg:hidden"><ul class="shell grid grid-cols-4 md:grid-cols-8">{mob}</ul></nav>'
            '</header>')


def footer():
    top = "#about" if CTX["page"] == "home" else "#main"
    return ('<footer class="border-t border-line"><div class="shell flex flex-wrap items-center justify-between gap-4 py-6 text-sm text-muted">'
            f'<p>{s("footer")}</p><a href="{top}" class="{cls("inline-flex min-h-6 items-center font-medium", LINK)}">{s("back_to_top")}</a></div></footer>')


# ───────────────────────────── home ─────────────────────────────
def fact_row(label, value_html, last=False):
    return (f'<div class="{cls("grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-x-3 border-t border-line py-2.5 sm:grid-cols-[5.5rem_minmax(0,1fr)]", "border-b" if last else "")}">'
            f'<dt class="text-ui text-muted">{label}</dt><dd class="min-w-0 text-ui text-ink">{value_html}</dd></div>')


def identity():
    f = s("facts")
    alt_lc = "en" if loc() == "ko" else "ko"
    facts = (fact_row(f["affiliation"], s("affiliation"))
             + fact_row(f["society"], f'<a href="#society" class="{LINK}">{s("society_role")}</a>')
             + fact_row(f["email"], f'<span class="flex flex-wrap items-center gap-x-3 gap-y-1"><a href="mailto:{EMAIL}" translate="no" data-copy-value="email" class="{cls(LINK, "wrap-anywhere")}">{EMAIL}</a>{copy_button("email", EMAIL)}</span>')
             + fact_row(f["github"], ext(f"https://github.com/{GITHUB}", f'{GH_MARK}<span translate="no">github.com/{GITHUB}</span>', cls("inline-flex items-center gap-1.5", LINK)), last=True))
    return (f'<section id="about" aria-labelledby="about-title" class="min-w-0">'
            '<div class="grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-5 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6 lg:grid-cols-[8rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)]">'
            f'<div role="img" aria-label="{s("photo_aria")}" class="grid aspect-3/4 place-items-center self-start rounded-node bg-surface ring-1 ring-inset ring-line sm:row-span-2">'
            f'<span class="px-1 text-center text-sm leading-snug text-muted">{"<br>".join(s("photo").rsplit(" ", 1))}</span></div>'
            '<div class="min-w-0 self-center sm:self-start">'
            f'<h1 id="about-title" class="flex flex-wrap items-baseline gap-x-3 gap-y-1"><span translate="no" class="text-name-sm font-bold text-ink sm:text-name">{t(NAME)}</span>'
            f'<span lang="{alt_lc}" translate="no" class="text-lead font-medium text-muted">{NAME[alt_lc]}</span></h1>'
            f'<p class="mt-2 text-pretty text-ui font-medium text-ink-2 sm:text-lead">{t(ROLES)}</p>'
            f'<p class="mt-4 hidden max-w-136 text-base leading-prose text-ink-2 sm:block">{t(INTRO)}</p></div>'
            f'<p class="col-span-2 text-base leading-prose text-ink-2 sm:hidden">{t(INTRO)}</p>'
            f'<dl class="col-span-2 min-w-0 sm:col-span-1 sm:col-start-2">{facts}</dl></div></section>')


def meta(p, extra=""):
    return (f'<p class="{cls("flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted", extra)}">'
            f'<span>{s("phrase")[p["phrase"]]}</span><span class="tabular-nums">{period(p["start"], p["end"])}</span>{live_badge() if p["live"] else ""}</p>')


def entry_attrs(p):
    techs = " ".join(slug(n) for _, n in p["tech"])
    return A(f'data-project="{p["id"]}" data-techs="{techs}" data-show="true"', f'data-project="{p["id"]}" data-show="{{{{proj.{hk(p["id"])}}}}}"')


def project_entry(p, featured=False, heading="h3"):
    title = (f'<{heading} class="text-h3 font-bold text-ink"><a href="{item_href(p["id"])}" data-stretch class="{STRETCH} group-hover/p:text-primary">{t(p["title"])}</a></{heading}>'
             f'<p class="mt-1 text-base leading-copy text-ink-2">{t(p["tagline"])}</p>')
    art = cls("group/p relative -mx-3 grid gap-x-10 rounded-panel px-3 py-5 transition-colors hover:bg-surface md:grid-cols-12", ENTRY_FOCUS)
    li = f'<li{entry_attrs(p)} class="data-[show=false]:hidden">'
    if featured:
        ks = MEDIA.get(p["id"], [])
        hl = (f'<ul aria-label="{s("highlights_sr")}" class="grid gap-1 text-ui text-ink-2">'
              + "".join(f'<li class="flex gap-2.5"><span aria-hidden="true" class="mt-2.5 size-1.5 shrink-0 rounded-full bg-edge"></span>{ph(s("ph")["highlight"].format(n=n))}</li>' for n in (1, 2))
              + "</ul>")
        media = ""
        if ks:
            web = media_slot("web") if "web" in ks else ""
            phone = media_slot("mobile", "" if web else "w-36 sm:w-40") if "mobile" in ks else ""  # a lone phone never stretches to the column
            colsx = "grid-cols-[minmax(0,208fr)_minmax(0,60fr)]" if web and phone else "grid-cols-1"
            media = f'<div class="min-w-0 md:col-span-5 md:col-start-8 md:row-start-1"><div class="grid {colsx} gap-3">{web}{phone}</div></div>'
        side = "md:row-start-2" if media else "md:row-start-1 md:pt-1"
        return (f'{li}<article class="{cls(art, "gap-y-4 md:grid-rows-[auto_1fr]")}">'
                f'<div class="flex min-w-0 flex-col gap-3 md:col-span-7 md:row-span-2 md:row-start-1"><div>{title}</div>{meta(p)}{hl}{related_links(p["id"])}</div>{media}'
                f'<div class="{cls("flex min-w-0 flex-col gap-2.5 md:col-span-5 md:col-start-8", side)}">{tech_list(p)}{repo_line(p)}</div>'
                '</article></li>')
    return (f'{li}<article class="{cls(art, "gap-y-3")}">'
            f'<div class="flex min-w-0 flex-col gap-2 md:col-span-7"><div>{title}</div>{meta(p)}{related_links(p["id"])}</div>'
            f'<div class="flex min-w-0 flex-col gap-2.5 md:col-span-5 md:pt-1">{tech_list(p)}{repo_line(p)}</div>'
            '</article></li>')


def filter_bar():
    attrs = A('data-filter-bar data-show="false"', 'data-show="{{filter.show}}"')
    text = A('data-filter-text tabindex="-1"', "")
    txt = "" if MODE == "proto" else "{{filter.text}}"
    clear = A("data-filter-clear", 'onClick="{{filter.clear}}"')
    return (f'<div{attrs} class="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-node bg-primary-50 px-4 py-2.5 data-[show=false]:hidden">'
            f'<p{text} class="text-ui font-medium text-primary-700">{txt}</p>'
            f'<button type="button"{clear} class="relative text-ui font-semibold text-primary underline underline-offset-4 after:absolute after:-inset-2 hover:text-primary-700">{s("filter_clear")}</button></div>')


HOME_LIMIT = 5  # featured first; the rest live on the list page


def projects_section():
    shown = PROJECTS[:HOME_LIMIT]
    entries = "".join(project_entry(p, featured=p["featured"]) for p in shown)
    label = s("view_all").format(n=len(PROJECTS)) if len(PROJECTS) > HOME_LIMIT else s("list_link")
    action = f'<a href="{page_href("list")}" class="{cls("inline-flex min-h-6 items-center text-ui font-semibold", LINK)}">{label}</a>'
    return (f'<section id="projects" aria-labelledby="projects-title" class="min-w-0">{section_head("projects", len(PROJECTS), action)}'
            f'{filter_bar()}<ol data-project-list class="mt-2 divide-y divide-line">{entries}</ol>'
            f'<p class="mt-4 border-t border-line pt-4 text-ui text-muted">{s("provenance")}</p></section>')


def plain_row(it, sub, date_html):
    prize = f' <span class="font-semibold text-award">{t(it["prize"])}</span>' if it["kind"] == "award" else ""
    return (f'<li id="{it["id"]}" class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 py-4">'
            f'<div class="min-w-0"><h3 class="text-base font-semibold text-ink">{t(it["title"])}{prize}</h3>'
            f'<p class="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">{sub}</p>{related_links(it["id"], "mt-1.5")}</div>'
            f'<p class="whitespace-nowrap text-sm tabular-nums text-muted">{date_html}</p></li>')


def activities_section():
    rows = "".join(plain_row(a, f'<span>{t(a["org"])}</span><span>{t(a["role"])}</span>', period(a["start"], a.get("end"))) for a in ACTIVITIES)
    return (f'<section id="activities" aria-labelledby="activities-title" class="min-w-0">{section_head("activities", len(ACTIVITIES))}'
            f'<ul class="mt-3 divide-y divide-line border-t border-line">{rows}</ul></section>')


def awards_section():
    rows = "".join(plain_row(a, f'<span>{t(a["org"])}</span>', ym(a["start"])) for a in AWARDS)
    return (f'<section id="awards" aria-labelledby="awards-title" class="min-w-0">{section_head("awards", len(AWARDS))}'
            f'<ul class="mt-3 divide-y divide-line border-t border-line">{rows}</ul></section>')


def society_section():
    roles = "".join(f'<li class="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5"><span class="text-base font-semibold text-ink">{t(r)}</span>'
                    f'<span class="text-sm tabular-nums text-muted">{period(a, b, s("present"))}</span></li>' for r, a, b in SOCIETY["roles"])
    evs = "".join(f'<li id="{e["id"]}" class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3">'
                  f'<p class="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">{tag(s("event_type")[e["type"]], "self-center")}'
                  f'<span class="font-semibold text-ink">{t(e["title"])}</span><span class="text-sm text-muted">{t(e["role"])}</span></p>'
                  f'<span class="text-sm tabular-nums text-muted">{ym(e["start"])}</span></li>' for e in EVENTS)
    return (f'<section id="society" aria-labelledby="society-title" class="min-w-0">{section_head("society")}'
            '<div id="the-lab" class="mt-4 grid gap-8 lg:grid-cols-12 lg:gap-12">'
            f'<div class="lg:col-span-5"><h3 translate="no" class="text-h3 font-bold text-ink">THE LAB</h3><p class="mt-1 text-ui text-ink-2">{s("lab_desc")}</p>'
            f'<h4 class="mt-5 text-sm font-semibold text-muted">{s("lab_roles")}</h4><ul class="mt-1 divide-y divide-line border-t border-line">{roles}</ul></div>'
            f'<div class="min-w-0 lg:col-span-7"><h4 class="text-sm font-semibold text-muted">{s("lab_events")}</h4><ul class="mt-1 divide-y divide-line border-t border-line">{evs}</ul></div>'
            '</div></section>')


def education_section():
    return (f'<section id="education" aria-labelledby="education-title" class="min-w-0">{section_head("education")}'
            f'<div class="mt-3 border-t border-line py-4"><h3 class="text-base font-semibold text-ink">{t(EDU["school"])}</h3>'
            f'<p class="mt-1 text-sm text-muted">{t(EDU["major"])}</p>'
            f'<p class="mt-0.5 text-sm tabular-nums text-muted">{period(EDU["start"], None, s("enrolled"))}</p></div></section>')


def contact_section():
    c = s("contact")

    def row(label, value_html, button=""):
        return (f'<div class="flex flex-wrap items-center gap-x-4 gap-y-1 py-3"><dt class="w-24 shrink-0 text-sm text-muted">{label}</dt>'
                f'<dd class="flex min-w-0 flex-1 items-center justify-between gap-3">{value_html}{button}</dd></div>')
    rows = (row(c["email"], f'<a href="mailto:{EMAIL}" translate="no" data-copy-value="email" class="{cls("min-w-0 text-ui font-medium wrap-anywhere", LINK)}">{EMAIL}</a>', copy_button("email", EMAIL))
            + row(c["github"], ext(f"https://github.com/{GITHUB}", f'<span translate="no">github.com/{GITHUB}</span>', cls("text-ui font-medium", LINK)))
            + row(c["instagram"], ext(f"https://instagram.com/{INSTA}", f'<span translate="no">@{INSTA}</span>', cls("text-ui font-medium", LINK)))
            + row(c["discord"], f'<span translate="no" data-copy-value="discord" class="text-ui font-medium text-ink">{DISCORD}</span>', copy_button("discord", DISCORD)))
    return (f'<section id="connect" aria-labelledby="connect-title" class="min-w-0">{section_head("connect")}'
            f'<dl class="mt-3 divide-y divide-line border-t border-line">{rows}</dl></section>')


def band(inner, extra=""):
    return f'<div class="border-t border-line"><div class="{cls("shell py-8 lg:py-10", extra)}">{inner}</div></div>'


def home_body():
    return ('<main id="main">'
            f'<div class="shell grid gap-x-12 gap-y-10 pb-10 pt-8 lg:grid-cols-12 lg:pb-12 lg:pt-12"><div class="min-w-0 lg:col-span-7">{identity()}</div>'
            f'<div class="min-w-0 lg:col-span-5">{stack_map()}</div></div>'
            + band(projects_section())
            + band(activities_section() + awards_section(), "grid gap-10 lg:grid-cols-2 lg:gap-12")
            + band(society_section())
            + band(f'<div class="lg:col-span-5">{education_section()}</div><div class="lg:col-span-7">{contact_section()}</div>', "grid gap-10 lg:grid-cols-12 lg:gap-12")
            + '</main>')


# ───────────────────────────── detail: one template, blocks from data ─────────────────────────────
def has_gallery(p):
    ks = MEDIA.get(p["id"], [])
    return len(ks) > (1 if "web" in ks else 0)  # the hero shows one web capture (+ one phone from sm)


GALLERY_ROW = {  # literal classes per row shape: fr = aspect ratio at one shared height (web 208 : phone 60 : photo 173)
    ("web", "mobile", "mobile"): "sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)_minmax(0,60fr)]",
    ("web", "mobile"): "sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)]",
    ("web", "web"): "sm:grid-cols-2",
    ("web", "photo"): "sm:grid-cols-[minmax(0,208fr)_minmax(0,173fr)]",
    ("photo", "photo"): "sm:grid-cols-2",
    ("photo", "web"): "sm:grid-cols-[minmax(0,173fr)_minmax(0,208fr)]",
    ("photo", "mobile", "mobile"): "sm:grid-cols-[minmax(0,173fr)_minmax(0,60fr)_minmax(0,60fr)]",
    ("photo", "mobile"): "sm:grid-cols-[minmax(0,173fr)_minmax(0,60fr)]",
    ("web",): "sm:grid-cols-2", ("photo",): "sm:grid-cols-2",  # a lone wide capture takes half the row, never the full width
    ("mobile",) * 4: "sm:grid-cols-4", ("mobile",) * 3: "sm:grid-cols-4", ("mobile",) * 2: "sm:grid-cols-4", ("mobile",): "sm:grid-cols-4",
}


def gallery_rows(items):
    wides = [k for k in items if k != "mobile"]
    phones = items.count("mobile")
    rows = []
    while wides:
        w = wides.pop(0)
        if phones >= 2:
            rows.append((w, "mobile", "mobile"))
            phones -= 2
        elif phones == 1:
            rows.append((w, "mobile"))
            phones -= 1
        elif wides:
            rows.append((w, wides.pop(0)))
        else:
            rows.append((w,))
    while phones:
        n = min(4, phones)
        rows.append(("mobile",) * n)
        phones -= n
    return rows


def gallery(p, fold_after=4):
    def fig(k):
        span = "col-span-2 sm:col-span-1" if k != "mobile" else ""
        return (f'<figure class="{cls("min-w-0", span)}">{media_slot(k)}'
                f'<figcaption class="mt-2 text-sm text-muted"><span class="font-medium text-ink-2">{s("media_kind")[k]}</span> {s("ph")["caption"]}</figcaption></figure>')
    rows = [(len(r), f'<div class="grid grid-cols-2 items-start gap-3 {GALLERY_ROW[r]}">{"".join(fig(k) for k in r)}</div>') for r in gallery_rows(MEDIA.get(p["id"], []))]
    shown, rest, count = [], [], 0
    total = sum(n for n, _ in rows)
    for n, row in rows:
        if not rest and (total <= fold_after or count + n <= fold_after):
            shown.append(row)
            count += n
        else:
            rest.append(row)
    more = ""
    if rest:
        more = (f'<details class="group/more"><summary class="inline-flex h-11 cursor-pointer list-none items-center gap-2 rounded-node border border-line px-4 text-ui font-semibold text-ink transition-colors hover:border-edge active:bg-primary-50 [&::-webkit-details-marker]:hidden">'
                f'{s("more_screens").format(n=total - count)}</summary><div class="mt-6 grid gap-6">{"".join(rest)}</div></details>')
    return f'<div class="grid gap-6">{"".join(shown)}{more}</div>'


def bullets(items):
    return ('<ul class="grid max-w-160 gap-2">' + "".join(
        f'<li class="flex gap-3 text-base leading-prose text-ink-2"><span aria-hidden="true" class="mt-3 size-1.5 shrink-0 rounded-full bg-edge"></span><span class="min-w-0">{x}</span></li>' for x in items) + "</ul>")


def shared_projects(p):
    return sorted({q["id"] for _, n in p["tech"] for q in uses(n) if q["id"] != p["id"]})


def stack_block(p):
    """The declared stack is in the header (nodes). This block adds what the header can't: projects sharing a tech, and the
    measured GitHub language ratio. It renders only when one of them exists."""
    shared = shared_projects(p)
    shared_html = (f'<p class="flex flex-wrap items-baseline gap-x-3 text-ui"><span class="text-muted">{s("shared")}</span>'
                   + "".join(f'<a href="{item_href(q)}" class="{cls("font-medium", LINK)}">{t(INDEX[q]["title"])}</a>' for q in shared) + "</p>") if shared else ""
    P = s("ph")
    langs = (f'<div class="{cls("max-w-160", "mt-6" if shared else "")}"><p class="text-ui font-semibold text-ink-2">{s("langs_title")} <span class="font-normal text-muted">{s("langs_note").format(d=P["snapshot"])}</span></p>'
             '<div aria-hidden="true" class="mt-2 h-2.5 rounded-full border border-dashed border-edge"></div>'
             f'<p class="mt-1.5 text-sm text-muted">{P["langs"]}</p></div>') if p.get("github") else ""
    return f'{shared_html}{langs}'


def block_content(bid, p):
    P = s("ph")
    if bid == "summary":
        return f'<p class="max-w-160 text-lead leading-prose text-ink-2">{ph(P["summary"])}</p>'
    if bid == "contrib":
        return bullets([ph(P["contrib"].format(n=n)) for n in (1, 2, 3)])
    if bid == "screens":
        return gallery(p)
    if bid == "features":
        return ('<dl class="max-w-160 divide-y divide-line border-t border-line">' + "".join(
            f'<div class="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"><dt class="text-base font-semibold">{ph(P["feature"].format(n=n))}</dt><dd class="text-ui">{ph(P["feature_desc"])}</dd></div>'
            for n in (1, 2, 3)) + "</dl>")
    if bid == "stack":
        return stack_block(p)
    if bid == "arch":
        return f'<p class="max-w-160 text-base leading-prose text-ink-2">{ph(P["arch"])}</p>'
    if bid == "challenges":
        return ('<ol class="max-w-184 divide-y divide-line border-t border-line">' + "".join(
            f'<li class="grid gap-x-8 gap-y-3 py-4 md:grid-cols-2"><div><p class="text-sm font-semibold text-ink-2">{s("problem")}</p><p class="mt-1 text-base leading-prose">{ph(P["problem"])}</p></div>'
            f'<div><p class="text-sm font-semibold text-ink-2">{s("solution")}</p><p class="mt-1 text-base leading-prose">{ph(P["solution"])}</p></div></li>' for _ in (1,)) + "</ol>")
    if bid == "outcomes":
        aw = award_in_outcomes(p)
        award = INDEX[aw] if aw else None
        line = ""
        if award:
            line = (f'<p class="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-ui"><span class="text-muted">{s("related_award")}</span>'
                    f'<a href="{item_href(award["id"])}" class="{cls("font-semibold", LINK)}">{t(award["title"])} <span class="text-award">{t(award["prize"])}</span></a>'
                    f'<span class="text-sm tabular-nums text-muted">{t(award["org"])}{NBSP}{NBSP}{ym(award["start"])}</span></p>')
        return bullets([ph(P["outcome"])]) + line
    if bid == "learnings":
        return bullets([ph(P["learning"])])
    if bid == "related":
        rows = "".join(f'<li class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 py-3"><p class="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-1">'
                       f'{tag(s("kind")[INDEX[r]["kind"]], "self-center")}<a href="{item_href(r)}" class="{cls("font-semibold", LINK)}">{t(INDEX[r]["title"])}'
                       + (f' <span class="text-award">{t(INDEX[r]["prize"])}</span>' if INDEX[r]["kind"] == "award" else "")
                       + f'</a><span class="text-sm text-muted">{t(INDEX[r]["org"])}</span></p><span class="text-sm tabular-nums text-muted">{ym(INDEX[r]["start"])}</span></li>'
                       for r in related_rest(p))
        return f'<ul class="max-w-184 divide-y divide-line border-t border-line">{rows}</ul>'
    raise KeyError(bid)


def award_in_outcomes(p):
    return next((r for r in related(p["id"]) if INDEX[r]["kind"] == "award"), None) if "outcomes" in p["has"] else None


def related_rest(p):
    """Related items minus the award the outcomes block already shows."""
    aw = award_in_outcomes(p)
    return [r for r in related(p["id"]) if r != aw]


# Block registry: a block renders only when its data exists, so each project's page shows its own character.
# The TOC is built from the blocks that render. A future optional `layout` preset may only reorder blocks
# (and choose the hero's right column); only "default" exists now.


BLOCK_HAS = {
    "summary": lambda p: True, "contrib": lambda p: True, "screens": has_gallery, "features": lambda p: True,
    "stack": lambda p: bool(shared_projects(p)) or bool(p.get("github")),
    "arch": lambda p: "arch" in p["has"], "challenges": lambda p: "challenges" in p["has"], "outcomes": lambda p: "outcomes" in p["has"],
    "learnings": lambda p: "learnings" in p["has"], "related": lambda p: bool(related_rest(p)),
}
PRESETS = {"default": ["summary", "contrib", "screens", "features", "stack", "arch", "challenges", "outcomes", "learnings", "related"]}


def detail_blocks(p):
    return [b for b in PRESETS[p.get("layout", "default")] if BLOCK_HAS[b](p)]


def toc_attrs(i, first):
    proto = f'data-toc="{i}"' + (' data-current="true" aria-current="location"' if first else "")
    dc = f'data-toc="{i}" data-current="{{{{toc.{i}.cur}}}}" aria-current="{{{{toc.{i}.aria}}}}" onClick="{{{{toc.{i}.click}}}}"'
    return A(proto, dc)


def detail_body(p):
    P, D = s("ph"), s("d_facts")
    ks = MEDIA.get(p["id"], [])
    deploy = (f'{live_badge()}<span class="mt-0.5 block text-sm font-normal text-muted">{P["deploy_detail"]}</span>' if p["live"] else ph(P["deploy_status"]))
    facts = [(D["period"], f'<span class="tabular-nums">{period(p["start"], p["end"])}</span>'), (D["kind"], s("phrase")[p["phrase"]]),
             (D["team"], ph(P["team"])), (D["role"], ph(P["role"])), (D["status"], ph(P["status"])), (D["deploy"], deploy)]
    facts_html = "".join(f'<div class="min-w-0 border-t border-line py-3 pr-4"><dt class="text-sm text-muted">{k}</dt><dd class="mt-1 text-ui font-semibold text-ink">{v}</dd></div>' for k, v in facts)
    # placeholders until the fact sheet supplies the URL: same box, dashed edge, not interactive
    demo = (f'<div class="mt-6 flex flex-wrap gap-3"><span class="inline-flex h-11 items-center gap-2 rounded-node border border-dashed border-edge px-4 text-ui font-semibold text-ink">{s("demo")} {ph(P["link"])}</span></div>'
            if p["live"] else "")
    lead = ""
    if ks:
        web = media_slot("web") if "web" in ks else ""
        phone = media_slot("mobile", "hidden sm:grid") if "mobile" in ks and web else (media_slot("mobile", "w-40 sm:w-48") if "mobile" in ks else "")
        colsx = "grid-cols-1 sm:grid-cols-[minmax(0,208fr)_minmax(0,60fr)]" if web and phone else "grid-cols-1"
        more = (f'<p class="mt-3"><a href="#screens" class="{cls("inline-flex min-h-6 items-center text-ui font-semibold", LINK)}">{s("all_screens").format(n=len(ks))}</a></p>' if has_gallery(p)
                else f'<p class="mt-2 text-sm text-muted"><span class="font-medium text-ink-2">{s("media_kind")["web"]}</span> {P["caption"]}</p>')
        lead = f'<div class="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"><div class="grid {colsx} gap-3">{web}{phone}</div>{more}</div>'
    repo = (f'<div class="{cls("min-w-0 lg:col-span-5 lg:col-start-8", "lg:row-start-3" if ks else "lg:row-span-3 lg:row-start-1")}">{repo_card(p)}</div>' if p.get("github") else "")
    crumbs = s("crumbs")
    hero_ = (
        '<div class="shell pb-10 pt-6 lg:pb-12 lg:pt-10">'
        f'<nav aria-label="{s("crumbs_label")}"><ol class="flex flex-wrap items-center gap-x-2 text-sm text-muted">'
        f'<li><a href="{page_href("home")}" class="relative inline-flex min-h-6 items-center underline decoration-edge underline-offset-4 transition-colors after:absolute after:-inset-x-1.5 after:-inset-y-2.5 hover:text-primary hover:decoration-primary active:text-primary-700">{crumbs[0]}</a></li><li aria-hidden="true">/</li>'
        f'<li><a href="{page_href("list")}" class="relative inline-flex min-h-6 items-center underline decoration-edge underline-offset-4 transition-colors after:absolute after:-inset-x-1.5 after:-inset-y-2.5 hover:text-primary hover:decoration-primary active:text-primary-700">{crumbs[1]}</a></li><li aria-hidden="true">/</li>'
        f'<li><span aria-current="page" class="text-ink-2">{t(p["title"])}</span></li></ol></nav>'
        '<div class="mt-5 grid gap-x-12 gap-y-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr]">'
        f'<div class="min-w-0 lg:col-span-7"><h1 class="text-title-sm font-bold text-ink sm:text-title">{t(p["title"])}</h1>'
        f'<p class="mt-3 max-w-160 text-lead leading-copy text-ink-2">{t(p["tagline"])}</p></div>'
        f'<div class="min-w-0 lg:col-span-7 lg:row-span-2 lg:row-start-2">{tech_list(p, link=True)}{demo}<dl class="mt-6 grid grid-cols-2 sm:grid-cols-3">{facts_html}</dl></div>'
        f'{lead}{repo}</div></div>'
    )
    blocks = detail_blocks(p)
    names = s("sec")
    toc = "".join(f'<li><a href="#{b}"{toc_attrs(b, n == 0)} class="relative block py-1.5 pl-3 text-ui text-muted transition-colors hover:text-ink data-[current=true]:font-semibold data-[current=true]:text-ink before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:bg-line data-[current=true]:before:bg-primary forced-colors:data-[current=true]:before:bg-[CanvasText]">{names[b]}</a></li>'
                  for n, b in enumerate(blocks))
    body = "".join(f'<section id="{b}" data-block="{b}" aria-labelledby="{b}-title" class="border-t border-line py-8 first:border-t-0 first:pt-0 lg:py-10">'
                   f'<h2 id="{b}-title" class="mb-4 text-h2 font-bold text-ink">{names[b]}</h2>{block_content(b, p)}</section>' for b in blocks)
    i = PROJECTS.index(p)

    def pn(q, label, right=False):
        return (f'<a href="{item_href(q["id"])}" class="{cls("group block py-6 active:bg-primary-50", "border-t border-line sm:border-l sm:border-t-0 sm:pl-6 sm:text-right" if right else "sm:pr-6")}">'
                f'<span class="block text-sm text-muted">{label}</span><span class="mt-1 block text-lg font-bold text-ink transition-colors group-hover:text-primary">{t(q["title"])}</span>'
                f'<span class="mt-0.5 block text-sm tabular-nums text-muted">{period(q["start"], q["end"])}</span></a>')

    def to_list(right=False):
        return (f'<a href="{page_href("list")}" class="{cls("group flex items-center py-6 active:bg-primary-50", "border-t border-line sm:justify-end sm:border-l sm:border-t-0 sm:pl-6" if right else "sm:pr-6")}">'
                f'<span class="text-lg font-bold text-ink transition-colors group-hover:text-primary">{s("all_projects").format(n=len(PROJECTS))}</span></a>')
    left = pn(PROJECTS[i - 1], s("prev")) if i > 0 else to_list()
    right = pn(PROJECTS[i + 1], s("next"), True) if i + 1 < len(PROJECTS) else to_list(True)
    pager = f'<nav aria-label="{s("other_projects")}" class="border-t border-line"><div class="shell grid sm:grid-cols-2">{left}{right}</div></nav>'
    return (f'<main id="main" data-layout="{p.get("layout", "default")}">{hero_}'
            '<div class="border-t border-line"><div class="shell grid gap-x-12 pt-8 lg:grid-cols-12 lg:pt-10">'
            f'<nav aria-labelledby="toc-title" class="mb-8 lg:col-span-3 lg:mb-0"><div class="lg:sticky lg:top-24"><p id="toc-title" class="text-sm font-semibold text-ink-2">{s("toc")}</p>'
            f'<ul class="mt-2 grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-1">{toc}</ul></div></nav>'
            f'<div class="min-w-0 lg:col-span-9">{body}</div></div></div>{pager}</main>')


# ───────────────────────────── list ─────────────────────────────
def list_body():
    cats = {}
    for p in PROJECTS:
        for c, n in p["tech"]:
            cats.setdefault(c, [])
            if n not in cats[c]:
                cats[c].append(n)
    order = [(c, cats[c]) for c in TIER if c in cats]
    entries = "".join(project_entry(p, heading="h2") for p in PROJECTS)
    return ('<main id="main" class="shell py-8 lg:py-12">'
            f'<a href="{page_href("home")}" class="{cls("inline-flex min-h-6 items-center text-ui font-medium", LINK)}">{s("back_home")}</a>'
            f'<h1 class="mt-5 flex items-baseline gap-3 text-title-sm font-bold text-ink sm:text-title">{s("nav")["projects"]}<span class="text-lead font-semibold tabular-nums text-muted">{s("count").format(n=len(PROJECTS))}</span></h1>'
            f'<section aria-labelledby="filter-title" class="mt-6"><h2 id="filter-title" class="text-ui font-semibold text-ink-2">{s("filter_label")}</h2>'
            f'<div class="mt-2 rounded-panel bg-surface px-3 py-1 sm:px-5"><ul>{stack_rows(order, unrecorded=False)}</ul></div></section>'
            f'{filter_bar()}<ol data-project-list class="mt-4 divide-y divide-line border-t border-line">{entries}</ol>'
            f'<p class="mt-4 border-t border-line pt-4 text-ui text-muted">{s("provenance")}</p></main>')


# ───────────────────────────── page shells ─────────────────────────────
def body_for(page):
    skip = f'<a href="#main" class="sr-only z-60 rounded-node bg-ink px-4 py-2 text-ui text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">{s("skip")}</a>'
    main = {"home": home_body, "detail": lambda: detail_body(PROJECTS[0]), "detail2": lambda: detail_body(PROJECTS[2]), "list": list_body}[page]()
    return f'{skip}{header()}{main}{footer()}{status_region()}'


ROOT_CLS = "scroll-pt-32 md:scroll-pt-24 lg:scroll-pt-20 tiny:scroll-pt-0"
TITLES = {"home": "title_home", "detail": "title_detail", "detail2": "title_detail2", "list": "title_list"}
PAGES = ("home", "detail", "detail2", "list")

PROTO_JS = open(os.path.join(HERE, "page.js"), encoding="utf8").read()
DC_JS = open(os.path.join(HERE, "dc-logic.js"), encoding="utf8").read()


def render_proto(page, lc):
    global MODE
    MODE = "proto"
    CTX.update(loc=lc, page=page, mobile=False)
    font = '@font-face{font-family:"Pretendard Variable";src:url("../../design/fonts/PretendardVariable.woff2") format("woff2");font-weight:45 920;font-display:swap}'
    cfg = json.dumps({"filter": s("filter_status")}, ensure_ascii=False)
    return (f'<!doctype html>\n<html lang="{lc}" class="{ROOT_CLS}">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            f'<meta name="theme-color" content="#ffffff">\n<title>{s(TITLES[page])}</title>\n<style>{font}</style>\n<link rel="stylesheet" href="../sys.css">\n</head>\n'
            f'<body data-page="{page}" data-cfg=\'{cfg}\'>\n{body_for(page)}\n<script>\n{PROTO_JS}</script>\n</body>\n</html>\n')


def filter_cfg():
    techs = {}
    for p in PROJECTS:
        for _, n in p["tech"]:
            techs.setdefault(hk(slug(n)), {"label": n, "projects": []})["projects"].append(hk(p["id"]))
    return techs


def dc_cfg(page):
    copy = {}
    if page == "home":
        copy = {"email": {"value": EMAIL, "status": s("copied_email")}, "discord": {"value": DISCORD, "status": s("copied_discord")}}
    return {
        "nav": NAV_IDS if page == "home" else None,
        "toc": detail_blocks(PROJECTS[0] if page == "detail" else PROJECTS[2]) if page in ("detail", "detail2") else None,
        "techs": filter_cfg() if page in ("home", "list") else {}, "projects": [hk(p["id"]) for p in PROJECTS], "filterTpl": s("filter_status"),
        "copy": copy, "copyIdle": s("copy"), "copied": s("copied"), "copyFail": s("copy_failed"), "copyHint": s("copy_failed_hint"),
    }


def render_dc(page, lc, mobile, css_blob, w, h):
    global MODE
    MODE = "dc"
    CTX.update(loc=lc, page=page, mobile=mobile)
    helmet = ('<style>\n'
              f'@font-face{{font-family:"Pretendard Variable";src:url({FONT_BLOB}) format("woff2");font-weight:45 920;font-style:normal;font-display:swap}}\n'
              'body{margin:0}\nhtml{scroll-padding-top:8rem}\n@media (width>=48rem){html{scroll-padding-top:6rem}}\n@media (width>=64rem){html{scroll-padding-top:5rem}}\n@media (max-height:240px){html{scroll-padding-top:0}}\n'
              '</style>')
    root = f'<div>{body_for(page)}</div>'
    js = DC_JS.replace("__CFG__", json.dumps(dc_cfg(page), ensure_ascii=False))
    props = json.dumps({"$preview": {"width": w, "height": h}})
    return (f'<!doctype html>\n<html lang="{lc}">\n<head>\n<meta charset="utf-8">\n<title>{s(TITLES[page])}</title>\n<script src="./support.js"></script>\n'
            f'<link rel="stylesheet" href="{css_blob}">\n</head>\n<body>\n<x-dc>\n<helmet>\n{helmet}\n</helmet>\n{root}\n</x-dc>\n'
            f"<script type=\"text/x-dc\" data-dc-script data-props='{props}'>\n{js}</script>\n</body>\n</html>\n")


BOARDS = [  # file, page, loc, mobile
    ("Main.dc.html", "home", "ko", False), ("Project.dc.html", "detail", "ko", False), ("Project-b.dc.html", "detail2", "ko", False), ("Projects.dc.html", "list", "ko", False),
    ("Mobile.dc.html", "home", "ko", True), ("Project-mobile.dc.html", "detail", "ko", True), ("Project-b-mobile.dc.html", "detail2", "ko", True), ("Projects-mobile.dc.html", "list", "ko", True),
    ("Main-en.dc.html", "home", "en", False), ("Project-en.dc.html", "detail", "en", False), ("Projects-en.dc.html", "list", "en", False),
    ("Mobile-en.dc.html", "home", "en", True), ("Project-mobile-en.dc.html", "detail", "en", True), ("Projects-mobile-en.dc.html", "list", "en", True),
]
BOARD_TITLES = {
    ("home", "ko", False): "홈 · 1440", ("detail", "ko", False): "프로젝트 상세 · 1440", ("detail2", "ko", False): "프로젝트 상세 (데이터가 적은 경우) · 1440",
    ("list", "ko", False): "프로젝트 목록 · 1440",
    ("home", "ko", True): "홈 · 390", ("detail", "ko", True): "프로젝트 상세 · 390", ("detail2", "ko", True): "상세 (데이터 적음) · 390", ("list", "ko", True): "프로젝트 목록 · 390",
    ("home", "en", False): "Home · 1440", ("detail", "en", False): "Project detail · 1440", ("list", "en", False): "All projects · 1440",
    ("home", "en", True): "Home · 390", ("detail", "en", True): "Project detail · 390", ("list", "en", True): "All projects · 390",
}


def main():
    if sys.argv[1] == "proto":
        for page in PAGES:
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
        x_desk = {"home": 0, "detail": 1520, "detail2": 3040, "list": 4560}
        x_mob = {"home": 6080, "detail": 6550, "detail2": 7020, "list": 7490}
        ko_h = max(v for k, v in heights.items() if "-ko-" in k)
        row_h = ko_h + 420
        for fname, page, lc, mobile in BOARDS:
            w = 390 if mobile else 1440
            h = heights[f"{page}-{lc}-{w}"]
            with open(os.path.join(out, "project", fname), "w", encoding="utf8") as f:
                f.write(render_dc(page, lc, mobile, css_blob, w, h))
            x = (x_mob if mobile else x_desk)[page]
            if lc == "en" and page == "list":
                x = (x_mob if mobile else x_desk)["detail2"]  # no EN sparse sample: close the gap
            e = {"x": x, "y": 0 if lc == "ko" else row_h, "w": w, "h": h, "title": BOARD_TITLES[(page, lc, mobile)]}
            if not mobile:
                e["expand"] = "fill"
            e["is_interactive"] = True
            boards[fname] = e
            order.append(fname)
        canvas = {
            "v": 3, "createdOnFiles": {"v": 1, "at": "2026-10-11T07:30:00Z"}, "title": "홍길동 포트폴리오", "launch": {"view": "canvas"}, "pages": [],
            "boards": boards, "order": order,
            "notes": {
                "title": {"x": 0, "y": -300, "text": "한국어 — 홈 · 프로젝트 상세 · 상세(데이터가 적은 프로젝트) · 전체 목록 · 모바일", "kind": "title1", "maxW": 7880},
                "english": {"x": 0, "y": row_h - 300, "text": "English — Home · Project detail · All projects · Mobile", "kind": "title1", "maxW": 7880},
            },
            "designSystems": [],
        }
        with open(os.path.join(out, "project", "canvas.json"), "w", encoding="utf8") as f:
            json.dump(canvas, f, ensure_ascii=False, indent=1)
        print("dc boards written", out)


if __name__ == "__main__":
    main()
