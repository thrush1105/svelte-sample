import {
  checkAccountLock,
  loginFailed,
  resetLoginFailures,
  selectUserByEmail
} from '$lib/server/login';
import { getAppUrl } from '$lib/url';
import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { loginFormSchema } from './schema';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(loginFormSchema))
  };
};

export const actions: Actions = {
  login: async ({ request, locals: { supabase }, cookies }) => {
    const form = await superValidate(request, zod(loginFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    // ユーザーの確認
    const { data: userWithEmail, error: errorOnSelectUser } = await selectUserByEmail(
      form.data.email
    );

    if (errorOnSelectUser) {
      console.error(errorOnSelectUser);
      error(500, `エラーが発生しました: ${errorOnSelectUser.code}`);
    }

    if (!userWithEmail) {
      return message(form, 'メールアドレスとパスワードが一致しません', { status: 400 });
    }

    // アカウントロックの確認
    const { data: account, error: errorOnCheckAccountLock } = await checkAccountLock(
      userWithEmail.id
    );

    if (errorOnCheckAccountLock) {
      console.error(errorOnCheckAccountLock);
      error(500, `エラーが発生しました: ${errorOnCheckAccountLock.code}`);
    }

    if (account?.isLocked) {
      return message(form, 'アカウントがロックされています', { status: 400 });
    }

    // サインイン
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
        const { data: account, error: errorOnLoginFailed } = await loginFailed(userWithEmail.id);

        if (errorOnLoginFailed) {
          console.error(errorOnLoginFailed);
          error(500, `エラーが発生しました: ${errorOnLoginFailed.code}`);
        }

        if (account?.isLocked) {
          return message(form, 'アカウントがロックされました', { status: 400 });
        }

        return message(form, 'メールアドレスとパスワードが一致しません', { status: 400 });
      } else {
        console.error(errorOnSignIn);
        error(500, `エラーが発生しました: ${errorOnSignIn.code}`);
      }
    }

    // ログイン失敗回数のリセット
    const { error: errorOnResetLoginFailures } = await resetLoginFailures(userWithEmail.id);

    if (errorOnResetLoginFailures) {
      console.error(errorOnResetLoginFailures);
      error(500, `エラーが発生しました: ${errorOnResetLoginFailures.code}`);
    }

    redirect('/profile', { type: 'success', message: 'ログインしました' }, cookies);
  },

  logout: async ({ locals: { supabase }, cookies }) => {
    const { error: errorOnSignOut } = await supabase.auth.signOut({ scope: 'local' });

    if (errorOnSignOut) {
      console.error(errorOnSignOut);
      error(500, `エラーが発生しました: ${errorOnSignOut.code}`);
    }

    redirect('/login', { type: 'success', message: 'ログアウトしました' }, cookies);
  },

  loginWithOAuth: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();

    const provider = formData.get('provider');

    const { data, error: errorOnSignIn } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: { redirectTo: getAppUrl('/login/callback') }
    });

    if (errorOnSignIn) {
      console.error(errorOnSignIn);
      error(500, `エラーが発生しました: ${errorOnSignIn.code}`);
    }

    redirect(303, data.url);
  }
};
