#!/usr/bin/env python3
"""Generate every portfolio artboard (.dc.html) from shared components + ko/en strings.

One source of truth keeps all artboards consistent (same row, link, button, header
components). Output: design/project/*.dc.html
"""
import html, os, sys

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "design", "project")
FONT_BLOB = "/_blob/76760fbe63bd614486cd18b85bb00898"
HOLE = "@@ACCENT@@"  # becomes {{accent}}

# --------------------------------------------------------------------------- strings
S = {
  "ko": {
    "nav": ["소개", "프로젝트", "대외활동", "수상", "학회", "개발 역량", "학력", "연락처"],
    "yearPh": "[연도]", "now": "현재", "sample": "[예시 배치]", "sampleShort": "[예시]",
    "laneCounts": ["3", "2", "2", "행사 3"], "kindAct": "대외활동", "kindProj": "프로젝트", "kindRole": "학회 직책", "kindEvent": "학회 행사", "kindAward": "수상",
    "mapCaption": "기록 연표 (시간순)", "plateLabel": "기간 도판", "jan": "1월", "dec": "12월",
    "mxCat": "분류", "mxTech": "기술", "mxUsed": "사용", "mxUnused": "사용 안 함", "mxCaption": "기술별 사용 프로젝트",
    "legend": {"p": "3건 · [연도]–[연도]", "a": "2건 · [연도]–[연도]", "w": "2건 · [연도]–[연도]", "s": "행사 3건 · [연도]–현재", "k": "기술 6개 · 프로젝트 3개"},
    "legendShort": {"p": "3건", "a": "2건", "w": "2건", "s": "행사 3건", "k": "기술 6개"},
    "usage": "프로젝트 {n}개 중 {k}개에서 사용",
    "navLabel": "섹션", "langLabel": "언어", "skip": "본문으로 건너뛰기",
    "photoAria": "프로필 사진 자리 (준비 중)", "photoCap": "[증명사진 3:4]",
    "name": "홍길동", "nameAlt": "[영문 이름]",
    "roles": ["AI·웹 개발", "AI·바이브코딩 교육", "해커톤 운영"],
    "intro": "[자기소개 1–2문장: 어떤 문제에 관심이 있고, 무엇을 만들어 왔는지]",
    "fAff": "소속", "vAff": "[학교 이름] [전공] 재학 중",
    "fSoc": "학회", "vSoc": "[학회 이름] · [현재 직책]",
    "fMail": "이메일", "vMail": "[이메일 주소]",
    "fGh": "GitHub", "vGh": "github.com/gaudium1257",
    "copy": "복사", "copyMail": "이메일 주소 복사", "copyDiscord": "Discord 사용자명 복사",
    "newTab": "(새 탭)", "viewAll": "전체 보기", "viewAllSr": ": 프로젝트 전체 목록",
    "teamHack": "팀 · 해커톤", "period": "[기간]", "date": "[날짜]",
    "p1": "스터디 타이머", "p1tag": "함께 공부하는 시간을 기록하는 웹앱",
    "myRole": "내 역할", "role": "[역할]", "live": "배포 중",
    "related": "관련", "srAward": "수상: ", "srAct": "대외활동: ", "srProj": "프로젝트: ", "srSoc": "학회: ",
    "award": ("OO 해커톤 ", "대상", ""),  # before, grade word, after
    "act1": "OO 해커톤 참가",
    "details": "자세히 보기", "demo": "데모", "gh": "GitHub", "slides": "발표 자료",
    "p2": "강의 요약 챗봇", "p2meta": "개인", "p3": "학회 출석 관리 서비스", "p3meta": "학회", "statusPh": "[배포 상태]",
    "oneLine": "[한 줄 소개]", "socName": "[학회 이름]",
    "orgRole": "[주최 기관] · [역할]", "actName": "[대외활동 이름]", "orgRole2": "[기관] · [역할]",
    "awardName": "[수상명]", "organizer": "[주최 기관]",
    "socDesc": "AI 교육, 바이브코딩 교육, 해커톤을 운영하는 학회",
    "roles_h": "직책", "curRole": "[현재 직책]", "curPeriod": "[기간] – 현재", "prevRole": "[이전 직책]",
    "events_h": "운영한 행사", "evTypes": ["교육", "해커톤", "[유형]"],
    "evTitles": ["바이브코딩 입문 교육", "교내 AI 해커톤 운영", "[행사 이름]"], "evRole": "역할",
    "skillCats": ["프론트엔드", "백엔드", "AI"],
    "eduPeriod": "[입학년도] – 재학 중", "school": "[학교 이름]", "majorDeg": "[전공] · [학위]",
    "contactIntro": "[연락 안내 한 문장]", "igHandle": "@[아이디]", "discord": "[사용자명]",
    "footer": "© 2026 홍길동",
    # detail
    "toc": ["요약", "내가 한 일", "핵심 기능", "기술 스택", "결과", "문제와 해결", "관련 항목"],
    "tocLabel": "이 프로젝트의 목차", "back": "프로젝트 목록",
    "fPeriod": "기간", "vPeriod": "[시작] – [종료]", "fTeam": "팀 · 내 역할", "vTeam": "[N]명 · [역할]",
    "fStatus": "진행 상태", "vStatus": "완료", "fDeploy": "배포", "vPlatform": "[플랫폼]",
    "summaryPh": "[2–4문장: 무엇을 만들었고, 누구를 위한 것이며, 어떤 문제를 푸는지]",
    "contribNote": "팀 프로젝트에서 직접 맡은 부분",
    "contrib": ["[내가 한 일 1 — 구체적으로, 한 문장]", "[내가 한 일 2]", "[내가 한 일 3]"],
    "shot": "[대표 스크린샷]", "shotAria": "대표 스크린샷 자리", "caption": "[캡션]",
    "features": ["공유 타이머", "집중 기록", "[기능 이름]"], "featDesc": "[기능 설명 한 문장]",
    "stackRows": [("프론트엔드", "Next.js"), ("백엔드", "Supabase"), ("인프라", "[배포 플랫폼]")],
    "outcome": ("", "OO 해커톤 대상", " 수상"), "outcomePh": "[결과 — 근거가 있는 것만]",
    "problem": "문제", "solution": "해결", "problemPh": "[어떤 문제가 있었는지]", "solutionPh": "[어떻게 해결했는지]",
    "relAward": "수상", "relAct": "대외활동", "prev": "이전 프로젝트", "next": "다음 프로젝트",
    "otherProjects": "다른 프로젝트",
    # list page
    "listTitle": "프로젝트", "listCount": "전체 3개", "home": "홈",
    "imgAria": "대표 이미지 자리", "img": "[대표 이미지]",
    "title_home": "홍길동 포트폴리오 · 홈", "title_detail": "스터디 타이머 · 프로젝트", "title_list": "프로젝트 · 홍길동",
  },
  "en": {
    "nav": ["About", "Projects", "Activities", "Awards", "Society", "Skills", "Education", "Contact"],
    "yearPh": "[Year]", "now": "Now", "sample": "[Sample layout]", "sampleShort": "[Sample]",
    "laneCounts": ["3", "2", "2", "3 events"], "kindAct": "Activity", "kindProj": "Project", "kindRole": "Society role", "kindEvent": "Society event", "kindAward": "Award",
    "mapCaption": "Record timeline (by date)", "plateLabel": "period plate", "jan": "Jan", "dec": "Dec",
    "mxCat": "Category", "mxTech": "Tool", "mxUsed": "Used in", "mxUnused": "Not used", "mxCaption": "Tools by project",
    "legend": {"p": "3 projects · [Year]–[Year]", "a": "2 activities · [Year]–[Year]", "w": "2 awards · [Year]–[Year]", "s": "3 events · [Year]–now", "k": "6 tools · 3 projects"},
    "legendShort": {"p": "3", "a": "2", "w": "2", "s": "3 events", "k": "6 tools"},
    "usage": "Used in {k} of {n} projects",
    "navLabel": "Sections", "langLabel": "Language", "skip": "Skip to content",
    "photoAria": "Profile photo placeholder", "photoCap": "[ID photo 3:4]",
    "name": "[English name]", "nameAlt": "홍길동",
    "roles": ["AI & web development", "AI & vibe-coding education", "Hackathon operations"],
    "intro": "[1–2 sentence intro: the problems you care about and what you have built]",
    "fAff": "Affiliation", "vAff": "[Major] student, [University]",
    "fSoc": "Society", "vSoc": "[Society name] · [Current role]",
    "fMail": "Email", "vMail": "[email address]",
    "fGh": "GitHub", "vGh": "github.com/gaudium1257",
    "copy": "Copy", "copyMail": "Copy email address", "copyDiscord": "Copy Discord username",
    "newTab": "(opens in a new tab)", "viewAll": "View all", "viewAllSr": " projects",
    "teamHack": "Team · Hackathon", "period": "[Period]", "date": "[Date]",
    "p1": "Study Timer", "p1tag": "A web app for logging study time together",
    "myRole": "My role", "role": "[Role]", "live": "Live",
    "related": "Related", "srAward": "Award: ", "srAct": "Activity: ", "srProj": "Project: ", "srSoc": "Society: ",
    "award": ("", "Grand Prize", ", OO Hackathon"),
    "act1": "Participant, OO Hackathon",
    "details": "Details", "demo": "Demo", "gh": "GitHub", "slides": "Slides",
    "p2": "Lecture Summary Chatbot", "p2meta": "Personal", "p3": "Society Attendance Manager", "p3meta": "Society", "statusPh": "[Deployment status]",
    "oneLine": "[One-line summary]", "socName": "[Society name]",
    "orgRole": "[Organizer] · [Role]", "actName": "[Activity name]", "orgRole2": "[Organization] · [Role]",
    "awardName": "[Award name]", "organizer": "[Organizer]",
    "socDesc": "An academic society that runs AI education, vibe-coding education and hackathons",
    "roles_h": "Roles", "curRole": "[Current role]", "curPeriod": "[Period] – Present", "prevRole": "[Previous role]",
    "events_h": "Events organized", "evTypes": ["Education", "Hackathon", "[Type]"],
    "evTitles": ["Intro to Vibe Coding", "Campus AI Hackathon", "[Event name]"], "evRole": "Role",
    "skillCats": ["Frontend", "Backend", "AI"],
    "eduPeriod": "[Year] – Present", "school": "[University]", "majorDeg": "[Major] · [Degree]",
    "contactIntro": "[One sentence on how to reach you]", "igHandle": "@[username]", "discord": "[username]",
    "footer": "© 2026 [English name]",
    "toc": ["Summary", "What I did", "Key features", "Tech stack", "Outcomes", "Challenges", "Related"],
    "tocLabel": "On this page", "back": "All projects",
    "fPeriod": "Period", "vPeriod": "[Start] – [End]", "fTeam": "Team · My role", "vTeam": "[N] people · [Role]",
    "fStatus": "Status", "vStatus": "Completed", "fDeploy": "Deployment", "vPlatform": "[Platform]",
    "summaryPh": "[2–4 sentences: what you built, who it is for, and the problem it solves]",
    "contribNote": "The parts I owned in the team",
    "contrib": ["[What I did 1 — specific, one sentence]", "[What I did 2]", "[What I did 3]"],
    "shot": "[Main screenshot]", "shotAria": "Main screenshot placeholder", "caption": "[Caption]",
    "features": ["Shared timer", "Focus log", "[Feature name]"], "featDesc": "[One-sentence description]",
    "stackRows": [("Frontend", "Next.js"), ("Backend", "Supabase"), ("Infrastructure", "[Hosting platform]")],
    "outcome": ("Won the ", "Grand Prize at OO Hackathon", ""), "outcomePh": "[Outcome — only with evidence]",
    "problem": "Problem", "solution": "Solution", "problemPh": "[What the problem was]", "solutionPh": "[How you solved it]",
    "relAward": "Award", "relAct": "Activity", "prev": "Previous project", "next": "Next project",
    "otherProjects": "Other projects",
    "listTitle": "Projects", "listCount": "3 projects", "home": "Home",
    "imgAria": "Cover image placeholder", "img": "[Cover image]",
    "title_home": "[English name] · Portfolio", "title_detail": "Study Timer · Project", "title_list": "Projects · [English name]",
  },
}
SECTION_IDS = ["about", "projects", "activities", "awards", "society", "skills", "education", "connect"]
TOC_IDS = ["summary", "contributions", "features", "stack", "outcomes", "challenges", "related"]
SKILLS = [  # (category index, [(tech, project key)])
  (0, [("Next.js", "p1"), ("React", "p3")]),
  (1, [("FastAPI", "p2"), ("Supabase", "p1"), ("Firebase", "p3")]),
  (2, [("OpenAI API", "p2")]),
]

