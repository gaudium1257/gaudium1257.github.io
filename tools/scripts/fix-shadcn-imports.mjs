#!/usr/bin/env node
/**
 * shadcn CLI 생성물의 import 경로를 교정한다.
 *
 * 왜 필요한가: shadcn CLI 가 components.json 의 aliases.utils 를 해석하지 못하고
 * `import { cn } from "cn"` 을 생성하는 경우가 있다. `cn` 은 우리와 무관한 npm 패키지이며,
 * 그대로 두면 불필요한 서드파티 코드가 모든 UI 컴포넌트에 들어온다 (docs/SECURITY.md).
 *
 * 손으로 고치면 INV-6(생성물 불가침)을 깨므로, 교정을 기계화해서 `npm run ui:add` 의
 * 일부로 항상 실행한다. 생성물은 여전히 "손대지 않는 것"이고, 교정은 재현 가능하다 (CB-9).
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const UI_DIR = 'shared/ui/components/ui';
const UTILS = '@ui/lib/utils';

const REWRITES = [
  [/from ["']cn["']/g, `from "${UTILS}"`],
  [/from ["']@\/lib\/utils["']/g, `from "${UTILS}"`],
];

if (!existsSync(UI_DIR)) {
  console.log(`fix-shadcn-imports: ${UI_DIR} 없음 — 건너뜀`);
  process.exit(0);
}

const changed = [];
for (const file of readdirSync(UI_DIR).filter((f) => /\.tsx?$/.test(f))) {
  const path = join(UI_DIR, file);
  const before = readFileSync(path, 'utf8');
  let after = before;
  for (const [re, to] of REWRITES) after = after.replace(re, to);
  if (after !== before) {
    writeFileSync(path, after);
    changed.push(file);
  }
}

console.log(
  changed.length
    ? `fix-shadcn-imports: ${changed.length}개 파일 교정 — ${changed.join(', ')}`
    : 'fix-shadcn-imports: 교정할 것 없음',
);
