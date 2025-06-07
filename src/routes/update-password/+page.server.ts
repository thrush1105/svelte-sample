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

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.data.currentPassword
    });

    if (errorOnSignIn) {
      if (errorOnSignIn.code === 'invalid_credentials') {
        return setError(form, 'currentPassword', '現在のパスワードが正しくありません');
      } else {
        console.error(errorOnSignIn.stack);
        error(500, `エラーが発生しました: ${errorOnSignIn.code}`);
      }
    }

    const { error: errorOnUpdate } = await supabase.auth.updateUser({
      password: form.data.newPassword
    });

    if (errorOnUpdate) {
      console.error(errorOnUpdate.stack);
      error(500, `エラーが発生しました: ${errorOnUpdate.code}`);
    }

    redirect('/profile', { type: 'success', message: 'パスワードを変更しました' }, cookies);
  }
};
