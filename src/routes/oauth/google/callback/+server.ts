import { Google } from '$lib/server/oauth/google';
import { error, isRedirect, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals: { user } }) => {
  if (!user) {
    redirect(303, '/login');
  }

  const code = url.searchParams.get('code') as string;

  try {
    await new Google().issueToken(code, user.id);
    redirect(303, '/oauth');
  } catch (e) {
    if (isRedirect(e)) throw e;
    console.error(e);
    error(500);
  }
};
