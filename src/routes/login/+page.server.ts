import type { Provider } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const getVercelUrl = () => {
  const env = process?.env?.VERCEL_ENV;
  if (env === 'production') {
    return process?.env.VERCEL_PROJECT_PRODUCTION_URL;
  } else if (env === 'preview') {
    return process?.env.VERCEL_BRANCH_URL;
  } else {
    return process?.env?.VERCEL_URL;
  }
};

const getRedirectUrl = () => {
  let url = getVercelUrl() ?? 'http://localhost:3000/';

  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;

  return new URL('/login/callback', url).toString();
};

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error(error);
      return fail(400, { email, error: { message: error.message } });
    } else {
      redirect(303, '/dashboard');
    }
  },
  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    redirect(303, '/login');
  },
  loginWithOAuth: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const provider = formData.get('provider') as Provider;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: getRedirectUrl() }
    });

    if (error) {
      console.error(error);
      return fail(400, { error: { message: error.message } });
    } else {
      redirect(303, data.url);
    }
  }
};
