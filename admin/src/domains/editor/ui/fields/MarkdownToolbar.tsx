import { cn } from '@portfolio/ui';

export interface ToolAction {
  label: string;
  /** 버튼에 보이는 글자. 아이콘 대신 활자를 쓴다 — 서식 이름이 곧 결과다 */
  glyph: string;
  title: string;
  run: () => void;
}

/**
 * 서식 도구 (EP-0007).
 *
 * 아이콘 대신 **활자**를 쓴다. `B`·`H2`·`""` 는 결과를 그대로 보여주지만
 * 그림 아이콘은 한 번 배워야 한다. 도구가 15개도 안 되므로 그림이 필요 없다.
 */
export function MarkdownToolbar({
  actions,
  right,
}: {
  actions: ToolAction[][];
  /** 미리보기 토글처럼 오른쪽에 서는 것 */
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-1 rounded-t-md border border-b-0 border-input bg-muted/50 px-2 py-1.5">
      {actions.map((group, i) => (
        <div key={group[0]?.label ?? i} className="flex items-center gap-0.5">
          {i > 0 ? <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" /> : null}
          {group.map((action) => (
            <ToolButton key={action.label} action={action} />
          ))}
        </div>
      ))}
      {right ? <div className="ml-auto flex items-center gap-1">{right}</div> : null}
    </div>
  );
}

function ToolButton({ action }: { action: ToolAction }) {
  return (
    <button
      type="button"
      /*
       * 버튼을 누르는 순간 textarea 가 포커스를 잃으면 **선택 영역이 풀린다.**
       * 그러면 "굵게" 가 선택한 글자가 아니라 커서 자리에 기호만 넣는다.
       * mousedown 기본 동작을 막아 포커스를 textarea 에 남긴다.
       */
      onMouseDown={(e) => e.preventDefault()}
      onClick={action.run}
      title={action.title}
      aria-label={action.title}
      className={cn(
        'min-w-7 rounded px-1.5 py-1 text-xs text-muted-foreground transition-colors',
        'hover:bg-accent hover:text-foreground',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
      )}
    >
      {action.glyph}
    </button>
  );
}
