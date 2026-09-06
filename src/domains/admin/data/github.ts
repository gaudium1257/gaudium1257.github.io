import { z } from 'zod';
import { REPO_OWNER, REPO_NAME, REPO_BRANCH } from '../config/repo';

/**
 * GitHub 경계 — 이 파일이 관리자 권한의 유일한 출입구다 (INV-11).
 *
 * 여기가 보안 경계인 이유: 앱은 관리자 여부를 판정하지 않는다. 토큰을 GitHub 에 제시하고
 * GitHub 이 거부하면 그것으로 끝이다 (ADR-0004).
 *
 * 토큰 취급 규칙 (docs/SECURITY.md §3): 로그·URL·에러 메시지에 토큰을 넣지 않는다.
 */

const API = 'https://api.github.com';

/** 응답을 추측하지 않고 경계에서 파싱한다 (INV-3, GR-2). */
const viewerSchema = z.object({ login: z.string().min(1) });

const permissionSchema = z.object({
  permissions: z.object({ push: z.boolean() }).optional(),
});

const contentResponseSchema = z.object({
  sha: z.string().min(1),
  content: z.string(),
  encoding: z.literal('base64'),
});

const commitResponseSchema = z.object({
  content: z.object({ sha: z.string().min(1) }),
});

export class GitHubError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'GitHubError';
    this.status = status;
  }
}

function headers(token: string): HeadersInit {
  return {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

/** 실패를 삼키지 않고 원인별로 구분한다 (GR-4, FRONTEND.md). */
async function request(path: string, token: string, init?: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, { ...init, headers: headers(token) });
  } catch {
    throw new GitHubError(0, '네트워크에 연결할 수 없습니다.');
  }

  if (response.status === 401) throw new GitHubError(401, '토큰이 유효하지 않습니다.');
  if (response.status === 403) throw new GitHubError(403, '이 토큰에는 권한이 없습니다.');
  if (response.status === 404) throw new GitHubError(404, '대상을 찾을 수 없습니다.');
  if (response.status === 409) throw new GitHubError(409, '다른 곳에서 먼저 수정되었습니다.');
  if (!response.ok) {
    throw new GitHubError(response.status, `GitHub 요청 실패 (${response.status})`);
  }
  return (await response.json()) as unknown;
}

export interface Identity {
  login: string;
  canWrite: boolean;
}

/**
 * 진짜 인증. 토큰이 이 리포지터리에 쓸 수 있는지 GitHub 에 직접 물어본다.
 * 앱의 판단이 아니라 GitHub 의 응답이 관리자 여부를 정한다.
 */
export async function verifyIdentity(token: string): Promise<Identity> {
  const viewer = viewerSchema.parse(await request('/user', token));
  const repo = permissionSchema.parse(await request(`/repos/${REPO_OWNER}/${REPO_NAME}`, token));
  return { login: viewer.login, canWrite: repo.permissions?.push === true };
}

export interface StoredFile {
  /** 낙관적 잠금용 blob SHA. 커밋할 때 되돌려줘야 덮어쓰기 사고를 막는다. */
  sha: string;
  text: string;
}

/** 파일이 없으면 null. 없는 것과 실패한 것을 구분한다. */
export async function readFile(token: string, path: string): Promise<StoredFile | null> {
  try {
    const raw = await request(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${REPO_BRANCH}`,
      token,
    );
    const parsed = contentResponseSchema.parse(raw);
    const text = new TextDecoder().decode(
      Uint8Array.from(atob(parsed.content.replace(/\n/g, '')), (c) => c.charCodeAt(0)),
    );
    return { sha: parsed.sha, text };
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return null;
    throw error;
  }
}

/** UTF-8 을 깨뜨리지 않는 base64 인코딩 (btoa 는 라틴1만 받는다). */
function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** 파일을 커밋한다. sha 를 넘기면 그 버전 위에서만 성공한다 (충돌 시 409). */
export async function commitFile(
  token: string,
  path: string,
  text: string,
  message: string,
  sha: string | null,
): Promise<string> {
  const body: Record<string, string> = {
    message,
    content: toBase64(text),
    branch: REPO_BRANCH,
  };
  if (sha) body.sha = sha;

  const raw = await request(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return commitResponseSchema.parse(raw).content.sha;
}