esc = html.escape

def board(kind, L, mobile):
    """Locale- and device-aware artboard file name, so prototype links stay on the right board."""
    base = {"home": "Mobile" if mobile else "Main", "detail": "Project", "list": "Projects"}[kind]
    dev = "-mobile" if (mobile and kind != "home") else ""
    return f"{base}{dev}{'-en' if L == 'en' else ''}.dc.html"

def counterpart(kind, L, mobile):
    return board(kind, "en" if L == "ko" else "ko", mobile)
def is_ph(s): return s.strip().startswith("[")

# --------------------------------------------------------------------------- style atoms
MUTED = "color: var(--color-muted)"
LINK = "color: var(--color-primary); text-decoration: underline; text-decoration-color: var(--color-link-underline); text-decoration-thickness: 1px; text-underline-offset: 3px"
META = "font-size: var(--text-meta); line-height: 1.5; letter-spacing: 0; color: var(--color-muted)"
DATE = META + "; font-variant-numeric: tabular-nums; white-space: nowrap"
TITLE = "margin: 0; font-size: var(--text-title); line-height: 1.45; font-weight: 600; letter-spacing: -0.01em"
SECOND = "font-size: var(--text-secondary); line-height: 1.6; letter-spacing: 0"
BODY = "font-size: var(--text-body); line-height: 1.75; letter-spacing: -0.01em"
H2 = "margin: 0; font-size: var(--text-h2); line-height: 1.35; font-weight: 600; letter-spacing: -0.02em"
RULE = "border-top: 1px solid var(--color-line)"

def col(s, base=""):
    """Style for a text value: muted when it is a [placeholder]."""
    return (base + "; " if base else "") + (MUTED if is_ph(s) else "color: var(--color-ink)")

def svg(kind, size=16, sw=1.75):
    paths = {
        "arrow": '<path d="M5 12h14M13 6l6 6-6 6"></path>',
        "back": '<path d="M19 12H5M11 6l-6 6 6 6"></path>',
        "ext": '<path d="M7 17 17 7M8 7h9v9"></path>',
    }[kind]
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths}</svg>'

def a_link(href, text, L, *, ext=False, sr_pre="", sr_post="", weight=500, block=False, extra="", hit=False, trailing="", glyph_kind=""):
    """Purple text link. block=True gives a 44px-tall inline-flex target."""
    disp = "display: inline-flex; align-items: center; gap: 4px; min-height: 44px; " if block else ""
    pad = "padding: 13px 0; " if hit else ""  # enlarges inline hit area without moving layout
    attrs = ' target="_blank" rel="noopener noreferrer"' if ext else ""
    gl = ""
    if glyph_kind:  # type glyph of the link target (project bar / activity outline / award diamond / society dot)
        gl = (glyph(glyph_kind).replace('style="', 'style="margin-right: 2px; ', 1) if block
              else f'<span style="display: inline-block; margin-right: 6px; vertical-align: -1px; line-height: 0">{glyph(glyph_kind)}</span>')
    inner = (f'<span class="sr-only">{esc(sr_pre)}</span>' if sr_pre else "") + gl + (f"<span>{text}</span>" if block else text)
    if sr_post: inner += f'<span class="sr-only">{esc(sr_post)}</span>'
    inner += trailing
    if ext: inner += (svg("ext", 14, 2) if block else svg("ext", 14, 2).replace("<svg ", '<svg style="margin-left: 4px; vertical-align: -2px" ', 1)) + f'<span class="sr-only">{esc(S[L]["newTab"])}</span>'
    nw = "white-space: nowrap; " if (glyph_kind and not block) else ""
    return f'<a href="{href}"{attrs} style="{disp}{pad}{nw}font-weight: {weight}; {LINK}{"; " + extra if extra else ""}">{inner}</a>'

def award_html(L, link=None, hit=False, block=False, sr=True):
    b, g, a = S[L]["award"]
    # nbsp: a trailing normal space is dropped when the link is laid out as a flex container
    b_html = esc(b[:-1]) + "&nbsp;" if b.endswith(" ") else esc(b)
    if link:  # inside a link the rank keeps the link colour; weight carries the emphasis
        t = f'{b_html}<span style="font-weight: 600">{esc(g)}</span>{esc(a)}'
        return a_link(link, t, L, sr_pre=S[L]["srAward"] if sr else "", block=block, hit=hit, glyph_kind="w")
    return f'{b_html}<span style="color: var(--color-award); font-weight: 600">{esc(g)}</span>{esc(a)}'

def relation_line(L, links, mobile=False):
    label = f'<span style="{META}; font-weight: 500; margin-right: 8px">{esc(S[L]["related"])}</span>'
    if mobile:  # 44px links in their own wrapping box: wrapped links align under the first one, no overlapping hit areas
        lab = f'<span style="flex: none; display: inline-flex; align-items: center; min-height: 44px; margin-right: 8px; {META}; font-weight: 500">{esc(S[L]["related"])}</span>'
        return (f'<p style="margin: 4px 0 0; display: flex; align-items: flex-start; {SECOND}">{lab}'
                f'<span style="flex: 1 1 0; min-width: 0; display: flex; flex-wrap: wrap; column-gap: 16px">{"".join(links)}</span></p>')
    sep = '<span aria-hidden="true" style="color: var(--color-muted); padding: 0 2px"> · </span>'
    return f'<p style="margin: 8px 0 0; {SECOND}">{label}' + sep.join(links) + "</p>"

def copy_btn(label_aria, L):
    return (f'<button type="button" class="copy" aria-label="{esc(label_aria)}" style="flex: none; min-height: 32px; padding: 0 10px; '
            f'border: 1px solid var(--color-line-strong); border-radius: var(--radius-sm); background: var(--color-bg); color: var(--color-ink); '
            f'font-family: var(--font-sans); font-size: var(--text-meta); font-weight: 500; letter-spacing: 0">{esc(S[L]["copy"])}</button>')

def slot(label, aria, ratio="16 / 10", extra=""):
    return (f'<div role="img" aria-label="{esc(aria)}" style="aspect-ratio: {ratio}; box-sizing: border-box; border-radius: var(--radius-md); '
            f'background: var(--color-slot); border: 1px solid var(--color-line); display: flex; align-items: center; justify-content: center; '
            f'{META}; font-weight: 500{"; " + extra if extra else ""}">{esc(label)}</div>')

# --------------------------------------------------------------------------- graphic layer: "Chronicle Ruler" + period plate
# Shape = content type: project = solid bar, activity = outlined bar, award = brown diamond, society = dot / band.
# Every mark comes from a content field (here: the SAMPLE placement, labelled as a sample on the board).
D = 46  # months in the sample domain: m0 = January of the first year, m46 = now
SAMPLE = {"p2": (5, 10), "p3": (15, 21), "p1": (27, 32), "act2": (1, 9), "act1": (31, 32),
          "awd2": 20, "awd1": 31.5, "role_prev": (10, 26), "role_cur": (26, 46), "ev": [13, 29, 40], "years": [0, 12, 24, 36]}
PROJECT_ORDER = ["p2", "p3", "p1"]  # timeline order (period.start)
RELS = {"p1": ["awd1", "act1"], "act1": ["p1", "awd1"], "awd1": ["p1", "act1"], "p3": ["society"]}
TECH_USE = {"Next.js": "p1", "React": "p3", "FastAPI": "p2", "Supabase": "p1", "Firebase": "p3", "OpenAI API": "p2"}

SVG_A = 'aria-hidden="true" focusable="false"'
NS = 'vector-effect="non-scaling-stroke"'
F_MARK = "fill: var(--color-mark)"
F_FILL = "fill: var(--color-mark-fill); stroke: var(--color-mark)"
F_AWARD = "fill: var(--color-award)"

def pct(m):
    return f"{m / D * 100:.3f}%"

def glyph(kind, box="inline"):
    """Type glyph. inline = 10x10 (inside links), legend = 20x10 (legend rows, section lines)."""
    if box == "inline":
        w, body = 10, {
            "p": f'<rect x="0" y="2.5" width="10" height="5" style="{F_MARK}"></rect>',
            "a": f'<rect x="0.5" y="3" width="9" height="4" style="{F_FILL}; stroke-width: 1" {NS}></rect>',
            "w": f'<path d="M5 0l5 5-5 5-5-5z" style="{F_AWARD}"></path>',
            "s": f'<circle cx="5" cy="5" r="4" style="{F_MARK}"></circle>',
        }[kind]
    else:
        w, body = 20, {
            "p": f'<rect x="0" y="1" width="20" height="8" style="{F_MARK}"></rect>',
            "a": f'<rect x="0.75" y="1.75" width="18.5" height="6.5" style="{F_FILL}; stroke-width: 1.5" {NS}></rect>',
            "w": f'<path d="M10 0l5 5-5 5-5-5z" style="{F_AWARD}"></path>',
            "s": f'<rect x="0" y="4" width="20" height="2" style="{F_MARK}"></rect><circle cx="10" cy="5" r="4" style="{F_MARK}; stroke: #FFFFFF; stroke-width: 1.5" {NS}></circle>',
            "k": "".join(f'<rect x="{5 + dx}" y="{dy}" width="4" height="4" style="{F_MARK}"></rect>' for dx in (0, 6) for dy in (0, 6)),
        }[kind]
    return f'<svg class="gx" width="{w}" height="10" viewBox="0 0 {w} 10" {SVG_A} style="display: inline-block; flex: none">{body}</svg>'

