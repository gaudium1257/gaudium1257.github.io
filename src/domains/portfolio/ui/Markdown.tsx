import ReactMarkdown from 'react-markdown';

/**
 * 마크다운 렌더. react-markdown 은 기본적으로 원시 HTML 을 렌더하지 않는다 —
 * rehype-raw 류 플러그인을 추가하지 마라. 그 순간 XSS 경로가 열리고,
 * XSS 는 곧 관리자 토큰 탈취다 (docs/SECURITY.md §4).
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:font-semibold [&_strong]:text-foreground">
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="underline underline-offset-4 hover:text-foreground"
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
