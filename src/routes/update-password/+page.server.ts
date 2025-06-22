import { checkAccountLock, loginFailed, resetLoginFailures } from '$lib/server/login';
import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { updatePasswordSchema } from './schema';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(updatePasswordSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user }, cookies }) => {
    const form = await superValidate(request, zod(updatePasswordSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    if (!user?.email) {
      redirect(303, '/login');
    }

    // アカウントロックの確認
    const { data: account, error: errorOnCheckAccountLock } = await checkAccountLock(user.id);

    if (errorOnCheckAccountLock) {
      console.error(errorOnCheckAccountLock);
      error(500, `エラーが発生しました: ${errorOnCheckAccountLock.code}`);
    }

    if (account?.isLocked) {
      return setError(form, 'currentPassword', 'アカウントがロックされています');
    }

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.data.currentPassword
    });

    if (errorOnSignIn) {
      if (errorOnSignIn.code === 'invalid_credentials') {
        // ログイン失敗
        const { data: account, error: errorOnLoginFailed } = await loginFailed(user.id);

        if (errorOnLoginFailed) {
          console.error(errorOnLoginFailed);
          error(500, `エラーが発生しました: ${errorOnLoginFailed.code}`);
        }

        if (account?.isLocked) {
          return setError(form, 'currentPassword', 'アカウントがロックされました');
        }

        return setError(form, 'currentPassword', '現在のパスワードが正しくありません');
      } else {
        console.error(errorOnSignIn);
        error(500, `エラーが発生しました: ${errorOnSignIn.code}`);
      }
    }

    // ログイン失敗回数のリセット
    const { error: errorOnResetLoginFailures } = await resetLoginFailures(user.id);

    if (errorOnResetLoginFailures) {
      console.error(errorOnResetLoginFailures);
      error(500, `エラーが発生しました: ${errorOnResetLoginFailures.code}`);
    }

    const { error: errorOnUpdate } = await supabase.auth.updateUser({
      password: form.data.newPassword
    });

    if (errorOnUpdate) {
      console.error(errorOnUpdate);
      error(500, `エラーが発生しました: ${errorOnUpdate.code}`);
    }

    redirect('/profile', { type: 'success', message: 'パスワードを変更しました' }, cookies);
  }
};
