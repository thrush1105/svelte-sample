import { AppError, MINIMUM_PASSWORD_LENGTH } from '$lib/utils';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { validatePassword } from './validatePassword';

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

    try {
      validatePassword(currentPassword, newPassword, confirmNewPassword);
    } catch (e) {
      if (e instanceof AppError) {
        return fail(400, { error: { message: e.message } });
      } else {
        throw e;
      }
    }

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword
    });

    if (errorOnSignIn) {
      console.error(errorOnSignIn);
      return fail(400, { error: { message: '現在のパスワードが正しくありません。' } });
    }

    const { error: errorOnUpdateUser } = await supabase.auth.updateUser({ password: newPassword });

    if (errorOnUpdateUser) {
      console.error(errorOnUpdateUser);
      return fail(400, { error: { message: errorOnUpdateUser.message } });
    }

    redirect(303, '/dashboard');
  }
};
