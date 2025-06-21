import { convertKeysToSnake } from '$lib/utils.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { format, parse } from 'date-fns';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPayslipFormSchema } from '../schema.js';
import type { Actions, PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(createPayslipFormSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    const form = await superValidate(request, zod(createPayslipFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    if (!user) {
      redirect(303, '/login');
    }

    const { error: errorOnInsert } = await supabase.from('payslips').insert({
      user_id: user.id,
      ...convertKeysToSnake(form.data)
    });

    if (errorOnInsert) {
      console.error(errorOnInsert);
      error(500, `エラーが発生しました: ${errorOnInsert.code}`);
    }

    const month = format(parse(form.data.paymentDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM');

    redirect(303, `/payslip?month=${month}`);
  }
};
