import logger from '$lib/logger';
import { updatePasswordSchema } from '$lib/schema/updatePassword';
import { checkAccountLock, loginFailed, resetLoginFailures } from '$lib/server/login';
import { fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(updatePasswordSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) {
      logger.error(form.errors);
      return fail(400, { form });
    }

    if (!user?.email) {
      redirect(303, '/login');
    }

    // アカウントロックの確認
    try {
      const loginAttemps = await checkAccountLock(user.email);

      if (loginAttemps?.isLocked) {
        return message(form, 'アカウントがロックされています。時間をおいて再度お試しください', {
          status: 400
        });
      }
    } catch (e) {
      logger.error(e);
      return message(form, 'エラーが発生しました', { status: 500 });
    }

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.data.currentPassword
    });

    if (errorOnSignIn) {
      if (errorOnSignIn.code === 'invalid_credentials') {
        // ログイン失敗
        try {
          const loginAttemps = await loginFailed(user.id);

          logger.warn('ログイン失敗', {
            user_id: user.id,
            failed_attemps: loginAttemps?.failedAttempts
          });

          if (loginAttemps?.isLocked) {
            logger.warn('アカウントロック', { user_id: user.id });
            return message(form, 'アカウントがロックされました', { status: 400 });
          } else {
            return setError(form, 'currentPassword', '現在のパスワードが正しくありません');
          }
        } catch (e) {
          logger.error(e);
          return message(form, 'エラーが発生しました', { status: 500 });
        }
      } else {
        logger.error(errorOnSignIn.stack);
        return message(form, `エラーが発生しました: ${errorOnSignIn.code}`, { status: 500 });
      }
    }

    // ログイン失敗回数のリセット
    try {
      await resetLoginFailures(user?.id);
    } catch (e) {
      logger.error(e);
      return message(form, 'エラーが発生しました', { status: 500 });
    }

    const { error: errorOnUpdate } = await supabase.auth.updateUser({
      password: form.data.newPassword
    });

    if (errorOnUpdate) {
      logger.error(errorOnUpdate.stack);
      return message(form, `エラーが発生しました: ${errorOnUpdate.code}`, { status: 500 });
    }

    logger.info('パスワード変更', { user_id: user.id });

    redirect(303, '/dashboard');
  }
};
