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
