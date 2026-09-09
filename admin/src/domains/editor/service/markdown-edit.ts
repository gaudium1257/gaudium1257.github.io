/**
 * 선택 영역에 마크다운 문법을 씌우는 순수 함수들 (EP-0007).
 *
 * DOM 이 아니라 **문자열과 커서 위치**만 다룬다 — 그래야 브라우저 없이 테스트할 수 있고,
 * 서식 버튼이 늘어나도 검증이 따라온다.
 */

export interface TextRange {
  text: string;
  /** 선택 시작 (커서만 있으면 start === end) */
  start: number;
  end: number;
}

export interface EditResult {
  text: string;
  /** 편집 후 선택 영역. 사용자가 이어서 타이핑할 수 있어야 한다 */
  start: number;
  end: number;
}

/**
 * 선택 영역을 기호로 감싼다. 이미 감싸져 있으면 **벗긴다** —
 * 굵게 버튼을 두 번 누르면 원래대로 돌아가야 상식에 맞는다.
 */
export function toggleWrap(range: TextRange, mark: string): EditResult {
  const { text, start, end } = range;
  const selected = text.slice(start, end);
  const before = text.slice(0, start);
  const after = text.slice(end);

  if (before.endsWith(mark) && after.startsWith(mark)) {
    return {
      text: before.slice(0, -mark.length) + selected + after.slice(mark.length),
      start: start - mark.length,
      end: end - mark.length,
    };
  }

  if (selected.startsWith(mark) && selected.endsWith(mark) && selected.length > mark.length * 2) {
    const inner = selected.slice(mark.length, -mark.length);
    return { text: before + inner + after, start, end: start + inner.length };
  }

  return {
    text: `${before}${mark}${selected}${mark}${after}`,
    start: start + mark.length,
    end: end + mark.length,
  };
}

/** 선택이 걸친 줄들의 시작·끝 인덱스 */
function lineBounds(text: string, start: number, end: number) {
  const from = text.lastIndexOf('\n', start - 1) + 1;
  const nextBreak = text.indexOf('\n', end);
  return { from, to: nextBreak === -1 ? text.length : nextBreak };
}

/**
 * 줄 앞에 접두사를 붙인다 (제목·인용·목록). 이미 붙어 있으면 뗀다.
 * 여러 줄을 선택했으면 **전부** 처리한다 — 한 줄씩 누르게 하면 도구가 아니다.
 */
export function toggleLinePrefix(range: TextRange, prefix: string): EditResult {
  const { text, start, end } = range;
  const { from, to } = lineBounds(text, start, end);
  const block = text.slice(from, to);
  const lines = block.split('\n');

  const allPrefixed = lines.every((line) => line.startsWith(prefix));
  const next = lines
    .map((line) => (allPrefixed ? line.slice(prefix.length) : prefix + line))
    .join('\n');

  return {
    text: text.slice(0, from) + next + text.slice(to),
    start: from,
    end: from + next.length,
  };
}

/**
 * 번호 목록. 접두사가 줄마다 달라 toggleLinePrefix 로는 안 된다.
 * 이미 번호가 붙어 있으면 뗀다.
 */
export function toggleOrderedList(range: TextRange): EditResult {
  const { text, start, end } = range;
  const { from, to } = lineBounds(text, start, end);
  const lines = text.slice(from, to).split('\n');

  const numbered = /^\d+\.\s/;
  const allNumbered = lines.every((line) => numbered.test(line));
  const next = lines
    .map((line, i) => (allNumbered ? line.replace(numbered, '') : `${i + 1}. ${line}`))
    .join('\n');

  return {
    text: text.slice(0, from) + next + text.slice(to),
    start: from,
    end: from + next.length,
  };
}

/**
 * 선택한 글자를 링크 문구로 쓴다. 선택이 없으면 자리표시자를 넣고
 * **주소 자리를 선택 상태로** 돌려준다 — 바로 붙여넣을 수 있게.
 */
export function insertLink(range: TextRange, url = ''): EditResult {
  const { text, start, end } = range;
  const label = text.slice(start, end) || '링크 문구';
  const snippet = `[${label}](${url})`;
  const urlStart = start + label.length + 3;

  return {
    text: text.slice(0, start) + snippet + text.slice(end),
    start: url ? start + snippet.length : urlStart,
    end: url ? start + snippet.length : urlStart + url.length,
  };
}

/** 커서 자리에 그대로 끼워 넣는다 (이미지·구분선처럼 선택과 무관한 것) */
export function insertBlock(range: TextRange, snippet: string): EditResult {
  const { text, start, end } = range;
  const needsBreakBefore = start > 0 && !text.slice(0, start).endsWith('\n');
  const block = `${needsBreakBefore ? '\n\n' : ''}${snippet}\n`;

  return {
    text: text.slice(0, start) + block + text.slice(end),
    start: start + block.length,
    end: start + block.length,
  };
}

/** 이미지 마크다운. 대체 텍스트가 비면 파일 이름을 쓴다 (GR-7 접근성) */
export function imageSnippet(url: string, alt: string): string {
  const fallback =
    url
      .split('/')
      .pop()
      ?.replace(/\.[^.]+$/, '') ?? '이미지';
  return `![${alt || fallback}](${url})`;
}
