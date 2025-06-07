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
