#!/usr/bin/env node
/**
 * 문서 린터 — INV-10, INV-11, CB-2 를 기계적으로 강제한다.
 * 에러 메시지에는 반드시 '고치는 법'을 함께 넣는다 (CB-3).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, sep } from 'node:path';

const errors = [];
const warnings = [];

const toPosix = (p) => p.split(sep).join('/');
const read = (p) => readFileSync(p, 'utf8');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

const mdFiles = [...walk('docs'), ...['CLAUDE.md', 'ARCHITECTURE.md'].filter(existsSync)];

// ---------------------------------------------------------------- 1. 링크 무결성
const LINK = /\[([^\]]*)\]\(([^)\s]+)\)/g;
for (const file of mdFiles) {
  for (const m of read(file).matchAll(LINK)) {
    const target = m[2];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    if (!existsSync(resolve(dirname(file), clean))) {
      errors.push(
        `[링크 깨짐] ${toPosix(file)} → "${target}"\n` +
          `  고치는 법: 경로를 고치거나, 대상 문서를 만들거나, 링크를 지워라. ` +
          `틀린 링크는 없는 링크보다 나쁘다.`,
      );
    }
  }
}

// ---------------------------------------------------------------- 2. 색인 누락
function checkIndex(indexPath, dir, { recursive = false, ignore = [] } = {}) {
  if (!existsSync(indexPath) || !existsSync(dir)) return;
  const index = read(indexPath);
  // win32 의 dirname 은 역슬래시를 내므로 반드시 정규화해서 비교한다
  const files = recursive
    ? walk(dir)
    : walk(dir).filter((f) => toPosix(dirname(f)) === toPosix(dir));
  for (const f of files) {
    const base = toPosix(f).split('/').pop();
    if (base === 'index.md' || base === 'README.md' || ignore.includes(base)) continue;
    if (!index.includes(base)) {
      errors.push(
        `[색인 누락] ${toPosix(f)} 가 ${toPosix(indexPath)} 에 없다.\n` +
          `  고치는 법: 색인 표에 한 줄 추가하라. 색인에 없는 문서는 에이전트가 찾지 못한다 (CB-1).`,
      );
    }
  }
}

checkIndex('docs/design-docs/index.md', 'docs/design-docs');
checkIndex('docs/design-docs/adr/index.md', 'docs/design-docs/adr', {
  ignore: ['0000-template.md'],
});
checkIndex('docs/product-specs/index.md', 'docs/product-specs');
checkIndex('docs/exec-plans/index.md', 'docs/exec-plans', {
  recursive: true,
  ignore: ['TEMPLATE.md', 'tech-debt-tracker.md'],
});

// ---------------------------------------------------------------- 3. CLAUDE.md 예산 (CB-2)
if (existsSync('CLAUDE.md')) {
  const n = read('CLAUDE.md').split('\n').length;
  if (n > 200) {
    errors.push(
      `[CB-2 위반] CLAUDE.md 가 ${n}줄이다 (상한 200).\n` +
        `  고치는 법: 넘친 내용을 docs/ 로 옮기고 여기엔 링크만 남겨라. ` +
        `CLAUDE.md 는 지도지 백과사전이 아니다.`,
    );
  } else if (n > 180) {
    warnings.push(`CLAUDE.md 가 ${n}줄이다. 200줄 상한에 근접했다 — 정리를 고려하라.`);
  }
}

// ---------------------------------------------------------------- 4. 생성 문서 표식 (INV-10)
for (const f of walk('docs/generated')) {
  if (f.endsWith('README.md')) continue;
  if (!read(f).includes('GENERATED FILE')) {
    errors.push(
      `[INV-10] ${toPosix(f)} 첫 줄에 생성물 표식이 없다.\n` +
        `  고치는 법: 파일 맨 위에 다음을 넣어라:\n` +
        `  <!-- GENERATED FILE — do not edit. Run: npm run docs:generate -->`,
    );
  }
}

// ---------------------------------------------------------------- 5. 실행 계획 형식·상태
for (const f of walk('docs/exec-plans/active')) {
  const body = read(f);
  const boxes = body.match(/- \[[ x]\]/gi) || [];
  if (boxes.length > 0 && boxes.every((b) => /x/i.test(b))) {
    warnings.push(
      `${toPosix(f)} 의 완료 조건이 모두 체크됐다. ` +
        `잔여 작업을 tech-debt-tracker 로 옮기고 completed/ 로 이동하라 (/exec-plan).`,
    );
  }
  if (!/^-\s+\*\*상태\*\*:/m.test(body)) {
    errors.push(
      `[계획 형식] ${toPosix(f)} 에 상태 줄이 없다.\n` +
        `  고치는 법: docs/exec-plans/TEMPLATE.md 형식을 따르라 (- **상태**: ACTIVE|BLOCKED|DONE).`,
    );
  }
}

// ---------------------------------------------------------------- 6. 참고자료 신선도
for (const f of walk('docs/references')) {
  if (f.endsWith('index.md')) continue;
  const m = read(f).match(/확인(?:\s*날짜)?\s*[:：]\s*(\d{4})-(\d{2})-(\d{2})/);
  if (!m) {
    errors.push(
      `[참고자료] ${toPosix(f)} 에 출처/확인 날짜가 없다.\n` +
        `  고치는 법: 파일 상단에 '출처: <URL>' 과 '확인: YYYY-MM-DD' 를 넣어라.`,
    );
  } else {
    const age = (Date.now() - new Date(`${m[1]}-${m[2]}-${m[3]}`).getTime()) / 86400000;
    if (age > 180) {
      warnings.push(`${toPosix(f)} 확인일이 ${Math.round(age)}일 지났다. /doc-gardening 대상.`);
    }
  }
}

// ---------------------------------------------------------------- 결과
for (const w of warnings) console.log(`  warn: ${w}`);
if (errors.length) {
  console.error(`\nlint:docs 실패 — ${errors.length}건\n`);
  for (const e of errors) console.error(e + '\n');
  process.exit(1);
}
console.log(
  `lint:docs 통과 (문서 ${mdFiles.length}개${warnings.length ? `, 경고 ${warnings.length}건` : ''})`,
);
