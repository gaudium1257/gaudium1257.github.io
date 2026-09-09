import ReactMarkdown from 'react-markdown';
import { cn } from '@portfolio/ui';

/**
 * 본문 조판 규칙.
 *
 * 한 줄로 늘어놓으면 아무도 못 읽으므로 요소별로 끊어 둔다.
 * 색은 전부 토큰이다 — 하드코딩하면 다크 모드에서 그대로 남는다.
 */
const PROSE = [
  't-body space-y-5 text-foreground/85',
  // 소제목은 본문보다 진하게. 크기 차이만으로는 스캔이 안 된다
  '[&_h2]:mt-9 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground',
  '[&_h3]:mt-7 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground',
  '[&_li]:ml-4 [&_li]:list-disc [&_li]:marker:text-brand',
  '[&_strong]:font-semibold [&_strong]:text-foreground',
  // 인용은 왼쪽 막대로 본문에서 떼어낸다 — 들여쓰기만으로는 목록과 헷갈린다
  '[&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-4',
  '[&_blockquote]:bg-brand-subtle/40 [&_blockquote]:py-2 [&_blockquote]:text-foreground',
  '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5',
  '[&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground',
  '[&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4',
  '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_hr]:my-8 [&_hr]:border-border',
].join(' ');

/**
 * 마크다운 렌더. react-markdown 은 기본적으로 원시 HTML 을 렌더하지 않는다 —
 * rehype-raw 류 플러그인을 추가하지 마라. 그 순간 XSS 경로가 열린다 (docs/SECURITY.md).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className={cn(PROSE)}>
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 transition-colors hover:text-brand"
            >
              {linkChildren}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
