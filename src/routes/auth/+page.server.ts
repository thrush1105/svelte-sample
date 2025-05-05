import type { Provider } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    process?.env?.VERCEL_URL ??
    'http://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};

export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error(error);
      return fail(400, { email, error: { message: error.message } });
    } else {
      redirect(303, '/private');
    }
  },
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error);
      return fail(400, { email, error: { message: error.message } });
    } else {
      redirect(303, '/private');
    }
  },
  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    redirect(303, '/auth');
  },
  signInWithOAuth: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const provider = formData.get('provider') as Provider;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: new URL('/auth/callback', getURL()).toString()
      }
    });
    if (error) {
      console.error(error);
      return fail(400);
    } else {
      redirect(303, data.url);
    }
  }
};
