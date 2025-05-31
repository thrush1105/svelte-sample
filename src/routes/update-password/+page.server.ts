import { updatePasswordSchema } from '$lib/schema/updatePassword';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import logger from '$lib/logger';

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

    const { error: errorOnSignIn } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: form.data.currentPassword
    });

    if (errorOnSignIn) {
      logger.error(errorOnSignIn.stack);

      let msg;
      if (errorOnSignIn.code === 'invalid_credentials') {
        msg = '現在のパスワードが正しくありません';
      } else {
        msg = `エラーが発生しました: ${errorOnSignIn.code}`;
      }

      return setError(form, 'currentPassword', msg);
    }

    const { error: errorOnUpdate } = await supabase.auth.updateUser({
      password: form.data.newPassword
    });

    if (errorOnUpdate) {
      logger.error(errorOnUpdate.stack);
      error(500);
    }

    logger.info('パスワード変更', { user_id: user.id });

    redirect(303, '/dashboard');
  }
};
