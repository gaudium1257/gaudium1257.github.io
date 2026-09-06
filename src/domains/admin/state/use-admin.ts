import { useCallback, useState } from 'react';
import { useSession } from '@/shared/providers/session';
import type { ContentKind } from '@/shared/content';
import { CONTENT_PATHS } from '../config/repo';
import { GitHubError, commitFile, readFile, verifyIdentity } from '../data/github';
import { commitMessage, prepareContent } from '../service/publish';

/** 인증 시도의 결과를 화면이 구분해서 보여줄 수 있게 상태로 남긴다 (GR-4). */
export type AuthState =
  { status: 'idle' } | { status: 'checking' } | { status: 'error'; message: string };

export function useAdminAuth() {
  const { signIn, signOut, login } = useSession();
  const [state, setState] = useState<AuthState>({ status: 'idle' });

  const authenticate = useCallback(
    async (token: string) => {
      setState({ status: 'checking' });
      try {
        const identity = await verifyIdentity(token);
        if (!identity.canWrite) {
          setState({
            status: 'error',
            message: '이 토큰에는 저장소 쓰기 권한이 없습니다. contents: read/write 로 발급하세요.',
          });
          return false;
        }
        signIn(token, identity.login);
        setState({ status: 'idle' });
        return true;
      } catch (error) {
        const message = error instanceof GitHubError ? error.message : '인증에 실패했습니다.';
        setState({ status: 'error', message });
        return false;
      }
    },
    [signIn],
  );

  return { state, authenticate, signOut, login };
}

export type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'invalid'; issues: string[] }
  | { status: 'error'; message: string }
  | { status: 'saved' };

export function useContentEditor() {
  const { token } = useSession();
  const [state, setState] = useState<SaveState>({ status: 'idle' });

  const load = useCallback(
    async (kind: ContentKind, id: string) => {
      if (!token) return null;
      const path = kind === 'profile' ? CONTENT_PATHS.profile() : CONTENT_PATHS[kind](id);
      return readFile(token, path);
    },
    [token],
  );

  const save = useCallback(
    async (kind: ContentKind, id: string, input: unknown, sha: string | null) => {
      if (!token) {
        setState({ status: 'error', message: '세션이 만료되었습니다. 다시 인증하세요.' });
        return null;
      }

      // 검증이 먼저다. 통과하지 못한 값은 커밋하지 않는다 (INV-3)
      const prepared = prepareContent(kind, input);
      if (!prepared.ok) {
        setState({ status: 'invalid', issues: prepared.issues });
        return null;
      }

      setState({ status: 'saving' });
      const path = kind === 'profile' ? CONTENT_PATHS.profile() : CONTENT_PATHS[kind](id);
      try {
        const nextSha = await commitFile(
          token,
          path,
          prepared.json,
          commitMessage(kind, id, sha === null),
          sha,
        );
        setState({ status: 'saved' });
        return nextSha;
      } catch (error) {
        const message = error instanceof GitHubError ? error.message : '저장에 실패했습니다.';
        setState({ status: 'error', message });
        return null;
      }
    },
    [token],
  );

  return { state, load, save };
}
