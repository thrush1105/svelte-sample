import { error, fail } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { signupFormSchema } from './schema';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(signupFormSchema))
  };
};

export const actions: Actions = {
  singup: async ({ request, locals: { supabase }, cookies }) => {
    const form = await superValidate(request, zod(signupFormSchema));

    if (!form.valid) {
      console.error(form.errors);
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
      if (errorOnSignUp.code === 'user_already_exists') {
        return message(form, 'メールアドレスがすでに登録されています', { status: 400 });
      } else {
        console.error(errorOnSignUp);
        error(500, `エラーが発生しました: ${errorOnSignUp.code}`);
      }
    }

    redirect('/profile', { type: 'success', message: 'アカウントを登録しました' }, cookies);
  }
};
