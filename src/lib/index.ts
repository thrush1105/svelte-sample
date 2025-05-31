import { goto } from '$app/navigation';
import { page } from '$app/state';
import { addMonths, format, subMonths } from 'date-fns';

export const updateUrlQuery = (
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

export const getPreviousMonth = (ym: string) => {
  const [year, month] = ym.split('-').map(Number);
  const date = new Date(year, month - 1);
  return format(subMonths(date, 1), 'yyyy-MM');
};

export const getNextMonth = (ym: string) => {
  const [year, month] = ym.split('-').map(Number);
  const date = new Date(year, month - 1);
  return format(addMonths(date, 1), 'yyyy-MM');
};

export const camelToSnake = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

export const convertKeysToSnake = (obj: any): any => {
  return Array.isArray(obj)
    ? obj.map(convertKeysToSnake)
    : obj !== null && typeof obj === 'object'
      ? Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [camelToSnake(key), convertKeysToSnake(value)])
        )
      : obj;
};

export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const convertKeysToCamel = (obj: any): any => {
  return Array.isArray(obj)
    ? obj.map(convertKeysToCamel)
    : obj !== null && typeof obj === 'object'
      ? Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [snakeToCamel(key), convertKeysToCamel(value)])
        )
      : obj;
};
