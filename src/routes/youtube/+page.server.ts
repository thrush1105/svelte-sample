import { AppError } from '$lib/errors.js';
import { saveVideoWithUrl } from '$lib/models/YoutubeVideo.js';
import { error, redirect } from '@sveltejs/kit';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import { formSchema, paramsSchema } from './schema';

export const load: PageServerLoad = async ({ url, locals: { user } }) => {
  const params = await superValidate(url.searchParams, zod(paramsSchema));

  if (!params.valid) {
    console.error(params.errors);
    error(400);
  }

  if (!user) {
    return redirect(303, '/login');
  }

  return {
    params: params.data,
    form: await superValidate(zod(formSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    if (!user) {
      return redirect(303, '/login');
    }

    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    try {
      await saveVideoWithUrl(supabase, user.id, form.data.url);
    } catch (e) {
      console.error(e);

      if (e instanceof AppError) {
        return setError(form, 'url', e.message);
      } else {
        error(500);
      }
    }

    return { form };
  }
};
