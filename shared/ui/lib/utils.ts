import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Tailwind 클래스 병합. 문자열을 직접 이어붙이지 말고 항상 이걸 쓴다 (docs/DESIGN.md). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
