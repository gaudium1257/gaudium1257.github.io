#!/usr/bin/env node
// PostToolUse(Bash) — verify 계열 명령이 실제로 실행됐는지 기록한다. stop 훅이 참조한다.
import { readInput, setState, ok } from './_lib.mjs';

const input = await readInput();
const cmd = String((input.tool_input || {}).command || '');
if (/\b(npm|pnpm|yarn)\s+(run\s+)?(verify|test|typecheck|lint)/.test(cmd)) {
  const res = input.tool_response || {};
  // 실패한 검증은 '돌렸다'로 치지 않는다
  const failed =
    res.is_error === true ||
    /\b(FAIL|error TS\d|✖|✗)\b/.test(String(res.stdout || '') + String(res.stderr || ''));
  if (!failed) setState('last-verify', Date.now());
}
ok();
