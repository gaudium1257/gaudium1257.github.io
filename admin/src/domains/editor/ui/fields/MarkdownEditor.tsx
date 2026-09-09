import { useCallback, useEffect, useRef, useState } from 'react';
import { Markdown } from '@portfolio/portfolio';
import { Button, Textarea, cn } from '@portfolio/ui';
import { uploadImage } from '../../data/upload-api';
import {
  imageSnippet,
  insertBlock,
  insertLink,
  toggleLinePrefix,
  toggleOrderedList,
  toggleWrap,
  type EditResult,
  type TextRange,
} from '../../service/markdown-edit';
import { MarkdownToolbar, type ToolAction } from './MarkdownToolbar';

/**
 * 본문 편집기 (EP-0007).
 *
 * 세 가지를 고친다:
 *  1. **글꼴** — 고정폭 12px 이던 것을 사이트 본문과 같게 맞췄다
 *  2. **서식 도구** — 마크다운 문법을 외우지 않아도 된다
 *  3. **미리보기** — 공개 사이트가 쓰는 `Markdown` 을 **그대로** 불러 쓴다.
 *     미리보기 전용 렌더를 따로 만들면 둘이 갈라지고, 갈라진 미리보기는 없느니만 못하다
 */
/**
 * 서식 적용과 이미지 삽입. 편집 결과를 반영한 뒤 **선택 영역을 복원**한다 —
 * 안 하면 버튼을 누를 때마다 커서가 글 끝으로 튄다.
 */
function useEditing(value: string, onChange: (next: string) => void) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  /** 다음 렌더에서 복원할 선택 영역 */
  const pending = useRef<[number, number] | null>(null);

  /**
   * 복원은 **값이 반영된 뒤**에 해야 한다.
   * requestAnimationFrame 으로 하면 React 가 새 값을 커밋하기 전에 돌아 헛돌고,
   * 커서가 글 끝으로 튄다 (실제로 그랬다).
   */
  useEffect(() => {
    const el = ref.current;
    const target = pending.current;
    if (!el || !target) return;
    pending.current = null;
    el.focus();
    el.setSelectionRange(target[0], target[1]);
  }, [value]);

  const apply = useCallback(
    (edit: (range: TextRange) => EditResult) => {
      const el = ref.current;
      if (!el) return;
      const result = edit({ text: el.value, start: el.selectionStart, end: el.selectionEnd });
      pending.current = [result.start, result.end];
      onChange(result.text);
    },
    [onChange],
  );

  const insertImage = useCallback(
    async (file: File) => {
      setStatus('올리는 중…');
      const result = await uploadImage(file);
      if (!result.ok) {
        setStatus(result.message);
        return;
      }
      setStatus(null);
      apply((range) => insertBlock(range, imageSnippet(result.url, '')));
    },
    [apply],
  );

  return { ref, status, apply, insertImage };
}

export function MarkdownEditor({
  id,
  value,
  rows,
  placeholder,
  disabled,
  onChange,
}: {
  id: string;
  value: string;
  rows: number;
  placeholder?: string;
  disabled?: boolean;
  onChange: (next: string) => void;
}) {
  const [preview, setPreview] = useState(false);
  const { ref, status, apply, insertImage } = useEditing(value, onChange);

  return (
    <div>
      <MarkdownToolbar
        actions={buildActions(apply, insertImage)}
        right={
          <Button
            type="button"
            size="sm"
            variant={preview ? 'secondary' : 'ghost'}
            onClick={() => setPreview((v) => !v)}
          >
            미리보기
          </Button>
        }
      />

      {preview ? (
        <PreviewPane value={value} rows={rows} />
      ) : (
        <WritingPane
          id={id}
          inputRef={ref}
          value={value}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onDropFile={insertImage}
        />
      )}

      {status ? (
        <p role="status" className="mt-1.5 text-xs text-muted-foreground">
          {status}
        </p>
      ) : null}
    </div>
  );
}

/** 글 쓰는 칸. 이미지를 끌어다 놓으면 그 자리에 삽입된다 */
function WritingPane({
  id,
  inputRef,
  value,
  rows,
  placeholder,
  disabled,
  onChange,
  onDropFile,
}: {
  id: string;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  rows: number;
  placeholder?: string;
  disabled?: boolean;
  onChange: (next: string) => void;
  onDropFile: (file: File) => Promise<void>;
}) {
  return (
    <Textarea
      id={id}
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onDrop={(e) => {
        const file = e.dataTransfer.files[0];
        if (!file) return;
        e.preventDefault();
        void onDropFile(file);
      }}
      rows={rows}
      disabled={disabled}
      placeholder={placeholder ?? '내용을 입력하세요. 이미지는 끌어다 놓아도 됩니다.'}
      className="rounded-t-none text-sm leading-relaxed"
    />
  );
}

/** 미리보기는 공개 사이트와 같은 컴포넌트로 그린다 (EP-0007 결정 로그) */
function PreviewPane({ value, rows }: { value: string; rows: number }) {
  return (
    <div
      className={cn('overflow-y-auto rounded-b-md border border-input px-4 py-3', 'bg-background')}
      style={{ minHeight: rows * 24 }}
    >
      {value ? (
        <Markdown>{value}</Markdown>
      ) : (
        <p className="text-sm text-muted-foreground">아직 쓴 내용이 없습니다.</p>
      )}
    </div>
  );
}

/** 도구 목록. 그룹 사이에는 구분선이 들어간다 */
function buildActions(
  apply: (edit: (range: TextRange) => EditResult) => void,
  insertImage: (file: File) => Promise<void>,
): ToolAction[][] {
  const wrap = (mark: string) => () => apply((r) => toggleWrap(r, mark));
  const prefix = (mark: string) => () => apply((r) => toggleLinePrefix(r, mark));

  return [
    [
      { label: 'bold', glyph: 'B', title: '굵게', run: wrap('**') },
      { label: 'italic', glyph: 'I', title: '기울임', run: wrap('*') },
      { label: 'strike', glyph: 'S', title: '취소선', run: wrap('~~') },
      { label: 'code', glyph: '<>', title: '코드', run: wrap('`') },
    ],
    [
      { label: 'h2', glyph: 'H2', title: '제목', run: prefix('## ') },
      { label: 'h3', glyph: 'H3', title: '작은 제목', run: prefix('### ') },
    ],
    [
      { label: 'ul', glyph: '••', title: '목록', run: prefix('- ') },
      { label: 'ol', glyph: '1.', title: '번호 목록', run: () => apply(toggleOrderedList) },
      { label: 'quote', glyph: '❝', title: '인용', run: prefix('> ') },
    ],
    [
      { label: 'link', glyph: '🔗', title: '링크', run: () => apply((r) => insertLink(r)) },
      { label: 'image', glyph: '🖼', title: '이미지 넣기', run: () => pickImage(insertImage) },
      {
        label: 'hr',
        glyph: '—',
        title: '구분선',
        run: () => apply((r) => insertBlock(r, '---')),
      },
    ],
  ];
}

/** 파일 선택 창. input 을 화면에 두지 않고 필요할 때만 만든다 */
function pickImage(onPick: (file: File) => Promise<void>) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/png,image/jpeg,image/gif,image/webp,image/svg+xml';
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) void onPick(file);
  };
  input.click();
}