def micro_track(kind, span, W):
    """Row's own mark on the shared time scale (fixed-width px coordinates)."""
    def x(m): return round(m / D * W)
    track = (f'<rect class="t" x="0" y="9" width="{W}" height="1" style="fill: var(--color-track)"></rect>'
             + "".join(f'<rect class="t" x="{x(m)}" y="6" width="1" height="3" style="fill: var(--color-mark-empty)"></rect>' for m in SAMPLE["years"][1:])
             + f'<rect x="{W - 1}" y="0" width="1" height="10" style="fill: var(--color-ink)"></rect>')
    if kind in ("p", "a"):
        a, b = span
        w = max(8, x(b) - x(a))
        x0 = min(max(round((a + b) / 2 / D * W) - w // 2, 0), W - 1 - w) if x(b) - x(a) < 8 else x(a)
        mark = (f'<rect x="{x0}" y="2" width="{w}" height="6" style="{F_MARK}"></rect>' if kind == "p"
                else f'<rect class="o" x="{x0 + 0.5}" y="2.5" width="{w - 1}" height="5" style="{F_FILL}; stroke-width: 1" {NS}></rect>')
    elif kind == "w":
        cx = min(max(x(span), 5), W - 5)
        mark = f'<path d="M{cx} 0l5 5-5 5-5-5z" style="{F_AWARD}"></path>'
    else:
        cx = min(max(x(span), 4), W - 5)
        mark = f'<circle cx="{cx}" cy="5" r="3" style="{F_MARK}"></circle>'
    return f'<svg class="gx" width="{W}" height="10" viewBox="0 0 {W} 10" {SVG_A}>{track}{mark}</svg>'

def _bar(m0, m1, y, h, kind, extra=""):
    if m1 - m0 <= 1:  # too short to read as a bar: draw a centred 2h-wide bar
        mid = (m0 + m1) / 2
        inner = (f'<rect x="{-h}" y="{y}" width="{2 * h}" height="{h}" style="{F_MARK}"></rect>' if kind == "p"
                 else f'<rect class="o" x="{-h + 0.75}" y="{y + 0.75}" width="{2 * h - 1.5}" height="{h - 1.5}" style="{F_FILL}; stroke-width: 1.5" {NS}></rect>')
        return f'<svg x="{pct(mid)}" y="0" width="1" height="1" overflow="visible"{extra}>{inner}</svg>'
    if kind == "p":
        return f'<rect x="{pct(m0)}" y="{y}" width="{pct(m1 - m0)}" height="{h}" style="{F_MARK}"{extra}></rect>'
    return f'<rect class="o" x="{pct(m0)}" y="{y + 0.75}" width="{pct(m1 - m0)}" height="{h - 1.5}" style="{F_FILL}; stroke-width: 1.5" {NS}{extra}></rect>'

def _diamond(m, cy, r=7):
    return f'<svg x="{pct(m)}" y="0" width="1" height="1" overflow="visible"><path d="M0 {cy - r}l{r} {r}-{r} {r}-{r}-{r}z" style="{F_AWARD}"></path></svg>'

def _vline(m, y0, y1, style, w=1, cls=""):
    c = f' class="{cls}"' if cls else ""
    return f'<rect{c} x="{pct(m)}" y="{y0}" width="{w}" height="{y1 - y0}" transform="translate({-w / 2} 0)" style="{style}"></rect>'

def _mk(ln, ch, title, body):
    chattr = f' data-ch="{ch}"' if ch else ""
    return f'<g class="mk" data-ln="{ln}"{chattr}><title>{esc(title)}</title>{body}</g>'

def hero_map(L, mobile):
    """기록 연표: every project, activity, award, society role/event on one time scale; stitches = relations."""
    s = S[L]
    lanes = [12, 36, 60, 84] if mobile else [14, 42, 70, 98]
    H = 96 if mobile else 112
    bh, dr, er = (8, 6, 4) if mobile else (10, 7, 5)
    yp, ya, yw, ys = lanes
    def b(lane_y): return lane_y - bh / 2
    grid = "".join(_vline(m, 0, H, "fill: var(--color-track)", cls="t") for m in SAMPLE["years"][1:])
    base = f'<rect class="t" x="0" y="{H - 1}" width="100%" height="1" style="fill: var(--color-track)"></rect>'
    now = f'<rect x="100%" y="0" width="1" height="{H}" transform="translate(-1 0)" style="fill: var(--color-ink)"></rect>'
    st = "fill: var(--color-mark-link)"
    stitches = f'<g data-ch="a">{_vline(SAMPLE["awd1"], yp, yw, st, 1.5)}</g>'  # stitches join dated marks only
    marks = [
        _mk("p", "", f'{s["p2"]} · {s["period"]}', _bar(*SAMPLE["p2"], b(yp), bh, "p")),
        _mk("p", "b", f'{s["p3"]} · {s["period"]}', _bar(*SAMPLE["p3"], b(yp), bh, "p")),
        _mk("p", "a", f'{s["p1"]} · {s["period"]}', _bar(*SAMPLE["p1"], b(yp), bh, "p")),
        _mk("a", "", f'{s["actName"]} · {s["period"]}', _bar(*SAMPLE["act2"], b(ya), bh, "a")),
        _mk("a", "a", f'{s["act1"]} · {s["date"]}', _bar(*SAMPLE["act1"], b(ya), bh, "a")),
        _mk("s", "b", f'{s["prevRole"]} · {s["period"]}',
            f'<rect x="{pct(SAMPLE["role_prev"][0])}" y="{ys - 1}" width="{pct(SAMPLE["role_prev"][1] - SAMPLE["role_prev"][0])}" height="2" style="{F_MARK}"></rect>'),
        _mk("s", "b", f'{s["curRole"]} · {s["curPeriod"]}',
            f'<rect x="{pct(SAMPLE["role_cur"][0])}" y="{ys - 2}" width="{pct(SAMPLE["role_cur"][1] - SAMPLE["role_cur"][0])}" height="4" style="{F_MARK}"></rect>'),
    ]
    sep = _vline(SAMPLE["role_cur"][0], ys - bh / 2, ys + bh / 2, "fill: var(--color-mark-empty)", 1, cls="t")
    dots = "".join(_mk("s", "", f'{s["evTitles"][i]} · {s["date"]}',
                       f'<circle class="sep" cx="{pct(m)}" cy="{ys}" r="{er}" style="{F_MARK}; stroke: #FFFFFF; stroke-width: 2" {NS}></circle>')
                   for i, m in enumerate(SAMPLE["ev"]))
    award_t = "".join(S[L]["award"])
    diamonds = (_mk("w", "", f'{s["awardName"]} · {s["date"]}', _diamond(SAMPLE["awd2"], yw, dr))
                + _mk("w", "a", f'{award_t} · {s["date"]}', _diamond(SAMPLE["awd1"], yw, dr)))
    svg = (f'<svg class="gx" width="100%" height="{H}" {SVG_A}>{grid}{base}{stitches}{sep}{"".join(marks)}{dots}{diamonds}{now}</svg>')
    years = [m for m in SAMPLE["years"]] if not mobile else SAMPLE["years"][:3]
    axis = "".join(f'<span style="position: absolute; left: calc({pct(m)} + 4px); top: 2px; {DATE}">{esc(s["yearPh"])}</span>' for m in years)
    axis += f'<span style="position: absolute; right: 0; top: 2px; {META}; font-weight: 500; color: var(--color-ink)">{esc(s["now"])}</span>'
    plot = f'<div aria-hidden="true" style="position: relative; min-width: 0">{svg}<div style="position: relative; height: 24px">{axis}</div></div>'
    names = [s["nav"][1], s["nav"][2], s["nav"][3], s["nav"][4]]
    kinds = ["p", "a", "w", "s"]
    hrefs = ["#projects", "#activities", "#awards", "#society"]
    if mobile:
        rows = "".join(f'<div style="height: 24px; display: flex; align-items: center; {META}; font-weight: 500; white-space: nowrap">{esc(n)}</div>' for n in names)
        legend = f'<div aria-hidden="true">{rows}<div style="height: 24px; display: flex; align-items: center; {META}">{esc(s["sampleShort"])}</div></div>'
        cols = "72px minmax(0, 1fr)"; gap = "8px"
    else:  # lanes are labelled directly (no swatch/count legend); each label jumps to its section
        rows = "".join(
            f'<a class="lg" data-ln="{k}" href="{h}" style="height: 28px; display: flex; align-items: center; {META}; font-weight: 500; text-decoration: none; white-space: nowrap">{esc(n)}</a>'
            for k, n, h in zip(kinds, names, hrefs))
        legend = f'<div>{rows}<div style="height: 24px; display: flex; align-items: center; {META}">{esc(s["sample"])}</div></div>'
        cols = "var(--axis-label) minmax(0, 1fr)"; gap = "var(--axis-gap)"
    title_of = {"p1": s["p1"], "p2": s["p2"], "p3": s["p3"], "act1": s["act1"], "act2": s["actName"], "awd1": award_t, "awd2": s["awardName"], "society": s["socName"]}
    def start(v): return v[0] if isinstance(v, tuple) else v
    entries = [("p2", s["kindProj"], s["period"]), ("p3", s["kindProj"], s["period"]), ("p1", s["kindProj"], s["period"]),
               ("act2", s["kindAct"], s["period"]), ("act1", s["kindAct"], s["date"]), ("awd2", s["kindAward"], s["date"]), ("awd1", s["kindAward"], s["date"])]
    rows_c = [(start(SAMPLE[k]), kind, title_of[k], d, " · ".join(title_of[r] for r in RELS.get(k, []))) for k, kind, d in entries]
    rows_c += [(SAMPLE["role_prev"][0], s["kindRole"], s["prevRole"], s["period"], ""), (SAMPLE["role_cur"][0], s["kindRole"], s["curRole"], s["curPeriod"], "")]
    rows_c += [(m, s["kindEvent"], s["evTitles"][i], s["date"], "") for i, m in enumerate(SAMPLE["ev"])]
    rows_c.sort(key=lambda r: r[0])
    ol = "".join(f'<li>{esc(k)} · {esc(t)} · {esc(d)}{(" · " + esc(s["related"]) + ": " + esc(r)) if r else ""}</li>' for _, k, t, d, r in rows_c)
    cap = f'<figcaption class="sr-only">{esc(s["mapCaption"])}<ol>{ol}</ol></figcaption>'
    style = (f"flex: 0 0 100%; margin: {'24px 0 0' if mobile else '0'}; display: grid; grid-template-columns: {cols}; column-gap: {gap}")
    return f'<figure class="cmap" data-graphic="map" style="{style}">{legend}{plot}{cap}</figure>'

def plate(L, W, H, compact=False, marks=True):
    """기간 도판: the project's active months (white cells) + what it led to (award / activity marks) on a purple field."""
    s = S[L]
    p = 24 if (W >= 320 and H >= 160) else 16
    g = 4 if W >= 320 else 3
    c = min(22, (W - 2 * p - 11 * g) // 12)
    months = H >= 120
    label_h = 24 if H >= 160 else 18
    rows_bottom = H - p - (label_h if months else 0)
    top = rows_bottom - c
    gw = 12 * c + 11 * g
    x0 = (W - gw) // 2  # centre the 12-month grid
    active = range(3, 8)  # Apr–Aug (sample)
    cells = []
    for i in range(12):
        x = x0 + i * (c + g)
        if i in active:
            cells.append(f'<rect x="{x}" y="{top}" width="{c}" height="{c}" style="fill: var(--color-plate-ink)"></rect>')
        else:
            cells.append(f'<rect x="{x + 0.5}" y="{top + 0.5}" width="{c - 1}" height="{c - 1}" style="fill: none; stroke: var(--color-plate-cell); stroke-width: 1" {NS}></rect>')
    col8 = x0 + 7 * (c + g) + c // 2
    cy = top - 16
    r = 5 if W < 320 else 7
    ah = 6 if W < 320 else 8
    aw = c
    diamond = f'<path d="M{col8 + 0.5} {cy - r}l{r} {r}-{r} {r}-{r}-{r}z" style="fill: var(--color-award); stroke: var(--color-plate-ink); stroke-width: 1.5" {NS}></path>'
    act_y = cy - r - 4 - ah
    act = f'<rect x="{col8 + 0.5 - aw / 2 + 0.75}" y="{act_y + 0.75}" width="{aw - 1.5}" height="{ah - 1.5}" style="fill: none; stroke: var(--color-plate-ink); stroke-width: 1.5" {NS}></rect>'
    stitch = f'<rect x="{col8}" y="{act_y + ah}" width="1" height="{top - act_y - ah}" style="fill: var(--color-plate-ink)"></rect>'
    mk = f"{stitch}{act}{diamond}" if marks else ""
    svg = f'<svg viewBox="0 0 {W} {H}" width="100%" height="100%" {SVG_A} style="position: absolute; inset: 0">{"".join(cells)}{mk}</svg>'
    ysz = 30 if months else 17
    year = (f'<span style="position: absolute; left: {x0 / W * 100:.3f}%; top: {p / H * 100:.3f}%; font-size: {ysz}px; line-height: 1; font-weight: 600; '
            f'letter-spacing: -0.02em; color: var(--color-plate-ink); font-variant-numeric: tabular-nums">{esc(s["yearPh"])}</span>')
    mlabels = ""
    if months:
        lb = f"bottom: {p / H * 100:.3f}%; font-size: var(--text-meta); line-height: {label_h - 4}px; color: var(--color-plate-ink-2); letter-spacing: 0"
        grid_right = x0 + gw
        mlabels = (f'<span style="position: absolute; left: {x0 / W * 100:.3f}%; {lb}">{esc(s["jan"])}</span>'
                   f'<span style="position: absolute; right: {(W - grid_right) / W * 100:.3f}%; {lb}">{esc(s["dec"])}</span>')
    award_t = "".join(s["award"])
    aria = f'{s["p1"]} {s["plateLabel"]}: {s["period"]}' + (f' · {s["related"]}: {award_t} · {s["act1"]}' if marks else "")
    return (f'<div role="img" data-graphic="cover" aria-label="{esc(aria)}" style="forced-color-adjust: none; position: relative; width: 100%; aspect-ratio: {W} / {H}; '
            f'border-radius: var(--radius-md); background: var(--color-plate); overflow: hidden">{svg}{year}{mlabels}</div>')

def role_band(L, mobile):
    s = S[L]
    a, b = SAMPLE["role_prev"][0], 46
    span = b - a
    dots = "".join(f'<circle cx="{(m - a) / span * 100:.3f}%" cy="5" r="4" style="{F_MARK}"></circle>'
                   f'<rect x="{(m - a) / span * 100:.3f}%" y="9" width="1" height="7" transform="translate(-0.5 0)" style="fill: var(--color-mark-empty)"></rect>' for m in SAMPLE["ev"])
    strip = f'<svg class="gx" width="100%" height="16" {SVG_A}>{dots}</svg>'
    seg = "display: block; height: 20px; box-sizing: border-box; padding: 0 8px; font-size: var(--text-meta); font-weight: 500; letter-spacing: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
    prev = (f'<li style="flex: {SAMPLE["role_prev"][1] - a} 1 0; min-width: 0; display: flex; flex-direction: column; gap: 6px">'
            f'<span style="{seg}; line-height: 17px; background: var(--color-mark-fill); border: 1.5px solid var(--color-mark); color: var(--color-mark)">{esc(s["prevRole"])}</span>'
            f'<span style="{DATE}">{esc(s["period"])}</span></li>')
    cur = (f'<li style="flex: {b - SAMPLE["role_cur"][0]} 1 0; min-width: 0; display: flex; flex-direction: column; gap: 6px">'
           f'<span style="{seg}; line-height: 20px; background: var(--color-mark); color: var(--color-plate-ink)">{esc(s["curRole"])}</span>'
           f'<span style="{DATE}">{esc(s["curPeriod"])}</span></li>')
    return (f'<h4 style="margin: 24px 0 8px; {META}; font-weight: 500">{esc(s["roles_h"])}</h4>'
            f'<ol role="list" data-graphic="roles" style="display: flex; gap: 2px; margin: 0; padding: 0; list-style: none">{prev}{cur}</ol>')

def skills_matrix(L, detail_href):
    s = S[L]
    head = (f'<th scope="col" style="width: calc(var(--date-col) + 24px)"><span class="sr-only">{esc(s["mxCat"])}</span></th>'
            f'<th scope="col" style="width: 168px"><span class="sr-only">{esc(s["mxTech"])}</span></th>'
            + "".join(f'<th scope="col" style="padding: 0 8px 8px; vertical-align: bottom; text-align: center; font-weight: 500">'
                      f'<a href="{detail_href}" style="{META}; {LINK}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; padding: 4px 0">{esc(s[k])}</a></th>'
                      for k in PROJECT_ORDER))
    body = []
    for ci, items in SKILLS:
        grp = []
        for j, (t, _k) in enumerate(items):
            rule = f"border-top: 1px solid var(--color-line); " if j == 0 else ""
            cat = (f'<th scope="rowgroup" rowspan="{len(items)}" style="{rule}text-align: left; vertical-align: top; padding-top: 8px; {META}; font-weight: 500">{esc(s["skillCats"][ci])}</th>'
                   if j == 0 else "")
            cells = "".join(
                (f'<td style="{rule}text-align: center; height: 36px; padding: 0"><a href="{detail_href}" style="display: inline-flex; width: 40px; height: 36px; align-items: center; justify-content: center">'
                 f'<svg class="gx" width="12" height="12" viewBox="0 0 12 12" {SVG_A}><rect width="12" height="12" style="{F_MARK}"></rect></svg><span class="sr-only">{esc(s["mxUsed"])}: {esc(s[k])}</span></a></td>')
                if TECH_USE[t] == k else
                (f'<td style="{rule}text-align: center; height: 36px; padding: 0"><svg class="gx" width="4" height="4" viewBox="0 0 4 4" {SVG_A} style="display: block; margin: 0 auto"><rect width="4" height="4" style="fill: var(--color-mark-empty)"></rect></svg>'
                 f'<span class="sr-only">{esc(s["mxUnused"])}</span></td>')
                for k in PROJECT_ORDER)
            grp.append(f'<tr>{cat}<th scope="row" style="{rule}text-align: left; padding: 0 8px 0 0; {SECOND}; font-weight: 500; color: var(--color-ink)">{t}</th>{cells}</tr>')
        body.append(f'<tbody>{"".join(grp)}</tbody>')
    return (f'<div style="overflow-x: auto"><table class="mx" style="width: 100%; border-collapse: collapse; table-layout: fixed">'
            f'<caption class="sr-only">{esc(s["mxCaption"])}</caption><thead><tr>{head}</tr></thead>{"".join(body)}</table></div>')

def usage_strip(tech, this=None, size=10):
    """One slot per project in timeline order; filled if the tech is used there; this project underlined."""
    out, x = [], 0
    for k in PROJECT_ORDER:
        if TECH_USE.get(tech) == k:
            out.append(f'<rect x="{x}" y="0" width="{size}" height="{size}" style="{F_MARK}"></rect>')
        else:
            out.append(f'<rect x="{x + 3}" y="3" width="4" height="4" style="fill: var(--color-mark-empty)"></rect>')
        if this == k:
            out.append(f'<rect x="{x}" y="{size + 2}" width="{size}" height="2" style="fill: var(--color-ink)"></rect>')
        x += size + 4
    w = x - 4
    return f'<svg class="gx" width="{w}" height="14" viewBox="0 0 {w} 14" {SVG_A} style="display: inline-block; flex: none">{"".join(out)}</svg>'

def context_strip(L):
    """Detail 관련 항목: where this project sits in the whole record, and what it led to."""
    s = S[L]
    H = 52
    grid = "".join(_vline(m, 0, H, "fill: var(--color-track)", cls="t") for m in SAMPLE["years"][1:])
    now = f'<rect x="100%" y="0" width="1" height="{H}" transform="translate(-1 0)" style="fill: var(--color-ink)"></rect>'
    track = f'<rect x="0" y="38" width="100%" height="2" style="fill: var(--color-track)"></rect>'
    ghosts = "".join(f'<rect x="{pct(SAMPLE[k][0])}" y="36" width="{pct(SAMPLE[k][1] - SAMPLE[k][0])}" height="6" style="fill: var(--color-mark-ghost)"></rect>' for k in ("p2", "p3"))
    this = f'<rect x="{pct(SAMPLE["p1"][0])}" y="34" width="{pct(SAMPLE["p1"][1] - SAMPLE["p1"][0])}" height="10" style="{F_MARK}"></rect>'
    stitch = _vline(SAMPLE["awd1"], 6, 34, "fill: var(--color-mark-link)", 1.5)
    act = _bar(*SAMPLE["act1"], 2, 8, "a")
    dia = _diamond(SAMPLE["awd1"], 20, 7)
    svg = f'<svg class="gx" width="100%" height="{H}" {SVG_A}>{grid}{track}{ghosts}{stitch}{this}{act}{dia}{now}</svg>'
    axis = "".join(f'<span style="position: absolute; left: calc({pct(m)} + 4px); top: 2px; {DATE}">{esc(s["yearPh"])}</span>' for m in SAMPLE["years"][:3])
    axis += f'<span style="position: absolute; right: 0; top: 2px; {META}; font-weight: 500; color: var(--color-ink)">{esc(s["now"])}</span>'
    return (f'<div aria-hidden="true" data-graphic="context" style="position: relative; margin-bottom: 16px">{svg}'
            f'<div style="position: relative; height: 20px">{axis}</div></div>')

def list_scale(L, mobile):
    s = S[L]
    W = 96 if mobile else 136
    ticks = "".join(f'<rect x="{round(m / D * W)}" y="19" width="1" height="5" style="fill: var(--color-mark-empty)"></rect>' for m in SAMPLE["years"])
    svg = f'<svg class="gx" width="{W}" height="24" viewBox="0 0 {W} 24" {SVG_A} style="position: absolute; inset: 0">{ticks}<rect x="0" y="23" width="{W}" height="1" style="fill: var(--color-mark-empty)"></rect></svg>'
    lab = f"font-size: var(--text-meta); line-height: 16px; color: var(--color-muted); letter-spacing: 0"
    cell = (f'<div style="position: relative; flex: 0 0 {W}px; height: 24px">{svg}<span style="position: absolute; left: 0; top: 0; {lab}">{esc(s["yearPh"])}</span>'
            f'<span style="position: absolute; right: 0; top: 0; {lab}; font-weight: 500; color: var(--color-ink)">{esc(s["now"])}</span></div>')
    style = "display: flex; justify-content: flex-end; margin-bottom: 8px" if mobile else "display: flex; column-gap: 24px; margin-bottom: 8px"
    return f'<div aria-hidden="true" data-graphic="scale" style="{style}">{cell}</div>'

def section_legend(L, kind, mobile):
    s = S[L]
    txt = s["legendShort" if mobile else "legend"][kind]
    if mobile:
        return f'<span aria-hidden="true" style="display: inline-flex; align-items: center">{glyph(kind, "legend")}</span>'
    return f'<p style="margin: 8px 0 0; display: flex; align-items: center; gap: 8px; {META}; font-variant-numeric: tabular-nums">{glyph(kind, "legend")}{esc(txt)}</p>'
# --------------------------------------------------------------------------- page shell
def tokens(mobile):
    t = {
        "--color-bg": "#FFFFFF", "--color-ink": "#1C1626", "--color-ink-2": "#3B3546", "--color-muted": "#5D5670",
        "--color-subtle": "#8A8496", "--color-line": "#E5E0EE", "--color-line-strong": "#D3CEDB", "--color-slot": "#F4F2F7",
        "--color-slot-border": "#B9AFCB", "--color-primary": HOLE, "--color-primary-hover": "#5B21B6", "--color-primary-soft": "#F5F1FE",
        "--color-link-underline": "#CDBEF5", "--color-award": "#8A3B0B", "--color-live": "#15803D",
        "--font-sans": "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif",
        "--text-meta": "13px", "--text-nav": "14px" if mobile else "15px", "--text-secondary": "15px", "--text-body": "16px",
        "--text-title": "17px", "--text-lead": "15px" if mobile else "18px", "--text-h2": "20px" if mobile else "22px",
        "--text-display-2": "30px" if mobile else "40px", "--text-display": "30px" if mobile else "48px",
        "--space-1": "4px", "--space-2": "8px", "--space-3": "12px", "--space-4": "16px", "--space-5": "24px", "--space-6": "32px",
        "--space-7": "40px", "--space-8": "48px", "--space-9": "56px", "--space-10": "64px",
        "--radius-sm": "4px", "--radius-md": "8px", "--container": "1200px", "--gutter": "20px" if mobile else "40px",
        "--axis-label": "216px", "--axis-gap": "56px", "--date-col": "136px", "--fact-label": "88px" if mobile else "96px",
        "--header-h": "48px" if mobile else "64px", "--subnav-h": "44px",
        "--color-mark": "var(--color-primary)", "--color-mark-fill": "#EDE9FE", "--color-mark-ghost": "#DDD6FE", "--color-mark-link": "#8B5CF6",
        "--color-track": "var(--color-line)", "--color-mark-empty": "var(--color-line-strong)", "--color-plate": "var(--color-primary)",
        "--color-plate-ink": "#FFFFFF", "--color-plate-ink-2": "#EDE9FE", "--color-plate-cell": "#C4B5FD",
    }
    return "; ".join(f"{k}: {v}" for k, v in t.items())

def page(L, title, body, w, h, mobile=False, scroll_pad=80):
    css = (
        f"@font-face{{font-family:'Pretendard Variable';src:url({FONT_BLOB}) format('woff2');font-weight:45 920;font-style:normal;font-display:swap}}\n"
        "body{margin:0}\n"
        f"html{{scroll-padding-top:{scroll_pad}px}}\n"
        "a{color:var(--color-ink)}a:hover{color:var(--color-primary-hover)}\n"
        ":focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}\n"
        "header nav{scroll-padding-inline-end:40px}header nav a:focus-visible{outline-offset:-3px;border-radius:4px}\n"
        "h2,h3,h4,h5{text-wrap:balance}p,li,dd{text-wrap:pretty}\n"
        ".sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}\n"
        ".skip{position:absolute;left:-9999px;top:8px}.skip:focus{left:16px;z-index:50;background:var(--color-bg);padding:8px 12px}\n"
        ".copy{position:relative}.copy::after{content:'';position:absolute;inset:-6px 0}\n"
        ".stretch::after{content:'';position:absolute;inset:0}\n"
        ".wordmark{flex:0 0 var(--axis-label)}.strip{margin-left:-12px}\n"
        ".tab{padding:0 12px}.tab .bar{left:12px;right:12px}.tab-m{padding:0 10px}.tab-m .bar{left:10px;right:10px}\n"
        "@media (max-width:1199px){.wordmark{flex:0 0 136px;overflow:hidden;text-overflow:ellipsis}.strip{margin-left:0}.tab{padding:0 8px}.tab .bar{left:8px;right:8px}}\n"
        ".gx{display:block;overflow:visible}.gx .mk{transition:opacity .12s}\n"
        ".cmap:has(.mk:hover) .mk{opacity:.3}.cmap:has([data-ch~=a]:hover) [data-ch~=a],.cmap:has([data-ch~=b]:hover) [data-ch~=b]{opacity:1}\n"
        ".cmap:has(.lg[data-ln=p]:is(:hover,:focus-visible)) .mk:not([data-ln=p]),.cmap:has(.lg[data-ln=a]:is(:hover,:focus-visible)) .mk:not([data-ln=a]),.cmap:has(.lg[data-ln=w]:is(:hover,:focus-visible)) .mk:not([data-ln=w]),.cmap:has(.lg[data-ln=s]:is(:hover,:focus-visible)) .mk:not([data-ln=s]){opacity:.3}\n"
        ".mx tbody tr:hover>*{background:var(--color-primary-soft)}\n"
        "@media (prefers-reduced-motion:reduce){.gx .mk{transition:none}}@media (forced-colors:active){.gx *{fill:CanvasText;stroke:CanvasText}.gx .o{fill:Canvas}.gx .sep{stroke:Canvas}.gx .t{fill:GrayText}}\n"
    )
    width = f"width: {w}px; " if mobile else ""
    doc = f"""<!doctype html>
<html lang="{L}">
<head>
<meta charset="utf-8">
<title>{esc(title)}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
{css}</style>
</helmet>
<div style="{tokens(mobile)}; {width}display: flex; flex-direction: column; min-height: 100dvh; font-family: var(--font-sans); font-synthesis: none; color: var(--color-ink); background: var(--color-bg); font-size: var(--text-body); line-height: 1.75; letter-spacing: 0; word-break: keep-all; overflow-wrap: break-word; -webkit-font-smoothing: antialiased">
<a class="skip" href="#main">{esc(S[L]["skip"])}</a>
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"accent":{{"editor":"color","default":"#6D28D9","options":["#6D28D9","#7C3AED","#5B21B6","#4F46E5"]}},"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
componentDidMount() {{
this._onFocus = (e) => {{ const a = e.target && e.target.closest ? e.target.closest('header nav a') : null; if (a) a.scrollIntoView({{ block: 'nearest', inline: 'nearest' }}); }};
document.addEventListener('focusin', this._onFocus);
}}
componentWillUnmount() {{
document.removeEventListener('focusin', this._onFocus);
}}
renderVals() {{
return {{ accent: this.props.accent ?? '#6D28D9' }};
}}
}}
</script>
</body>
</html>
"""
    return doc.replace(HOLE, "{{accent}}")

def main_open(mobile):
    if mobile:
        return '<main id="main" style="flex: 1 0 auto; padding: 0 var(--gutter)">'
    return '<main id="main" style="flex: 1 0 auto; width: 100%; max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box">'

# --------------------------------------------------------------------------- rows (shared rhythm)
PB = "@@PB@@"      # row padding-bottom: 16px, or 0 on the last row of a list
PB24 = "@@PB24@@"  # same for 24px rows

def row_pad(first):
    """Rows: no top rule on the first row (the section rule above closes it); no bottom padding on the last."""
    return f"padding-top: 0; padding-bottom: {PB}" if first else f"padding-top: 16px; padding-bottom: {PB}; {RULE}"

def seq(rows):
    out = [r.replace(PB, "16px").replace(PB24, "24px") for r in rows[:-1]]
    out.append(rows[-1].replace(PB, "0").replace(PB24, "0"))
    return "".join(out)

def ul(rows, extra=""):
    return f'<ul role="list" style="margin: 0; padding: 0; list-style: none{"; " + extra if extra else ""}">{seq(rows)}</ul>'

# --------------------------------------------------------------------------- header
def tab(href, label, active, h, mobile, size_var="--text-nav"):
    cls = "tab-m" if mobile else "tab"
    if active:
        return (f'<a href="{href}" class="{cls}" aria-current="true" style="position: relative; display: inline-flex; align-items: center; height: {h}px; '
                f'font-size: var({size_var}); font-weight: 600; letter-spacing: 0; color: var(--color-ink); text-decoration: none">{esc(label)}'
                f'<span class="bar" aria-hidden="true" style="position: absolute; bottom: 0; height: 2px; background: var(--color-primary)"></span></a>')
    return (f'<a href="{href}" class="{cls}" style="display: inline-flex; align-items: center; height: {h}px; font-size: var({size_var}); '
            f'font-weight: 500; letter-spacing: 0; color: var(--color-muted); text-decoration: none">{esc(label)}</a>')

def lang_switch(L, kind, mobile, h=44):
    def opt(code, cur):
        sr = "한국어" if code == "ko" else "English"
        href = board(kind, code, mobile)
        style = (f"display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: {h}px; text-decoration: none; "
                 + ("color: var(--color-ink); font-weight: 600" if cur else "color: var(--color-muted); font-weight: 500"))
        cur_attr = ' aria-current="page"' if cur else ""
        return f'<a href="{href}" lang="{code}" hreflang="{code}"{cur_attr} style="{style}">{code.upper()}<span class="sr-only"> {sr}</span></a>'
    return (f'<div role="group" aria-label="{esc(S[L]["langLabel"])}" style="flex: none; display: flex; align-items: center; font-size: var(--text-meta); letter-spacing: 0">'
            + opt("ko", L == "ko") + '<span aria-hidden="true" style="color: var(--color-line-strong)">/</span>' + opt("en", L == "en") + "</div>")

FADE = "-webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent); mask-image: linear-gradient(90deg, #000 calc(100% - 32px), transparent)"
HEADER = 'position: sticky; top: 0; z-index: 20; background: rgba(255, 255, 255, 0.92); backdrop-filter: saturate(180%) blur(12px); box-shadow: inset 0 -1px 0 var(--color-line)'

def lang_attr(text, code):
    """lang attribute only for real values; [placeholders] are written in the page language."""
    return "" if is_ph(text) else f' lang="{code}"'

def header_desktop(L, kind, active_section, *, home_href, toc_active=None):
    hrefs = [f"{home_href}#{i}" for i in SECTION_IDS]
    tabs = "".join(tab(hrefs[i], S[L]["nav"][i], i == active_section, 64, False) for i in range(8))
    name = S[L]["name"]
    row1 = f"""<div style="max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box; display: flex; align-items: center; column-gap: var(--axis-gap); min-height: var(--header-h)">
<a href="{home_href}#about" class="wordmark"{lang_attr(name, "ko")} style="min-width: 0; display: inline-flex; align-items: center; min-height: 44px; font-size: var(--text-title); font-weight: 700; letter-spacing: -0.02em; {col(name)}; text-decoration: none; white-space: nowrap">{esc(name)}</a>
<nav aria-label="{esc(S[L]["navLabel"])}" class="strip" style="flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; {FADE}">
<div style="display: flex; gap: 4px; width: max-content; padding-right: 32px; white-space: nowrap">{tabs}</div>
</nav>
<div style="margin-right: -10px">{lang_switch(L, kind, False)}</div>
</div>"""
    row2 = ""
    if toc_active is not None:
        toc = "".join(tab(f"#{TOC_IDS[i]}", S[L]["toc"][i], i == toc_active, 44, False) for i in range(len(TOC_IDS)))
        row2 = f"""<div style="box-shadow: inset 0 1px 0 var(--color-line)">
<div style="max-width: var(--container); margin: 0 auto; padding: 0 var(--gutter); box-sizing: border-box; display: flex; align-items: center; column-gap: var(--axis-gap); min-height: var(--subnav-h)">
<span class="wordmark" style="min-width: 0; {META}; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{esc(S[L]["p1"])}</span>
<nav aria-label="{esc(S[L]["tocLabel"])}" class="strip" style="flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; {FADE}">
<div style="display: flex; gap: 4px; width: max-content; padding-right: 32px; white-space: nowrap">{toc}</div>
</nav>
</div>
</div>"""
    return f'<header style="{HEADER}">\n{row1}\n{row2}\n</header>'

def header_mobile(L, kind, active_section, *, home_href, toc_active=None):
    hrefs = [f"{home_href}#{i}" for i in SECTION_IDS]
    tabs = "".join(tab(hrefs[i], S[L]["nav"][i], i == active_section, 48, True) for i in range(8))
    row1 = f"""<div style="display: flex; align-items: center; height: var(--header-h); padding: 0 8px 0 10px">
<nav aria-label="{esc(S[L]["navLabel"])}" style="flex: 1 1 auto; min-width: 0; overflow-x: auto; scrollbar-width: none; {FADE}">
<div style="display: flex; width: max-content; padding-right: 32px; white-space: nowrap">{tabs}</div>
</nav>
<span aria-hidden="true" style="flex: none; width: 1px; height: 24px; margin: 0 4px 0 8px; background: var(--color-line)"></span>
{lang_switch(L, kind, True, 48)}
</div>"""
    row2 = ""
    if toc_active is not None:
        toc = "".join(tab(f"#{TOC_IDS[i]}", S[L]["toc"][i], i == toc_active, 44, True) for i in range(len(TOC_IDS)))
        row2 = f"""<nav aria-label="{esc(S[L]["tocLabel"])}" style="height: var(--subnav-h); padding: 0 0 0 10px; overflow-x: auto; scrollbar-width: none; box-shadow: inset 0 1px 0 var(--color-line); {FADE}">
<div style="display: flex; width: max-content; padding-right: 32px; white-space: nowrap">{toc}</div>
</nav>"""
    return f'<header style="{HEADER}">\n{row1}\n{row2}\n</header>'

# --------------------------------------------------------------------------- shared blocks
def roles_list(L, mobile):
    if mobile:
        items = "".join(f'<li style="white-space: nowrap">{esc(r)}</li>' for r in S[L]["roles"])
        return f'<ul style="margin: 8px 0 0; padding: 0; list-style: none; font-size: var(--text-lead); line-height: 1.55; font-weight: 500; letter-spacing: -0.01em">{items}</ul>'
    sep = '<span aria-hidden="true" style="color: var(--color-primary); padding: 0 10px; font-weight: 400">/</span>'
    items = "".join(f'<li style="white-space: nowrap">{sep if i else ""}{esc(r)}</li>' for i, r in enumerate(S[L]["roles"]))
    return f'<ul style="margin: 12px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; font-size: var(--text-lead); line-height: 1.6; font-weight: 500; letter-spacing: -0.01em">{items}</ul>'

def fact(label, value_html, button="", mobile=False):
    rule = f"min-height: 44px; {RULE}" if mobile else "min-height: 36px"
    return (f'<div style="display: flex; align-items: center; {rule}; column-gap: 8px"><dt style="flex: 0 0 var(--fact-label); {META}; font-weight: 500">{esc(label)}</dt>'
            f'<dd style="margin: 0; min-width: 0; display: flex; align-items: center; flex-wrap: wrap; column-gap: 12px; {SECOND}; font-weight: 500">{value_html}{button}</dd></div>')

def hero_facts(L, mobile):
    s = S[L]
    rows = [
        fact(s["fAff"], f'<span style="{col(s["vAff"])}">{esc(s["vAff"])}</span>', mobile=mobile),
        fact(s["fSoc"], f'<span style="{col(s["vSoc"])}">{esc(s["vSoc"])}</span>', mobile=mobile),
        fact(s["fMail"], a_link("mailto:", esc(s["vMail"]), L, block=mobile, extra="overflow-wrap: anywhere"), copy_btn(s["copyMail"], L), mobile=mobile),
        fact(s["fGh"], a_link("https://github.com/gaudium1257", esc(s["vGh"]), L, ext=True, block=mobile), mobile=mobile),
    ]
    if mobile:
        return f'<dl style="margin: 20px 0 0">{"".join(rows)}</dl>'
    # top rule only: the photo's bottom edge and the next section rule close the hero
    return (f'<dl style="margin: 24px 0 0; padding: 12px 0 0; {RULE}; display: grid; '
            f'grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); column-gap: 32px; row-gap: 4px">{"".join(rows)}</dl>')

def photo(L, mobile):
    w = 104 if mobile else 216
    icon = 28 if mobile else 40
    return (f'<figure role="img" aria-label="{esc(S[L]["photoAria"])}" data-check="photo" style="{"" if mobile else "flex: 0 0 var(--axis-label); "}width: {w}px; aspect-ratio: 3 / 4; margin: 0; box-sizing: border-box; '
            f'border-radius: var(--radius-sm); background: var(--color-slot); border: 1px solid var(--color-line); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: {4 if mobile else 8}px; color: var(--color-slot-border)">'
            f'<svg width="{icon}" height="{icon}" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="{2 if mobile else 1.5}" stroke-linecap="round" aria-hidden="true"><circle cx="20" cy="14" r="7"></circle><path d="M6 36c1.5-7.5 7.2-12 14-12s12.5 4.5 14 12"></path></svg>'
            f'<figcaption style="{META}; font-weight: 500; white-space: nowrap">{esc(S[L]["photoCap"])}</figcaption></figure>')

def ledger_row(content, date, first=False, extra_date="", mobile=False, track=None):
    """One dated row. DOM order: content first (heading-first for AT); the date is shown first via order:-1.
    track = (kind, span): the row's own mark on the shared time scale, under the date."""
    if mobile:
        tr = micro_track(track[0], track[1], 96) if track else ""
        return (f'<li style="display: flex; flex-direction: column; {row_pad(first)}"><div>{content}</div>'
                f'<div data-date style="order: -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; {DATE}; margin-bottom: 2px"><span>{date}{extra_date}</span>{tr}</div></li>')
    tr = micro_track(track[0], track[1], 136).replace('class="gx"', 'class="gx" style="margin-top: 6px"', 1) if track else ""
    return (f'<li style="display: flex; flex-wrap: wrap; column-gap: 24px; row-gap: 4px; {row_pad(first)}">'
            f'<div style="flex: 1 1 320px; min-width: 0">{content}</div>'
            f'<div data-date style="order: -1; flex: 0 0 var(--date-col); {DATE}; padding-top: 2px">{date}{extra_date}{tr}</div></li>')

def title_h(tag, text, link=None, stretch=False, size_var="--text-title", track="-0.01em", margin="0", link_extra=""):
    style = f"margin: {margin}; font-size: var({size_var}); line-height: 1.45; font-weight: 600; letter-spacing: {track}; {col(text)}"
    if link:
        cls = ' class="stretch"' if stretch else ""
        return f'<{tag} style="{style}"><a href="{link}"{cls} style="color: var(--color-ink); text-decoration: none{"; " + link_extra if link_extra else ""}">{esc(text)}</a></{tag}>'
    return f'<{tag} style="{style}">{esc(text)}</{tag}>'

def p(text, extra="", base=SECOND, margin="2px 0 0"):
    return f'<p style="margin: {margin}; {base}; {col(text)}{"; " + extra if extra else ""}">{esc(text)}</p>'

def live_html(L):
    return (f'<span style="display: inline-flex; align-items: baseline; gap: 6px; color: var(--color-live); font-weight: 500; white-space: nowrap">'
            f'<span aria-hidden="true" style="align-self: center; width: 6px; height: 6px; border-radius: 3px; background: var(--color-live)"></span>{esc(S[L]["live"])}</span>')

def status_html(L, status):
    return live_html(L) if status == "live" else f'<span style="{MUTED}">{esc(status)}</span>'

def rel(href, text, L, sr_pre, mobile, kind=""):
    return a_link(href, text, L, sr_pre=sr_pre, block=mobile, glyph_kind=kind)

# --------------------------------------------------------------------------- home sections
def featured(L, mobile, detail_href):
    s = S[L]
    rl = relation_line(L, [award_html(L, "#awards", block=mobile), rel("#activities", esc(s["act1"]), L, s["srAct"], mobile, "a")], mobile)
    links = f'''<div style="display: flex; flex-wrap: wrap; column-gap: 20px; margin-top: {8 if mobile else 16}px">
{a_link(detail_href, esc(s["details"]), L, sr_post=": " + s["p1"], weight=600, block=True, trailing=svg("arrow", 14, 2))}
{a_link("#", esc(s["demo"]), L, ext=True, sr_post=" " + s["p1"], block=True)}
{a_link("https://github.com/gaudium1257", esc(s["gh"]), L, ext=True, sr_post=" " + s["p1"], block=True)}
</div>'''
    eyebrow = f'<div style="order: -1; {META}">{esc(s["teamHack"])} · <span style="font-variant-numeric: tabular-nums; white-space: nowrap">{esc(s["period"])}</span></div>'
    title = title_h("h3", s["p1"], detail_href, size_var="--text-h2", track="-0.02em", margin="4px 0", link_extra="display: inline-block; padding: 10px 0; margin: -10px 0" if mobile else "")
    text = (f'<div style="display: flex; flex-direction: column">{title}{eyebrow}'
            + p(s["p1tag"], margin="0")
            + f'<p style="margin: 12px 0 0; {SECOND}; {MUTED}">{esc(s["myRole"])} {esc(s["role"])}</p>'
            + f'<p style="margin: 4px 0 0; {META}">Next.js, Supabase</p>'
            + f'<p style="margin: 8px 0 0; {META}">{live_html(L)}</p>' + rl + "</div>")
    img = plate(L, 350, 219, marks=False) if mobile else plate(L, 360, 225, marks=False)
    if mobile:
        return f'<article>{text}<div style="margin-top: 16px">{img}</div>{links}</article>'
    return (f'<article style="display: flex; flex-wrap: wrap; column-gap: 32px; row-gap: 16px; align-items: flex-start">'
            f'<div style="flex: 1 1 300px; max-width: 360px; min-width: 220px">{img}</div><div style="flex: 1 1 280px; min-width: 0">{text}{links}</div></article>')

def index_row(L, key, meta, stack, status, rel_html, detail_href, mobile, first=False, tag="h3", tagline=None):
    span = SAMPLE[key]
    """Project row: the whole row is one stretched link; status always sits in the same slot."""
    s = S[L]
    tl = p(tagline or s["oneLine"])
    st = status_html(L, status)
    links = rel_html if isinstance(rel_html, list) else ([rel_html] if rel_html else [])
    rl = (relation_line(L, links, mobile).replace('<p style="', '<p style="position: relative; z-index: 1; ', 1)) if links else ""
    if mobile:
        arrow = f'<span aria-hidden="true" style="flex: none; color: var(--color-subtle)">{svg("arrow")}</span>'
        return (f'<li style="position: relative; display: flex; flex-direction: column; {row_pad(first)}">'
                f'<div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px">{title_h(tag, s[key], detail_href, stretch=True)}{arrow}</div>'
                f'{tl}<p style="margin: 2px 0 0; {META}">{esc(meta)} · {st} · {esc(stack)}</p>{rl}'
                f'<div data-date style="order: -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; {DATE}; margin-bottom: 2px"><span>{esc(s["period"])}</span>{micro_track("p", span, 96)}</div></li>')
    arrow = f'<span aria-hidden="true" style="position: absolute; right: 0; top: {2 if first else 18}px; color: var(--color-subtle)">{svg("arrow")}</span>'
    return (f'<li style="position: relative; display: flex; column-gap: 24px; padding-right: 40px; {row_pad(first)}">'
            f'<div style="flex: 1 1 0; min-width: 0; display: flex; flex-wrap: wrap; column-gap: 24px; row-gap: 4px">'
            f'<div style="flex: 1 1 280px; min-width: 0">{title_h(tag, s[key], detail_href, stretch=True)}{tl}{rl}</div>'
            f'<div style="flex: 0 1 200px; min-width: 0; {META}; line-height: 1.6">{esc(meta)} · {st}<br>{esc(stack)}</div></div>{arrow}'
            f'<div data-date style="order: -1; flex: 0 0 var(--date-col); {DATE}; padding-top: 2px">{esc(s["period"])}{micro_track("p", span, 136).replace('class="gx"', 'class="gx" style="margin-top: 6px"', 1)}</div></li>')

def project_rows(L, mobile, detail_href, home_href, tag, include_p1):
    s = S[L]
    rows = []
    if include_p1:
        rows.append(index_row(L, "p1", s["teamHack"], "Next.js, Supabase", "live",
                              [award_html(L, home_href + "#awards", block=mobile), rel(home_href + "#activities", esc(s["act1"]), L, s["srAct"], mobile, "a")],
                              detail_href, mobile, first=True, tag=tag, tagline=s["p1tag"]))
    # newest first (résumé convention): p3 (started later) before p2
    rows.append(index_row(L, "p3", s["p3meta"], "React, Firebase", s["statusPh"], rel(home_href + "#society", esc(s["socName"]), L, s["srSoc"], mobile, "s"),
                          detail_href, mobile, tag=tag))
    rows.append(index_row(L, "p2", s["p2meta"], "FastAPI, OpenAI API", s["statusPh"], "", detail_href, mobile, first=False, tag=tag))
    return rows

def section(L, sid, idx, content, mobile, view_all=None, legend=None):
    s = S[L]
    lg = section_legend(L, legend, mobile) if legend else ""
    va = ""
    if view_all:
        va = (f'<a href="{view_all}" style="display: inline-flex; align-items: center; gap: 4px; min-height: 44px; {"" if mobile else "margin-top: 8px; "}'
              f'font-size: var(--text-secondary); font-weight: 500; letter-spacing: 0; color: var(--color-primary); text-decoration: none">{esc(s["viewAll"])}'
              f'<span class="sr-only">{esc(s["viewAllSr"])}</span>{svg("arrow", 14, 2)}</a>')
    h = f'<h2 id="h-{sid}" style="{H2}">{esc(s["nav"][idx])}</h2>'
    if mobile:
        head = (f'<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; margin-bottom: 8px">'
                f'<div style="display: flex; align-items: center; gap: 12px; min-width: 0">{h}{lg}</div>{va}</div>')
        return f'<section id="{sid}" aria-labelledby="h-{sid}" style="{RULE}; padding: 24px 0 32px">{head}{content}</section>'
    return (f'<section id="{sid}" aria-labelledby="h-{sid}" style="{RULE}; padding: 40px 0; display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); row-gap: 16px">'
            f'<div data-axis="label" style="flex: 0 0 var(--axis-label); min-width: 0">{h}{lg}{va}</div>'
            f'<div data-axis="content" style="flex: 1 1 560px; min-width: 0">{content}</div></section>')

def home(L, mobile):
    s = S[L]
    detail = board("detail", L, mobile)
    alt_lang = "ko" if L == "en" else "en"
    name = s["name"]
    if mobile:
        hero = (f'<section id="about" aria-labelledby="h-about" style="padding: 24px 0 28px">'
                f'<div style="display: grid; grid-template-columns: 104px minmax(0, 1fr); column-gap: 16px; align-items: end">{photo(L, True)}'
                f'<div style="min-width: 0"><h1 id="h-about" style="margin: 0; font-size: var(--text-display); line-height: 1.2; font-weight: 700; letter-spacing: -0.03em; {col(name)}">{esc(name)}</h1>'
                f'<div{lang_attr(s["nameAlt"], alt_lang)} style="{SECOND}; {MUTED}">{esc(s["nameAlt"])}</div>{roles_list(L, True)}</div></div>'
                f'<p style="margin: 20px 0 0; {BODY}; {col(s["intro"])}">{esc(s["intro"])}</p>{hero_facts(L, True)}{hero_map(L, True)}</section>')
    else:
        hero = (f'<section id="about" aria-labelledby="h-about" style="padding: 64px 0 48px; display: flex; flex-wrap: wrap; align-items: flex-end; column-gap: var(--axis-gap); row-gap: 24px">'
                f'{photo(L, False)}<div data-axis="content" style="flex: 1 1 520px; min-width: 0">'
                f'<div style="display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 16px"><h1 id="h-about" style="margin: 0; font-size: var(--text-display); line-height: 1.15; font-weight: 700; letter-spacing: {"-0.02em" if L == "en" else "-0.03em"}; {col(name)}">{esc(name)}</h1>'
                f'<span{lang_attr(s["nameAlt"], alt_lang)} style="font-size: var(--text-lead); line-height: 1.5; letter-spacing: 0; {MUTED}">{esc(s["nameAlt"])}</span></div>'
                f'{roles_list(L, False)}<p style="margin: 16px 0 0; max-width: 34em; {BODY}; {col(s["intro"])}">{esc(s["intro"])}</p>{hero_facts(L, False)}</div>{hero_map(L, False)}</section>')
    projects = featured(L, mobile, detail) + f'<div style="margin-top: {24 if mobile else 32}px">{ul(project_rows(L, mobile, detail, "", "h3", False))}</div>'
    act = ul([
        ledger_row(title_h("h3", s["act1"]) + p(s["orgRole"]) + relation_line(L, [rel(detail, esc(s["p1"]), L, s["srProj"], mobile, "p"), award_html(L, "#awards", block=mobile)], mobile), esc(s["date"]), first=True, mobile=mobile, track=("a", SAMPLE["act1"])),
        ledger_row(title_h("h3", s["actName"]) + p(s["orgRole2"]), esc(s["period"]), mobile=mobile, track=("a", SAMPLE["act2"])),
    ])
    awd = ul([
        ledger_row(f'<h3 style="{TITLE}">{award_html(L)}</h3>' + p(s["organizer"]) + relation_line(L, [rel(detail, esc(s["p1"]), L, s["srProj"], mobile, "p"), rel("#activities", esc(s["act1"]), L, s["srAct"], mobile, "a")], mobile), esc(s["date"]), first=True, mobile=mobile, track=("w", SAMPLE["awd1"])),
        ledger_row(title_h("h3", s["awardName"]) + p(s["organizer"]), esc(s["date"]), mobile=mobile, track=("w", SAMPLE["awd2"])),
    ])
    # society: roles hang their dot in the gutter so role text sits on the same axis as every title
    dot_cur = '<span aria-hidden="true" style="position: relative; flex: none; width: 8px; height: 8px; border-radius: 4px; background: var(--color-primary)"></span>'
    dot_prev = '<span aria-hidden="true" style="position: relative; flex: none; width: 8px; height: 8px; box-sizing: border-box; border-radius: 4px; border: 1.5px solid var(--color-muted); background: var(--color-bg)"></span>'
    def role_row(dot, role, period):
        if mobile:
            return (f'<li style="display: flex; flex-direction: column; padding: 4px 0 4px 20px; position: relative">'
                    f'<span style="display: flex; align-items: center; gap: 12px; margin-left: -20px">{dot}<span style="{SECOND}; font-weight: 600; {col(role)}">{esc(role)}</span></span>'
                    f'<span data-date style="order: -1; {DATE}">{esc(period)}</span></li>')
        return (f'<li style="display: flex; flex-wrap: wrap; align-items: center; column-gap: 24px; min-height: 40px">'
                f'<div style="flex: 1 1 280px; min-width: 0; display: flex; align-items: center; gap: 12px; margin-left: -20px">{dot}<span style="{SECOND}; font-weight: 600; {col(role)}">{esc(role)}</span></div>'
                f'<div data-date style="order: -1; flex: 0 0 var(--date-col); {DATE}">{esc(period)}</div></li>')
    line_left = "3.5px" if mobile else "calc(var(--date-col) + 7.5px)"
    roles = (f'<h4 style="margin: 24px 0 8px; {META}; font-weight: 500">{esc(s["roles_h"])}</h4><div style="position: relative">'
             f'<span aria-hidden="true" style="position: absolute; left: {line_left}; top: {"36px" if mobile else "20px"}; bottom: {"16px" if mobile else "20px"}; width: 1px; background: var(--color-line-strong)"></span>'
             f'<ul role="list" style="margin: 0; padding: 0; list-style: none">{role_row(dot_cur, s["curRole"], s["curPeriod"])}{role_row(dot_prev, s["prevRole"], s["period"])}</ul></div>')
    ev_rows = []
    for i in (2, 1, 0):  # newest first
        t = s["evTypes"][i]
        content = title_h("h5", s["evTitles"][i]) + f'<p style="margin: 2px 0 0; {SECOND}; {MUTED}">{esc(s["evRole"])} <span style="font-weight: 500">{esc(s["role"])}</span></p>'
        if mobile:
            ev_rows.append(ledger_row(content, f'{esc(s["date"])} · <span style="font-weight: 500; {col(t)}">{esc(t)}</span>', mobile=True, track=("s", SAMPLE["ev"][i])))
        else:
            ev_rows.append(ledger_row(content, esc(s["date"]), extra_date=f'<span style="display: block; font-weight: 500; {col(t)}">{esc(t)}</span>', track=("s", SAMPLE["ev"][i])))
    soc = (title_h("h3", s["socName"]) + f'<p style="margin: 2px 0 0; max-width: 40em; {SECOND}; color: var(--color-ink-2)">{esc(s["socDesc"])}</p>'
           + relation_line(L, [rel(detail, esc(s["p3"]), L, s["srProj"], mobile, "p")], mobile) + role_band(L, mobile)
           + f'<h4 style="margin: 24px 0 8px; {META}; font-weight: 500">{esc(s["events_h"])}</h4>' + ul(ev_rows))
    # skills: desktop = 3-column grid per category; mobile = one row per tech (name left, project right)
    sk_rows = []
    for n, (ci, items) in enumerate(SKILLS):
        if mobile:
            lis = "".join(
                f'<li style="display: flex; align-items: center; justify-content: space-between; column-gap: 12px; min-height: 44px; {"" if j == 0 else RULE}">'
                f'<span style="{SECOND}; font-weight: 500; color: var(--color-ink)">{t}</span>'
                f'<a href="{detail}" style="display: inline-flex; align-items: center; min-height: 44px; text-align: right; {META}; {LINK}">{esc(s[k])}</a></li>'
                for j, (t, k) in enumerate(items))
            sk_rows.append(f'<li style="{row_pad(n == 0)}"><h3 style="margin: 0; {META}; font-weight: 500">{esc(s["skillCats"][ci])}</h3><ul role="list" style="margin: 0; padding: 0; list-style: none">{lis}</ul></li>')
        else:
            lis = "".join(
                f'<li style="min-width: 0"><div style="{SECOND}; font-weight: 500; color: var(--color-ink)">{t}</div>'
                f'<a href="{detail}" style="display: inline-flex; align-items: center; min-height: 28px; {META}; {LINK}">{esc(s[k])}</a></li>'
                for t, k in items)
            items_ul = f'<ul role="list" style="flex: 1 1 320px; min-width: 0; margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); column-gap: 16px; row-gap: 8px">{lis}</ul>'
            sk_rows.append(f'<li style="display: flex; flex-wrap: wrap; column-gap: 24px; row-gap: 8px; {row_pad(n == 0)}"><h3 style="flex: 0 0 var(--date-col); margin: 0; padding-top: 2px; {META}; font-weight: 500">{esc(s["skillCats"][ci])}</h3>{items_ul}</li>')
    skills = ul(sk_rows) if mobile else skills_matrix(L, detail)
    edu = ul([ledger_row(title_h("h3", s["school"]) + p(s["majorDeg"]), esc(s["eduPeriod"]), first=True, mobile=mobile)])
    lab = "var(--fact-label)" if mobile else "var(--date-col)"
    def crow(label, value, button=""):
        return (f'<div style="display: flex; align-items: center; column-gap: {8 if mobile else 24}px; min-height: 52px; {RULE}"><dt style="flex: 0 0 {lab}; {META}; font-weight: 500">{esc(label)}</dt>'
                f'<dd style="margin: 0; min-width: 0; flex: 1 1 auto; display: flex; align-items: center; flex-wrap: wrap; column-gap: 12px; {SECOND}; font-weight: 500">{value}{button}</dd></div>')
    contact = (f'<p style="margin: 0 0 16px; {SECOND}; {col(s["contactIntro"])}">{esc(s["contactIntro"])}</p><dl style="margin: 0">'
               + crow("GitHub", a_link("https://github.com/gaudium1257", esc(s["vGh"]), L, ext=True, block=True, extra="overflow-wrap: anywhere"))
               + crow(s["fMail"], a_link("mailto:", esc(s["vMail"]), L, block=True, extra="overflow-wrap: anywhere"), copy_btn(s["copyMail"], L))
               + crow("Instagram", a_link("https://www.instagram.com/", esc(s["igHandle"]), L, ext=True, block=True))
               + crow("Discord", f'<span style="display: inline-flex; align-items: center; min-height: 44px; {MUTED}">{esc(s["discord"])}</span>', copy_btn(s["copyDiscord"], L))
               + "</dl>")
    body_sections = (hero
        + section(L, "projects", 1, projects, mobile, view_all=board("list", L, mobile), legend="p")
        + section(L, "activities", 2, act, mobile, legend="a")
        + section(L, "awards", 3, awd, mobile, legend="w")
        + section(L, "society", 4, soc, mobile, legend="s")
        + section(L, "skills", 5, skills, mobile, legend="k")
        + section(L, "education", 6, edu, mobile)
        + section(L, "connect", 7, contact, mobile))
    hdr = header_mobile(L, "home", 0, home_href="") if mobile else header_desktop(L, "home", 0, home_href="")
    return f'{hdr}\n{main_open(mobile)}{body_sections}</main>\n{footer(L, mobile, contact_links=False)}\n<div role="status" aria-live="polite" class="sr-only"></div>'

def footer(L, mobile, contact_links):
    s = S[L]
    right = ""
    if contact_links:
        right = (f'<div style="display: flex; flex-wrap: wrap; column-gap: 20px">'
                 + a_link("mailto:", esc(s["vMail"]), L, block=True, extra="overflow-wrap: anywhere")
                 + a_link("https://github.com/gaudium1257", esc(s["gh"]), L, ext=True, block=True) + "</div>")
    inner_style = "padding: 24px var(--gutter) 32px; flex-direction: column; align-items: flex-start !important" if mobile else "width: 100%; max-width: var(--container); margin: 0 auto; padding: 24px var(--gutter) 40px; box-sizing: border-box"
    return (f'<footer style="{RULE}"><div style="{inner_style}; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; column-gap: 24px; row-gap: 8px">'
            f'<p style="margin: 0; {META}">{esc(s["footer"])}</p>{right}</div></footer>')

# --------------------------------------------------------------------------- detail page
def detail(L, mobile):
    s = S[L]
    home_href = board("home", L, mobile)
    list_href = board("list", L, mobile)
    self_href = board("detail", L, mobile)
    ext_links = "".join(a_link("#", esc(t), L, ext=True, weight=600, block=True, sr_post=" " + s["p1"]) for t in (s["demo"], s["gh"], s["slides"]))
    deploy = (f'<span style="white-space: nowrap">{live_html(L).replace("font-weight: 500", "font-weight: 600")}<span style="{MUTED}; font-weight: 500">&nbsp;·</span></span> '
              f'<span style="{MUTED}; font-weight: 500; white-space: nowrap">{esc(s["vPlatform"])}</span>')
    n_part, role_part = s["vTeam"].split(" · ")
    cells = [(s["fPeriod"], f'<span style="{col(s["vPeriod"])}; font-variant-numeric: tabular-nums">{esc(s["vPeriod"])}</span>'),
             (s["fTeam"], f'<span style="{col(s["vTeam"])}"><span style="white-space: nowrap">{esc(n_part)}&nbsp;·</span> <span style="white-space: nowrap">{esc(role_part)}</span></span>'),
             (s["fStatus"], esc(s["vStatus"])), (s["fDeploy"], deploy)]
    if mobile:
        facts = '<dl style="margin: 24px 0 0">' + "".join(
            f'<div style="display: flex; align-items: center; column-gap: 8px; min-height: 44px; {RULE}"><dt style="flex: 0 0 var(--fact-label); {META}; font-weight: 500">{esc(k)}</dt>'
            f'<dd style="margin: 0; min-width: 0; {SECOND}; font-weight: 600">{v}</dd></div>' for k, v in cells) + "</dl>"
    else:
        facts = (f'<dl style="margin: 32px 0 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); {RULE}; border-bottom: 1px solid var(--color-line)">' + "".join(
            f'<div style="padding: 16px 24px{" 16px 0" if i == 0 else ""};{"" if i == 0 else " border-left: 1px solid var(--color-line);"}"><dt style="{META}; font-weight: 500">{esc(k)}</dt>'
            f'<dd style="margin: 4px 0 0; {SECOND}; font-weight: 600">{v}</dd></div>' for i, (k, v) in enumerate(cells)) + "</dl>")
    back = (f'<a href="{list_href}" style="display: inline-flex; align-items: center; gap: 6px; min-height: 44px; {"margin: -12px 0 0; " if not mobile else ""}'
            f'font-size: var(--text-secondary); font-weight: 500; letter-spacing: 0; {MUTED}; text-decoration: none">{svg("back")}{esc(s["back"])}</a>')
    meta = f'<p style="order: -1; margin: 0; {META}">{esc(s["teamHack"])} · {award_html(L, home_href + "#awards", hit=mobile)}</p>'
    head_content = (f'<div style="display: flex; flex-direction: column">'
                    + f'<h1 style="margin: 8px 0 12px; font-size: var(--text-display-2); line-height: 1.2; font-weight: 700; letter-spacing: {"-0.02em" if L == "en" else "-0.03em"}">{esc(s["p1"])}</h1>' + meta
                    + f'<p style="margin: 0; max-width: 40em; font-size: var(--text-lead); line-height: 1.6; letter-spacing: -0.01em; color: var(--color-ink-2)">{esc(s["p1tag"])}</p></div>'
                    + f'<div style="display: flex; flex-wrap: wrap; column-gap: 24px; margin-top: {12 if mobile else 20}px">{ext_links}</div>' + facts)
    if mobile:
        top = f'<div style="padding: 16px 0 32px">{back}<div style="margin-top: 8px">{plate(L, 350, 136)}</div><div style="margin-top: 16px">{head_content}</div></div>'
    else:
        top = (f'<div style="padding: 56px 0 40px; display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); row-gap: 16px">'
               f'<div data-axis="label" style="flex: 0 0 var(--axis-label); min-width: 0">{back}<div style="margin-top: 24px; width: var(--axis-label)">{plate(L, 216, 135)}</div></div>'
               f'<div data-axis="content" style="flex: 1 1 560px; min-width: 0">{head_content}</div></div>')
    TEXT_CAP = "max-width: 40em"
    def dsec(i, content, note=""):
        sid = TOC_IDS[i]
        heading = "Challenges & solutions" if (i == 5 and L == "en") else s["toc"][i]
        h = f'<h2 id="h-{sid}" style="{H2}">{esc(heading)}</h2>'
        n = f'<p style="margin: 4px 0 0; {META}">{esc(note)}</p>' if note else ""
        if mobile:
            return f'<section id="{sid}" aria-labelledby="h-{sid}" style="{RULE}; padding: 24px 0 32px"><div style="margin-bottom: 12px">{h}{n}</div>{content}</section>'
        return (f'<section id="{sid}" aria-labelledby="h-{sid}" style="{RULE}; padding: 40px 0; display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); row-gap: 12px">'
                f'<div data-axis="label" style="flex: 0 0 var(--axis-label); min-width: 0">{h}{n}</div><div data-axis="content" style="flex: 1 1 560px; min-width: 0">{content}</div></section>')
    summary = f'<p style="margin: 0; {TEXT_CAP}; {BODY}; {col(s["summaryPh"])}">{esc(s["summaryPh"])}</p>'
    contrib = (f'<ul role="list" style="margin: 0; padding: 0 0 0 20px; list-style: none; border-left: 2px solid var(--color-primary); {TEXT_CAP}; display: flex; flex-direction: column; gap: 8px">'
               + "".join(f'<li style="{BODY}; {col(c)}">{esc(c)}</li>' for c in s["contrib"]) + "</ul>")
    feat_rows = [f'<li style="{row_pad(i == 0)}">{title_h("h3", t)}{p(s["featDesc"])}</li>' for i, t in enumerate(s["features"])]
    features = (f'<figure style="margin: 0; max-width: 680px">{slot(s["shot"], s["shotAria"])}<figcaption style="margin-top: 8px; {META}">{esc(s["caption"])}</figcaption></figure>'
                f'<div style="margin-top: 24px">{ul(feat_rows)}</div>')
    stack_rows = [
        f'<div style="display: flex; flex-wrap: wrap; align-items: baseline; column-gap: {8 if mobile else 24}px; {row_pad(i == 0)}">'
        f'<dt style="flex: 0 0 {"var(--fact-label)" if mobile else "var(--date-col)"}; {META}; font-weight: 500">{esc(k)}</dt>'
        f'<dd style="margin: 0; display: flex; align-items: center; flex-wrap: wrap; column-gap: 16px; row-gap: 2px; {SECOND}; {col(v)}"><span style="display: inline-block; min-width: 96px">{esc(v)}</span>'
        + ("" if is_ph(v) else f'{usage_strip(v, this="p1")}<span style="{META}">{esc(s["usage"].format(n=3, k=1))}</span>') + '</dd></div>'
        for i, (k, v) in enumerate(s["stackRows"])]
    stack = f'<dl style="margin: 0">{seq(stack_rows)}</dl>'
    pre, mid, post = s["outcome"]
    outcomes = (f'<ul role="list" style="margin: 0; padding: 0 0 0 18px; list-style: square; {TEXT_CAP}; display: flex; flex-direction: column; gap: 8px">'
                f'<li style="{BODY}; list-style: none; position: relative"><svg class="gx" width="8" height="8" viewBox="0 0 8 8" {SVG_A} style="position: absolute; left: -17px; top: 10px"><path d="M4 0l4 4-4 4-4-4z" style="fill: var(--color-award)"></path></svg>{esc(pre)}{a_link(home_href + "#awards", esc(mid), L)}{esc(post)}</li>'
                f'<li style="{BODY}; {MUTED}">{esc(s["outcomePh"])}</li></ul>')
    pairs = [
        f'<li style="{"padding-top: 0" if i == 0 else "padding-top: 24px; " + RULE}; padding-bottom: {PB24}"><dl style="margin: 0; {TEXT_CAP}">'
        f'<dt style="{META}; font-weight: 600; color: var(--color-ink)">{esc(s["problem"])}</dt><dd style="margin: 4px 0 0; {BODY}; {MUTED}">{esc(s["problemPh"])}</dd>'
        f'<dt style="margin-top: 12px; {META}; font-weight: 600; color: var(--color-ink)">{esc(s["solution"])}</dt><dd style="margin: 4px 0 0; {BODY}; {MUTED}">{esc(s["solutionPh"])}</dd></dl></li>'
        for i in range(2)]
    challenges = f'<ol role="list" style="margin: 0; padding: 0; list-style: none">{seq(pairs)}</ol>'
    def rel_row(kind, link_html, first):
        if mobile:
            return (f'<li style="display: flex; align-items: center; column-gap: 8px; padding: 6px 0; {"" if first else RULE}">'
                    f'<span style="flex: 0 0 var(--fact-label); {META}; font-weight: 500">{esc(kind)}</span>'
                    f'<span style="flex: 1 1 0; min-width: 0; display: flex; flex-direction: column"><span data-date style="{DATE}">{esc(s["date"])}</span>{link_html}</span></li>')
        return (f'<li style="display: flex; align-items: center; column-gap: 24px; min-height: 52px; {"" if first else RULE}">'
                f'<span style="flex: 0 0 var(--date-col); {META}; font-weight: 500">{esc(kind)}</span>'
                f'<span style="flex: 1 1 0; min-width: 0">{link_html}</span><span data-date style="{DATE}; margin-left: 16px">{esc(s["date"])}</span></li>')
    related = (f'<ul role="list" style="margin: 0; padding: 0; list-style: none">'
               + rel_row(s["relAward"], award_html(L, home_href + "#awards", block=True, sr=False), True)
               + rel_row(s["relAct"], a_link(home_href + "#activities", esc(s["act1"]), L, block=True, glyph_kind="a"), False) + "</ul>")
    related = context_strip(L) + related
    body = (dsec(0, summary) + dsec(1, contrib, s["contribNote"]) + dsec(2, features) + dsec(3, stack)
            + dsec(4, outcomes) + dsec(5, challenges) + dsec(6, related))
    def pn(label, title, align_right, forward):
        al = "align-items: flex-end; text-align: right; " if align_right else ""
        icon_l = "" if forward else svg("back", 14, 2)
        icon_r = svg("arrow", 14, 2) if forward else ""
        return (f'<a href="{self_href}" style="flex: 1 1 240px; display: flex; flex-direction: column; {al}gap: 2px; padding: 20px 0; text-decoration: none; color: var(--color-ink)">'
                f'<span style="display: inline-flex; align-items: center; gap: 6px; {META}">{icon_l}{esc(label)}{icon_r}</span>'
                f'<span style="{TITLE}; color: var(--color-primary)">{esc(title)}</span></a>')
    if mobile:
        prevnext = (f'<nav aria-label="{esc(s["otherProjects"])}" style="{RULE}">{pn(s["prev"], s["p3"], False, False)}'
                    f'<div style="{RULE}"></div>{pn(s["next"], s["p2"], False, True)}</nav>')
    else:
        prevnext = (f'<div style="display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); {RULE}"><div style="flex: 0 0 var(--axis-label)"></div>'
                    f'<nav aria-label="{esc(s["otherProjects"])}" style="flex: 1 1 560px; min-width: 0; display: flex; flex-wrap: wrap; column-gap: 24px">'
                    f'{pn(s["prev"], s["p3"], False, False)}<span aria-hidden="true" style="width: 1px; background: var(--color-line)"></span>{pn(s["next"], s["p2"], True, True)}</nav></div>')
    hdr = (header_mobile(L, "detail", 1, home_href=home_href, toc_active=0) if mobile else header_desktop(L, "detail", 1, home_href=home_href, toc_active=0))
    return f'{hdr}\n{main_open(mobile)}{top}{body}{prevnext}</main>\n{footer(L, mobile, contact_links=True)}'

# --------------------------------------------------------------------------- list page
def listing(L, mobile):
    s = S[L]
    home_href = board("home", L, mobile)
    rows = project_rows(L, mobile, board("detail", L, mobile), home_href, "h2", True)
    back = (f'<a href="{home_href}" style="display: inline-flex; align-items: center; gap: 6px; min-height: 44px; {"" if mobile else "margin: -12px 0 0; "}'
            f'font-size: var(--text-secondary); font-weight: 500; letter-spacing: 0; {MUTED}; text-decoration: none">{svg("back")}{esc(s["home"])}</a>')
    h1 = (f'<h1 style="margin: 0; font-size: var(--text-display-2); line-height: 1.2; font-weight: 700; letter-spacing: {"-0.02em" if L == "en" else "-0.03em"}">{esc(s["listTitle"])}</h1>'
          f'<p style="margin: 8px 0 0; {META}">{esc(s["listCount"])}</p>')
    if mobile:
        content = (f'<div style="padding: 16px 0 24px">{back}<div style="margin-top: 8px">{h1}</div></div>'
                   f'<div style="{RULE}; padding: 24px 0 32px">{list_scale(L, True)}{ul(rows)}</div>')
        hdr = header_mobile(L, "list", 1, home_href=home_href)
    else:
        content = (f'<div style="padding: 56px 0 32px; display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); row-gap: 16px">'
                   f'<div data-axis="label" style="flex: 0 0 var(--axis-label); min-width: 0">{back}</div>'
                   f'<div data-axis="content" style="flex: 1 1 560px; min-width: 0">{h1}</div></div>'
                   f'<div style="display: flex; flex-wrap: wrap; column-gap: var(--axis-gap); {RULE}; padding: 32px 0 40px"><div style="flex: 0 0 var(--axis-label)"></div>'
                   f'<div data-axis="content" style="flex: 1 1 560px; min-width: 0">{list_scale(L, False)}{ul(rows)}</div></div>')
        hdr = header_desktop(L, "list", 1, home_href=home_href)
    return f'{hdr}\n{main_open(mobile)}{content}</main>\n{footer(L, mobile, contact_links=True)}'

# --------------------------------------------------------------------------- write
BOARDS = [  # (kind, lang, mobile)
    ("home", "ko", False), ("home", "en", False), ("home", "ko", True), ("home", "en", True),
    ("detail", "ko", False), ("detail", "en", False), ("detail", "ko", True), ("detail", "en", True),
    ("list", "ko", False), ("list", "en", False), ("list", "ko", True), ("list", "en", True),
]

def build(kind, L, mobile, h):
    s = S[L]
    if kind == "home":
        return page(L, s["title_home"], home(L, mobile), 390 if mobile else 1440, h, mobile=mobile, scroll_pad=56 if mobile else 80)
    if kind == "detail":
        return page(L, s["title_detail"], detail(L, mobile), 390 if mobile else 1440, h, mobile=mobile, scroll_pad=100 if mobile else 124)
    return page(L, s["title_list"], listing(L, mobile), 390 if mobile else 1440, h, mobile=mobile, scroll_pad=56 if mobile else 80)

if __name__ == "__main__":
    import json
    heights = {}
    hp = os.path.join(os.path.dirname(os.path.abspath(__file__)), "heights.json")
    if os.path.exists(hp):
        heights = json.load(open(hp))
    for kind, L, mobile in BOARDS:
        name = board(kind, L, mobile)
        with open(os.path.join(OUT, name), "w") as f:
            f.write(build(kind, L, mobile, heights.get(name, 3000)))
    print("wrote", len(BOARDS), "boards")
