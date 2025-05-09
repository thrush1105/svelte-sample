import { MINIMUM_PASSWORD_LENGTH } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  updatePassword: async ({ request, locals: { supabase, user } }) => {
    const formData = await request.formData();
    const email = user?.email;
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmNewPassword = formData.get('confirmNewPassword') as string;

    if (!email) {
      redirect(303, '/login');
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return fail(400, {
        error: { message: 'すべてのフィールドを入力してください。' }
      });
    }

    if (
      currentPassword.length < MINIMUM_PASSWORD_LENGTH ||
      newPassword.length < MINIMUM_PASSWORD_LENGTH ||
      confirmNewPassword.length < MINIMUM_PASSWORD_LENGTH
    ) {
      return fail(400, {
        error: { message: `パスワードは${MINIMUM_PASSWORD_LENGTH}文字以上である必要があります。` }
      });
    }

    if (newPassword !== confirmNewPassword) {
      return fail(400, {
        error: { message: '新しいパスワードが一致しません。' }
      });
    }

    if (currentPassword === newPassword) {
      return fail(400, {
        error: { message: '新しいパスワードは現在のパスワードと異なる必要があります。' }
      });
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword
    });

    if (authError) {
      console.error(authError);
      return fail(400, { error: { message: '現在のパスワードが正しくありません。' } });
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      console.error(error);
      return fail(400, { error: { message: error.message } });
    } else {
      redirect(303, '/dashboard');
    }
  }
};
