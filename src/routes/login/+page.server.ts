import { loginFormSchema } from '$lib/schema/login';
import { getAppUrl } from '$lib/utils';
import type { Provider } from '@supabase/supabase-js';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

const getRedirectUrl = () => {
  let url = getAppUrl() ?? 'http://localhost:3000/';
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return new URL('/login/callback', url).toString();
};

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(loginFormSchema))
  };
};

export const actions: Actions = {
  login: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(loginFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (errorOnSignIn) {
      console.error(errorOnSignIn);
      return message(form, errorOnSignIn.message, { status: 400 });
    }

    redirect(303, '/dashboard');
  },

  logout: async ({ locals: { supabase } }) => {
    const { error: errorOnSignOut } = await supabase.auth.signOut();

    if (errorOnSignOut) {
      console.error(errorOnSignOut);
      error(500);
    }

    redirect(303, '/login');
  },

  loginWithOAuth: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const provider = formData.get('provider');

    const { data, error: errorOnSignIn } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: { redirectTo: getRedirectUrl() }
    });

    if (errorOnSignIn) {
      console.error(errorOnSignIn);
      error(500);
    }

    redirect(303, data.url);
  }
};
