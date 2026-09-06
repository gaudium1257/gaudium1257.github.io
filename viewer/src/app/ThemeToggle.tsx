import { Moon, Sun } from 'lucide-react';
import { Button } from '@portfolio/ui';
import { useTheme } from '@viewer/shared/providers/theme';

/** 테마 토글 (스펙 T-2). 아이콘만 두지 않고 접근 가능한 이름을 준다 (docs/DESIGN.md). */
export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const next = resolved === 'dark' ? '밝은' : '어두운';

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={`${next} 테마로 전환`}>
      {resolved === 'dark' ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
