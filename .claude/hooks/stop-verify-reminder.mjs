#!/usr/bin/env node
// Stop — 소스를 고쳤는데 검증 없이 끝내려 하면 한 번 멈춰 세운다.
// 무한 루프 방지: stop_hook_active 이면 통과시킨다.
import { readInput, getState, setState, block, ok } from './_lib.mjs';

const input = await readInput();
if (input.stop_hook_active) ok();

const lastEdit = Number(getState('last-source-edit') || 0);
if (!lastEdit) ok();

const lastVerify = Number(getState('last-verify') || 0);
if (lastVerify >= lastEdit) ok();

// 같은 편집에 대해 두 번 잔소리하지 않는다
const nagged = Number(getState('last-nag') || 0);
if (nagged >= lastEdit) ok();
setState('last-nag', lastEdit);

block(
  '소스 파일을 수정했지만 검증을 통과시키지 않았다.\n' +
    '  1) `npm run verify` (타입·린트·아키텍처·문서·테스트)\n' +
    '  2) UI 를 바꿨다면 `/ui-verify` — 콘솔 에러·양쪽 테마·모바일·키보드\n' +
    '  3) 마무리 전 `/self-review`\n' +
    '검증할 수 없는 상태(스캐폴드 이전 등)라면, 그 사실을 사용자에게 명시하고 끝내라.',
);
