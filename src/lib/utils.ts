import { goto } from '$app/navigation';
import { page } from '$app/state';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MINIMUM_PASSWORD_LENGTH = 6;

export class AppError extends Error {
  constructor(e?: string) {
    super(e);
    this.name = new.target.name;
  }
}

export const changeUrlQuery = async (
  params: Record<string, string | number | boolean | null>,
  opts?: {
    replaceState?: boolean | undefined;
    noScroll?: boolean | undefined;
    keepFocus?: boolean | undefined;
    invalidateAll?: boolean | undefined;
    invalidate?: (string | URL | ((url: URL) => boolean))[] | undefined;
    state?: App.PageState | undefined;
  }
) => {
  const url = new URL(page.url.href);
  for (const key in params) {
    if (params[key] === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(params[key]));
    }
  }
  goto(url, { noScroll: true, keepFocus: true, ...opts });
};
