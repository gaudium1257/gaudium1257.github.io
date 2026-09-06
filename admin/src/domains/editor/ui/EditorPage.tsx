import { useState } from 'react';
import type { ContentKind } from '@portfolio/content';
import { useEntryList } from '../state/use-editor';
import { DraftEditor } from './DraftEditor';
import { EntryList } from './EntryList';
import { IdInput, KindTabs } from './KindPicker';

/**
 * 편집 화면 (스펙 E-1~E-7).
 * admin 은 로컬 전용이므로 로그인이 없다 — 쓰기 경계는 개발 서버를 띄울 수 있는가 하나다.
 */
export function EditorPage() {
  const [kind, setKind] = useState<ContentKind>('paper');
  const [id, setId] = useState('');
  const { entries, error, refresh } = useEntryList(kind);

  function selectKind(next: ContentKind) {
    setKind(next);
    setId(next === 'profile' ? 'profile' : '');
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-5 py-8">
      <EditorHeader />
      <KindTabs kind={kind} onSelect={selectKind} />

      <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
        <aside className="space-y-3">
          {kind !== 'profile' ? (
            <>
              <IdInput id={id} onChange={setId} />
              <EntryList entries={entries} error={error} selectedId={id} onSelect={setId} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">프로필은 항목이 하나입니다.</p>
          )}
        </aside>

        <DraftEditor key={`${kind}:${id}`} kind={kind} id={id} onSaved={refresh} />
      </div>
    </div>
  );
}

function EditorHeader() {
  return (
    <header className="space-y-1">
      <h1 className="text-xl font-semibold tracking-tight">포트폴리오 편집</h1>
      <p className="text-sm text-muted-foreground">
        로컬 전용 도구입니다. 저장하면 <code>content/</code> 파일이 바로 바뀝니다. 공개 반영은 git
        commit &amp; push 입니다.
      </p>
    </header>
  );
}
