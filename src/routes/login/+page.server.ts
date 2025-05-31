import logger from '$lib/logger';
import { loginFormSchema } from '$lib/schema/login';
import { getAppUrl } from '$lib/utils';
import type { Provider } from '@supabase/supabase-js';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

const getRedirectUrl = () => {
  return new URL('/login/callback', getAppUrl()).toString();
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
      logger.error(form.errors);
      return fail(400, { form });
    }

    const {
      data: { user },
      error: errorOnSignIn
    } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (errorOnSignIn) {
      logger.error(errorOnSignIn.stack);

      let msg;
      if (errorOnSignIn.code === 'invalid_credentials') {
        msg = 'メールアドレスまたはパスワードが一致しません';
      } else {
        msg = `エラーが発生しました: ${errorOnSignIn.code}`;
      }

      return message(form, msg, { status: 400 });
    }

    logger.info('ログイン', { user_id: user?.id });

    redirect(303, '/dashboard');
  },

  logout: async ({ locals: { supabase, user } }) => {
    const { error: errorOnSignOut } = await supabase.auth.signOut();

    if (errorOnSignOut) {
      logger.error(errorOnSignOut.stack);
      error(500);
    }

    logger.info('ログアウト', { user_id: user?.id });

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
      logger.error(errorOnSignIn.stack);
      error(500);
    }

    logger.info('ソーシャルログイン要求', data);

    redirect(303, data.url);
  }
};
