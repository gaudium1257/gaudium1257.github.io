#!/usr/bin/env node
// SessionStart — 세션 시작 시 '지금 무엇이 열려 있는가'를 컨텍스트에 넣는다. CB-1, CB-4.
// 지도만 준다. 문서 본문을 붙여넣지 않는다 (CB-2 프로그레시브 디스클로저).
import { readdirSync, readFileSync, existsSync } from 'node:fs';

const out = [];
const safeRead = (p) => {
  try {
    return existsSync(p) ? readFileSync(p, 'utf8') : '';
  } catch {
    return '';
  }
};

// 1. 활성 실행 계획
try {
  const dir = 'docs/exec-plans/active';
  const plans = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')) : [];
  if (plans.length) {
    out.push('## 활성 실행 계획');
    for (const f of plans) {
      const body = safeRead(`${dir}/${f}`);
      const title = (body.match(/^#\s+(.+)$/m) || [, f])[1];
      const status = (body.match(/^-\s+\*\*상태\*\*:\s*(.+)$/m) || [, '?'])[1];
      const done = (body.match(/- \[x\]/gi) || []).length;
      const total = (body.match(/- \[[ x]\]/gi) || []).length;
      out.push(`- ${title} — ${status} (${done}/${total} 완료) → \`${dir}/${f}\``);
    }
  } else {
    out.push('## 활성 실행 계획\n- 없음. 다중 단계 작업을 시작한다면 `/exec-plan` 을 먼저 쓴다.');
  }
} catch {
  /* 계획을 못 읽어도 세션은 계속된다 */
}

// 2. 급한 기술 부채 (P0/P1만)
try {
  const debt = safeRead('docs/exec-plans/tech-debt-tracker.md');
  const rows = debt.split('\n').filter((l) => /^\|\s*TD-\d+\s*\|\s*P[01]\s*\|/.test(l));
  if (rows.length) {
    out.push('\n## 미해결 부채 (P0/P1)');
    for (const r of rows) {
      const c = r.split('|').map((s) => s.trim());
      out.push(`- **${c[2]}** ${c[1]}: ${c[3]}`);
    }
    out.push('→ 상세: `docs/exec-plans/tech-debt-tracker.md`');
  }
} catch {
  /* 부채 목록을 못 읽어도 세션은 계속된다 */
}

// 3. 미결정 — 이 위에 큰 구현을 쌓으면 안 된다
try {
  const adr = safeRead('docs/design-docs/adr/index.md');
  const open = adr.split('\n').filter((l) => /\*\*OPEN\*\*|\|\s*OPEN\s*\|/.test(l));
  const specs = safeRead('docs/product-specs/index.md');
  // 상태 칸이 DRAFT 로 '시작'하는 행만. "AGREED (세부는 DRAFT)" 를 미결정으로 오해하지 않는다
  const draft = specs.split('\n').filter((l) => {
    const cells = l.split('|').map((c) => c.trim());
    return cells.length >= 4 && /\.md\)/.test(cells[1]) && /^DRAFT\b/.test(cells[3]);
  });
  if (open.length || draft.length) {
    out.push('\n## 미결정 (이 위에 큰 구현을 쌓지 말 것)');
    for (const l of open) {
      const t = l.match(/\[(\d+)\]\(([^)]+)\)\s*\|\s*([^|]+)\|/);
      if (t) out.push(`- ADR-${t[1]} ${t[3].trim()} → \`docs/design-docs/adr/${t[2]}\``);
    }
    for (const l of draft) {
      const t = l.match(/\[([^\]]+)\]\(([^)]+)\)\s*\|\s*([^|]+)\|/);
      if (t) out.push(`- 스펙 DRAFT: ${t[3].trim()} → \`docs/product-specs/${t[2]}\``);
    }
  }
} catch {
  /* 미결정 목록을 못 읽어도 세션은 계속된다 */
}

out.push(
  '\n---\n지도는 `CLAUDE.md`. 불변식은 협상 불가하며 훅과 린터가 강제한다.\n' +
    '앱이 둘(viewer/admin)이고 스키마는 `shared/content` 하나뿐이다 (INV-9).\n' +
    '코드를 바꿨으면 `/verify`, UI 를 바꿨으면 `/ui-verify`.',
);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: out.join('\n'),
    },
  }),
);
