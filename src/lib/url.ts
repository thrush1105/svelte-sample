import { goto } from '$app/navigation';
import { page } from '$app/state';

const fallback = 'http://localhost:5173';

export const getAppUrl = (path: string = '/') => {
  const env = process?.env?.VERCEL_ENV;

  let url = fallback;

  if (env === 'production') {
    url = process?.env.VERCEL_PROJECT_PRODUCTION_URL ?? fallback;
  } else if (env === 'preview') {
    url = process?.env.VERCEL_BRANCH_URL ?? fallback;
  }

  url = url.startsWith('http') ? url : `https://${url}`;

  return new URL(path, url).toString();
};

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

export const parseSearchParams = (params: URLSearchParams) => {
  const obj: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    obj[key] = value;
  }
  return obj;
};
