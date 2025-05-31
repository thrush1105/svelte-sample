import { goto } from '$app/navigation';
import { page } from '$app/state';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAppUrl = (fallback: string = 'http://localhost:5173') => {
  const env = process?.env?.VERCEL_ENV;

  let url;

  if (env === 'production') {
    url = process?.env.VERCEL_PROJECT_PRODUCTION_URL ?? fallback;
  } else if (env === 'preview') {
    url = process?.env.VERCEL_BRANCH_URL ?? fallback;
  } else {
    url = fallback;
  }

  url = url.startsWith('http') ? url : `https://${url}`;

  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

/**
 * URLクエリパラメータを更新する。
 * @param params URLクエリパラメータ
 * @param opts ナビゲーションのオプション
 */
export const updateUrlQuery = async (
  params: Record<string, string | number | boolean | null>,
  opts?:
    | {
        replaceState?: boolean | undefined;
        noScroll?: boolean | undefined;
        keepFocus?: boolean | undefined;
        invalidateAll?: boolean | undefined;
        invalidate?: (string | URL | ((url: URL) => boolean))[] | undefined;
        state?: App.PageState | undefined;
      }
    | undefined
) => {
  const url = new URL(page.url.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, String(value));
    }
  });

  goto(url, {
    noScroll: opts?.noScroll ?? true,
    keepFocus: opts?.keepFocus ?? true,
    ...opts
  });
};

export const parseStringToInt = (value: string | null | undefined) => {
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};
