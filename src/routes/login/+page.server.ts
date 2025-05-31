import logger from '$lib/logger';
import { loginFormSchema } from '$lib/schema/login';
import { checkAccountLock, loginFailed, resetLoginFailures } from '$lib/server/login';
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

    let userId: string | null | undefined;

    // アカウントロックの確認
    try {
      const loginAttemps = await checkAccountLock(form.data.email);

      userId = loginAttemps?.userId;

      if (loginAttemps?.isLocked) {
        return message(form, 'アカウントがロックされています。時間をおいて再度お試しください', {
          status: 400
        });
      }
    } catch (e) {
      logger.error(e);
      return message(form, 'エラーが発生しました', { status: 500 });
    }

    const {
      data: { user },
      error: errorOnSignIn
    } = await supabase.auth.signInWithPassword({
      email: form.data.email,
      password: form.data.password
    });

    if (errorOnSignIn) {
      if (errorOnSignIn.code === 'invalid_credentials') {
        // ログイン失敗
        try {
          const loginAttemps = await loginFailed(userId);

          logger.warn('ログイン失敗', {
            user_id: userId,
            failed_attemps: loginAttemps?.failedAttempts
          });

          if (loginAttemps?.isLocked) {
            logger.warn('アカウントロック', { user_id: userId });
            return message(form, 'アカウントがロックされました', { status: 400 });
          } else {
            return message(form, 'メールアドレスまたはパスワードが一致しません', { status: 400 });
          }
        } catch (e) {
          logger.error(e);
          return message(form, 'エラーが発生しました', { status: 500 });
        }
      } else {
        logger.error(errorOnSignIn.stack);
        return message(form, 'エラーが発生しました', { status: 500 });
      }
    }

    // ログイン失敗回数のリセット
    try {
      await resetLoginFailures(user?.id);
    } catch (e) {
      logger.error(e);
      return message(form, 'エラーが発生しました', { status: 500 });
    }

    logger.info('ログイン成功', { user_id: user?.id });

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
