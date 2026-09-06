#!/usr/bin/env node
/**
 * 검증 러너 — CLAUDE.md §5 의 4단계.
 * 원칙: 실행할 수 없는 단계를 '통과'로 위장하지 않는다. 건너뛴 것은 건너뛰었다고 말한다.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';

const hasSource = ['viewer/src', 'admin/src', 'shared'].some(
  (d) => existsSync(d) && readdirSync(d).length > 0,
);
const hasDeps = existsSync('node_modules');

// Node 20+ 는 보안상 .cmd 를 shell 없이 실행하지 못한다. 명령을 문자열로 만들어 shell 에 넘긴다.
const node = JSON.stringify(process.execPath);

const steps = [
  {
    name: 'typecheck',
    command: 'npm run --silent typecheck',
    skip: !hasSource || !hasDeps,
    why: !hasDeps ? 'node_modules 없음 (npm install 필요)' : '검사할 소스 없음',
    guards: 'INV-3, INV-4',
  },
  {
    name: 'lint',
    command: 'npm run --silent lint',
    skip: !hasSource || !hasDeps,
    why: !hasDeps ? 'node_modules 없음' : '검사할 소스 없음',
    guards: 'INV-4, INV-5, 포맷',
  },
  {
    name: 'lint:arch',
    command: `${node} tools/lint/check-architecture.mjs`,
    skip: false,
    guards: 'INV-1, 2, 5, 8, 9',
  },
  {
    name: 'lint:docs',
    command: `${node} tools/lint/check-docs.mjs`,
    skip: false,
    guards: 'INV-10, 11, CB-2',
  },
  {
    name: 'build',
    command: 'npm run --silent build',
    skip: !hasSource || !hasDeps,
    why: !hasDeps ? 'node_modules 없음' : '빌드할 소스 없음',
    guards: '실제로 번들이 되는가',
  },
  {
    name: 'test',
    command: 'npm run --silent test',
    skip: !hasSource || !hasDeps,
    why: !hasDeps ? 'node_modules 없음' : '테스트 대상 없음',
    guards: '동작 회귀',
  },
];

const results = [];
let failed = false;

for (const step of steps) {
  if (step.skip) {
    results.push(['SKIP', step.name, step.why]);
    continue;
  }
  process.stdout.write(`\n── ${step.name} (${step.guards}) ──\n`);
  const r = spawnSync(step.command, { stdio: 'inherit', shell: true });

  // 원인을 감추지 않는다: 실행 자체가 실패한 경우와 검사가 실패한 경우를 구분한다 (GR-4)
  if (r.error) {
    results.push(['FAIL', step.name, `실행 불가: ${r.error.message}`]);
    failed = true;
    break;
  }
  if (r.status !== 0) {
    const note =
      r.status === null ? `신호로 종료됨 (${r.signal ?? '알 수 없음'})` : `exit ${r.status}`;
    results.push(['FAIL', step.name, note]);
    failed = true;
    break; // 첫 실패에서 멈춘다 — 고칠 것이 하나일 때 집중이 쉽다
  }
  results.push(['PASS', step.name, '']);
}

console.log('\n' + '='.repeat(56));
for (const [status, name, note] of results) {
  console.log(`  ${status.padEnd(5)} ${name.padEnd(12)} ${note}`);
}
console.log('='.repeat(56));

const skipped = results.filter((r) => r[0] === 'SKIP').length;
if (failed) {
  console.error(
    '\n검증 실패. 우회하지 말고 고쳐라 — as any / eslint-disable / 테스트 삭제 금지 (INV-4).',
  );
  console.error('규칙 근거: CLAUDE.md §3 · 스킬: /verify');
  process.exit(1);
}
if (skipped) {
  console.log(
    `\n${skipped}개 단계를 건너뛰었다. 이것은 완전한 검증이 아니다.\n` +
      `→ docs/exec-plans/active/0001-bootstrap-scaffold.md`,
  );
} else {
  console.log('\n전체 검증 통과.');
}
