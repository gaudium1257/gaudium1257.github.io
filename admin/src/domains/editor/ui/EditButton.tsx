import { Button } from '@portfolio/ui';

/** 섹션 제목 옆의 '추가' 버튼 (ADR-0005 편집 슬롯) */
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick}>
      + {label}
    </Button>
  );
}

/** 개별 항목 옆의 '수정' 버튼 */
export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="sm" variant="outline" onClick={onClick}>
      수정
    </Button>
  );
}
