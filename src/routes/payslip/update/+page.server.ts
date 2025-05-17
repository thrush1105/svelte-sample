import { convertKeysToCamel, convertKeysToSnake } from '$lib';
import type { PayslipRow } from '$lib/types/payslip.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { format, parse } from 'date-fns';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { formSchema } from '../schema.js';
import type { Actions, PageServerLoad } from './$types.js';

const loadSchema = z.object({
  id: z.coerce.number().int()
});

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(loadSchema));

  if (!params.valid) {
    console.error(params.errors);
    error(400);
  }

  const { data, error: errorOnSelect } = await supabase
    .from('payslips')
    .select('*')
    .eq('id', params.data.id)
    .maybeSingle()
    .overrideTypes<PayslipRow, { merge: false }>();

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500);
  }

  if (!data) {
    error(404, 'Not Found');
  }

  return {
    form: await superValidate(convertKeysToCamel(data), zod(formSchema))
  };
};

export const actions: Actions = {
  default: async ({ url, request, locals: { supabase, user } }) => {
    const params = await superValidate(url.searchParams, zod(loadSchema));

    if (!params.valid) {
      return fail(400, { params });
    }

    const form = await superValidate(request, zod(formSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!user) {
      return fail(401);
    }

    const { error: errorOnUpdate } = await supabase
      .from('payslips')
      .update({
        ...convertKeysToSnake(form.data)
      })
      .eq('id', params.data.id);

    if (errorOnUpdate) {
      console.error(errorOnUpdate);
      return fail(500);
    }

    const month = format(parse(form.data.paymentDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM');

    redirect(303, `/payslip/monthly?month=${month}`);
  }
};
