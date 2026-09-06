import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * 테마 프로바이더 (ADR-0004, 스펙 T-1~T-5).
 *
 * - 기본은 시스템 설정을 따른다 (T-1)
 * - 선택은 localStorage 에 남긴다 (T-3)
 * - **저장소 접근이 막혀도 화면은 정상 동작한다** (T-4) — 프라이빗 모드 등
 * - 색은 토큰이 바꾼다. 컴포넌트에 분기를 넣지 않는다 (docs/DESIGN.md)
 */

const STORAGE_KEY = 'theme';

export type ThemeChoice = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeState {
  /** 사용자가 고른 값 */
  choice: ThemeChoice;
  /** 실제로 적용 중인 값 (system 을 해석한 결과) */
  resolved: ResolvedTheme;
  setChoice: (next: ThemeChoice) => void;
  /** 배너 토글용 — light ↔ dark 를 오간다 (T-2) */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeState | null>(null);

function readStoredChoice(): ThemeChoice {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
  } catch {
    // 저장소 접근 불가 — 시스템 기본값으로 동작한다 (T-4)
  }
  return 'system';
}

function systemTheme(): ResolvedTheme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readStoredChoice);
  const [systemValue, setSystemValue] = useState<ResolvedTheme>(systemTheme);

  // system 을 고른 동안에는 OS 설정 변화를 따라간다
  useEffect(() => {
    let media: MediaQueryList;
    try {
      media = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }
    const onChange = () => setSystemValue(media.matches ? 'dark' : 'light');
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const resolved: ResolvedTheme = choice === 'system' ? systemValue : choice;

  // 토큰 전환은 클래스 하나로 끝난다
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.documentElement.style.colorScheme = resolved;
  }, [resolved]);

  const setChoice = useCallback((next: ThemeChoice) => {
    setChoiceState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 기억은 못 해도 이번 세션 동안은 동작한다 (T-4)
    }
  }, []);

  const toggle = useCallback(() => {
    setChoice(resolved === 'dark' ? 'light' : 'dark');
  }, [resolved, setChoice]);

  const value = useMemo<ThemeState>(
    () => ({ choice, resolved, setChoice, toggle }),
    [choice, resolved, setChoice, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme 은 ThemeProvider 안에서만 쓸 수 있다');
  return ctx;
}
