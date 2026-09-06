import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/**
 * 관리자 세션 — 토큰 보관만 담당한다. 권한 판정은 여기가 아니라 GitHub 이 한다 (ADR-0004).
 *
 * 보관 규칙 (docs/SECURITY.md §3):
 *  - 기본은 sessionStorage. 탭을 닫으면 사라진다
 *  - 토큰을 로그·URL·에러 메시지에 넣지 않는다
 *  - 토큰 값을 화면에 다시 표시하지 않는다
 */

const STORAGE_KEY = 'gh_token';

export interface Session {
  /** 저장된 토큰. 없으면 null. */
  token: string | null;
  /** 인증된 GitHub 로그인 이름. 검증에 성공해야만 채워진다. */
  login: string | null;
  signIn: (token: string, login: string) => void;
  signOut: () => void;
}

const SessionContext = createContext<Session | null>(null);

function readStoredToken(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    // 프라이빗 모드 등에서 접근이 막힐 수 있다. 세션 없음으로 취급한다.
    return null;
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [login, setLogin] = useState<string | null>(null);

  const signIn = useCallback((nextToken: string, nextLogin: string) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, nextToken);
    } catch {
      // 저장에 실패해도 이번 세션 동안은 메모리로 동작시킨다.
    }
    setToken(nextToken);
    setLogin(nextLogin);
  }, []);

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // 이미 접근 불가면 지울 것도 없다.
    }
    setToken(null);
    setLogin(null);
  }, []);

  const value = useMemo<Session>(
    () => ({ token, login, signIn, signOut }),
    [token, login, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession 은 SessionProvider 안에서만 쓸 수 있다');
  return ctx;
}
