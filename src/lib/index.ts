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
