import { z } from 'zod';

/**
 * 이미지 업로드 경계 (EP-0007). 응답을 추측하지 않고 파싱한다 (INV-3).
 */

const okSchema = z.object({ ok: z.literal(true), url: z.string(), bytes: z.number() });
const errorSchema = z.object({ error: z.string() });

export type UploadOutcome = { ok: true; url: string } | { ok: false; message: string };

/** 파일 → base64. data URL 접두사는 서버가 기대하지 않으므로 떼어낸다 */
function toBase64(file: File): Promise<string> {
  return new Promise((resolveBody, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      resolveBody(result.slice(result.indexOf(',') + 1));
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File): Promise<UploadOutcome> {
  let data: string;
  try {
    data = await toBase64(file);
  } catch {
    return { ok: false, message: '파일을 읽지 못했습니다.' };
  }

  let body: unknown;
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, data }),
    });
    body = await res.json();
  } catch {
    return { ok: false, message: '개발 서버에 연결할 수 없습니다.' };
  }

  const ok = okSchema.safeParse(body);
  if (ok.success) return { ok: true, url: ok.data.url };

  const failed = errorSchema.safeParse(body);
  return { ok: false, message: failed.success ? failed.data.error : '업로드에 실패했습니다.' };
}
