import { Link } from 'react-router-dom';

export function NotFoundNotice({ message }: { message: string }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link to="/" className="text-sm underline underline-offset-4">
        홈으로
      </Link>
    </div>
  );
}
