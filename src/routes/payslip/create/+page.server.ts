import { convertKeysToSnake } from '$lib';
import { error, fail, redirect } from '@sveltejs/kit';
import { format, parse } from 'date-fns';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from '../schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!user) {
      redirect(303, '/login');
    }

    const { error: errorOnUpdate } = await supabase.from('payslips').insert({
      user_id: user.id,
      ...convertKeysToSnake(form.data)
    });

    if (errorOnUpdate) {
      console.error(errorOnUpdate);
      error(500);
    }

    const month = format(parse(form.data.paymentDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM');

    redirect(303, `/payslip/monthly?month=${month}`);
  }
};
