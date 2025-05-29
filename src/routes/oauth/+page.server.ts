import { Google } from '$lib/server/oauth/google';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
  if (!user) {
    redirect(303, '/login');
  }

  const google = await new Google().authorize(user.id);

  if (!google) {
    return { google: null };
  }

  return { google: google.credentials };
};

export const actions: Actions = {
  revoke: async ({ locals: { user } }) => {
    if (!user) {
      redirect(303, '/login');
    }

    await new Google().revokeToken(user.id);

    return {};
  }
};
