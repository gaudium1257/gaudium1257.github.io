import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { handleUpload, MAX_UPLOAD_BYTES } from './upload-handler';

/**
 * 파일 이름과 내용이 브라우저에서 온다. 둘 다 믿지 않는다는 것을 여기서 못박는다.
 */

let repo: string;
const b64 = (s: string) => Buffer.from(s).toString('base64');
const assets = () => join(repo, 'content', 'assets');

beforeEach(() => {
  repo = mkdtempSync(join(tmpdir(), 'upload-test-'));
});
afterEach(() => {
  rmSync(repo, { recursive: true, force: true });
});

describe('handleUpload', () => {
  it('허용 형식을 저장하고 공개 경로를 준다', () => {
    const result = handleUpload(repo, { filename: 'diagram.png', data: b64('fake-png') });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.url.startsWith('/uploads/')).toBe(true);
    expect(result.url.endsWith('.png')).toBe(true);

    const files = readdirSync(assets());
    expect(files).toHaveLength(1);
    expect(readFileSync(join(assets(), files[0] ?? ''), 'utf8')).toBe('fake-png');
  });

  /** 원본 이름을 그대로 쓰면 경로 탈출이 열린다. 이름은 우리가 만든다 */
  it('원본 파일 이름을 저장 이름으로 쓰지 않는다', () => {
    const result = handleUpload(repo, {
      filename: '../../../../evil.png',
      data: b64('x'),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.url).not.toContain('evil');
    expect(result.url).not.toContain('..');
    expect(existsSync(join(repo, '..', 'evil.png'))).toBe(false);
    expect(readdirSync(assets())).toHaveLength(1);
  });

  it('허용하지 않는 형식은 거부한다', () => {
    for (const name of ['payload.exe', 'video.mp4', 'script.html', 'noext']) {
      const result = handleUpload(repo, { filename: name, data: b64('x') });
      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.status).toBe(415);
    }
    expect(existsSync(assets())).toBe(false);
  });

  it('상한을 넘으면 거부한다 — git 은 이력을 지우지 않는다', () => {
    const tooBig = Buffer.alloc(MAX_UPLOAD_BYTES + 1).toString('base64');
    const result = handleUpload(repo, { filename: 'big.png', data: tooBig });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.status).toBe(413);
    expect(existsSync(assets())).toBe(false);
  });

  it('빈 파일은 거부한다', () => {
    const result = handleUpload(repo, { filename: 'empty.png', data: '' });
    expect(result.ok).toBe(false);
  });

  it('형태가 아닌 요청은 거부한다', () => {
    for (const bad of [null, 'string', {}, { filename: 'a.png' }, { data: 'x' }]) {
      expect(handleUpload(repo, bad).ok).toBe(false);
    }
  });

  it('이름이 겹치지 않는다 — 연속으로 올려도 덮어쓰지 않는다', () => {
    handleUpload(repo, { filename: 'a.png', data: b64('first') });
    handleUpload(repo, { filename: 'a.png', data: b64('second') });
    expect(readdirSync(assets())).toHaveLength(2);
  });
});
