import logger from '$lib/logger';
import { signupFormSchema } from '$lib/schema/singup';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(signupFormSchema))
  };
};

export const actions: Actions = {
  singup: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(signupFormSchema));

    if (!form.valid) {
      logger.error(form.errors);
      return fail(400, { form });
    }

    const {
      data: { user },
      error: errorOnSignUp
    } = await supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password
    });

    if (errorOnSignUp) {
      logger.error(errorOnSignUp.stack);

      let msg;
      if (errorOnSignUp.code === 'user_already_exists') {
        msg = 'メールアドレスがすでに登録されています';
      } else {
        msg = `エラーが発生しました: ${errorOnSignUp.code}`;
      }

      return message(form, msg, { status: 400 });
    }

    logger.info('ユーザー登録', { user_id: user?.id });

    redirect(303, '/dashboard');
  }
};
