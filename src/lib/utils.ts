import { goto } from '$app/navigation';
import { page } from '$app/state';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAppUrl = () => {
  const env = process?.env?.VERCEL_ENV;

  if (env === 'production') {
    return process?.env.VERCEL_PROJECT_PRODUCTION_URL;
  } else if (env === 'preview') {
    return process?.env.VERCEL_BRANCH_URL;
  } else {
    return process?.env?.VERCEL_URL;
  }
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
