import { Google } from '$lib/server/oauth/google';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { user } }) => {
  if (!user) {
    redirect(303, '/login');
  }

  const authorized = await new Google().authorize(user.id);

  if (!authorized) {
    return { google: null };
  }

  return { google: authorized.credentials };
};

export const actions: Actions = {
  revoke: async ({ request, locals: { user } }) => {
    if (!user) {
      redirect(303, '/login');
    }

    const formData = await request.formData();

    const provider = formData.get('provider');

    if (provider === 'google') {
      await new Google().revokeToken(user.id);
    }

    return {};
  }
};
