import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

/**
 * 이미지 업로드 (EP-0007). **개발 서버에서만 돈다** (ADR-0003).
 *
 * 파일 이름과 내용이 브라우저에서 온다 — 둘 다 믿지 않는다:
 *  - 확장자는 allowlist 로만 받는다. 이름에 적힌 걸 그대로 쓰지 않는다
 *  - 저장 이름은 **우리가 새로 만든다.** `../` 든 한글이든 원본 이름은 경로에 안 쓴다
 *  - 크기 상한을 넘으면 거부한다. git 저장소는 이력을 지우지 않는다
 *
 * 영상은 받지 않는다 — 저장소가 영구히 무거워지고 GitHub 한도에 걸린다.
 * 영상은 유튜브 링크로 넣는다 (EP-0007).
 */

/** 확장자 → MIME. 여기 없는 형식은 받지 않는다 */
const ALLOWED: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

/** 이미지 한 장의 상한. 넘으면 줄여서 올리라고 안내한다 */
export const MAX_UPLOAD_BYTES = 5_000_000;

/** 공개 사이트에서의 경로. viewer 가 content/assets 를 여기로 서빙한다 */
export const PUBLIC_PREFIX = '/uploads';
const ASSET_DIR = ['content', 'assets'];

export interface UploadRequest {
  /** 원본 파일 이름. **확장자만** 쓴다 */
  filename: string;
  /** base64 (data URL 접두사 없이) */
  data: string;
}

export type UploadResult =
  { ok: true; url: string; bytes: number } | { ok: false; status: number; error: string };

function extensionOf(filename: string): string | null {
  const ext = filename.toLowerCase().split('.').pop();
  return ext && ext in ALLOWED ? ext : null;
}

/**
 * 저장 이름을 **우리가 만든다.** 원본 이름은 쓰지 않는다 —
 * 경로 탈출도, 인코딩 문제도, 이름 충돌도 여기서 한 번에 사라진다.
 */
function safeName(ext: string): string {
  const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}.${ext}`;
}

export function handleUpload(repoRoot: string, req: unknown): UploadResult {
  if (typeof req !== 'object' || req === null) {
    return { ok: false, status: 400, error: '요청 형식이 올바르지 않습니다.' };
  }
  const { filename, data } = req as Partial<UploadRequest>;
  if (typeof filename !== 'string' || typeof data !== 'string') {
    return { ok: false, status: 400, error: '파일 이름과 내용이 필요합니다.' };
  }

  const ext = extensionOf(filename);
  if (!ext) {
    return {
      ok: false,
      status: 415,
      error: `받지 않는 형식입니다. ${Object.keys(ALLOWED).join(', ')} 만 올릴 수 있습니다.`,
    };
  }

  let bytes: Buffer;
  try {
    bytes = Buffer.from(data, 'base64');
  } catch {
    return { ok: false, status: 400, error: '파일을 읽지 못했습니다.' };
  }
  if (bytes.byteLength === 0) {
    return { ok: false, status: 400, error: '빈 파일입니다.' };
  }
  if (bytes.byteLength > MAX_UPLOAD_BYTES) {
    const mb = (MAX_UPLOAD_BYTES / 1_000_000).toFixed(0);
    return { ok: false, status: 413, error: `이미지는 ${mb}MB 까지 올릴 수 있습니다.` };
  }

  const dir = resolve(repoRoot, ...ASSET_DIR);
  const name = safeName(ext);
  const target = resolve(dir, name);

  // 이름을 우리가 만들었어도 한 번 더 확인한다 — 방어는 겹칠수록 좋다
  if (!target.startsWith(dir + sep)) {
    return { ok: false, status: 400, error: '잘못된 경로입니다.' };
  }

  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(target, bytes);

  return { ok: true, url: `${PUBLIC_PREFIX}/${name}`, bytes: bytes.byteLength };
}
