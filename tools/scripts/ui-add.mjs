#!/usr/bin/env node
/**
 * shadcn 컴포넌트 추가 — 이것이 유일한 사용 경로다 (INV-6, docs/DESIGN.md).
 *
 * 왜 스크립트인가:
 *  1. npm 은 추가 인자를 스크립트 문자열 **끝**에 붙인다. `a && b` 형태로 쓰면
 *     컴포넌트 이름이 b 에 붙어 엉뚱한 곳으로 간다 (실제로 깨져 있었다)
 *  2. shadcn 은 로컬 의존성이 아니라 npx 로 받아 써야 한다.
 *     components.json 이 리포 루트에 있으므로 --cwd 를 주면 안 된다
 *  3. 생성 직후 import 교정이 항상 뒤따라야 한다 (fix-shadcn-imports 참고)
 */
import { spawnSync } from 'node:child_process';

const components = process.argv.slice(2);
if (components.length === 0) {
  console.error('사용법: npm run ui:add <component> [...]\n예: npm run ui:add textarea label');
  process.exit(1);
}

// stdin 을 막고 N 을 흘려보낸다. shadcn 은 --yes 를 줘도 '이미 있는 파일을 덮을까' 를
// 따로 묻는데, 비대화형 셸에서는 그 프롬프트가 EOF 를 만나 **아무것도 안 쓰고 끝난다**
// (실제로 그렇게 조용히 실패했다). 답을 N 으로 고정하면 기존 생성물을 덮지 않는다 (INV-6).
const run = (command) =>
  spawnSync(command, {
    stdio: ['pipe', 'inherit', 'inherit'],
    input: 'N\n'.repeat(20),
    shell: true,
  });

const added = run(`npx --yes shadcn@latest add ${components.join(' ')} --yes`);
if (added.status !== 0) {
  console.error('\nshadcn add 실패. 컴포넌트 이름을 확인하라.');
  process.exit(added.status ?? 1);
}

// 생성물의 import 는 반드시 교정한다 — 안 하면 무관한 'cn' 패키지가 딸려온다
const fixed = run(`${JSON.stringify(process.execPath)} tools/scripts/fix-shadcn-imports.mjs`);
process.exit(fixed.status ?? 0);
