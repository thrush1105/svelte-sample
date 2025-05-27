import { updatePasswordSchema } from '$lib/schema/updatePassword';
import { error, fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
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
      console.error(errorOnSignIn);
      return setError(form, 'currentPassword', '現在のパスワードが正しくありません。');
    }

    const { error: errorOnUpdate } = await supabase.auth.updateUser({
      password: form.data.newPassword
    });

    if (errorOnUpdate) {
      console.error(errorOnUpdate);
      error(500);
    }

    redirect(303, '/dashboard');
  }
};
