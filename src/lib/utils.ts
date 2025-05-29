import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAppUrl = (fallback: string = 'http://localhost:3000') => {
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
