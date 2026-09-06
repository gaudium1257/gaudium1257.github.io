/**
 * UI 공개 표면. 앱은 생성물(components/ui/*)을 직접 가리키지 않고 여기를 통한다 (INV-6).
 * 쓰지 않는 컴포넌트는 두지 않는다 — 필요해지면 `npm run ui:add` 로 다시 가져온다 (GR-9).
 */
export { cn } from './lib/utils';

export { Button, buttonVariants } from './components/ui/button';
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './components/ui/card';
export { Input } from './components/ui/input';
export { Badge } from './components/ui/badge';
export { Separator } from './components/ui/separator';
