import { useState } from 'react';
import { Separator } from '@/shared/ui';
import { useSession } from '@/shared/providers/session';
import type { ContentKind } from '@/shared/content';
import { TEMPLATES } from '../config/templates';
import { AdminHeader } from './AdminHeader';
import { ContentEditor } from './ContentEditor';
import { EntrySelector } from './EntrySelector';
import { SignInPanel } from './SignInPanel';

export function AdminPage() {
  const { login, signOut } = useSession();
  const [kind, setKind] = useState<ContentKind>('project');
  const [id, setId] = useState('');

  // 인증되지 않았으면 인증 화면을 보여준다.
  // 이 분기는 편의일 뿐 보안이 아니다 — 실제 경계는 GitHub 의 토큰 검증이다 (INV-11).
  if (!login) {
    return (
      <div className="space-y-6">
        <AdminHeader />
        <SignInPanel />
      </div>
    );
  }

  const entryId = kind === 'profile' ? 'profile' : id;

  return (
    <div className="space-y-6">
      <AdminHeader login={login} onSignOut={signOut} />
      <Separator />

      <EntrySelector kind={kind} id={id} onKindChange={setKind} onIdChange={setId} />

      {entryId ? (
        <ContentEditor
          key={`${kind}:${entryId}`}
          kind={kind}
          id={entryId}
          template={TEMPLATES[kind]}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          편집하거나 새로 만들 항목의 id 를 입력하세요.
        </p>
      )}
    </div>
  );
}
