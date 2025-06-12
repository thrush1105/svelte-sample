import { convertKeysToCamel, convertKeysToSnake } from '$lib/utils.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { format, parse } from 'date-fns';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPayslipFormSchema } from '../schema.js';
import type { Actions, PageServerLoad } from './$types.js';
import { z } from 'zod';

const loadSchema = z.object({
  id: z.coerce.number().int()
});

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
  const params = await superValidate(url.searchParams, zod(loadSchema));

  if (!params.valid) {
    console.error(params.errors);
    error(400, 'エラーが発生しました');
  }

  const { data: payslip, error: errorOnSelect } = await supabase
    .from('payslips')
    .select('*')
    .eq('id', params.data.id)
    .maybeSingle();

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500, `エラーが発生しました: ${errorOnSelect.code}`);
  }

  if (!payslip) {
    error(404, 'データが見つかりません');
  }

  return {
    form: await superValidate(convertKeysToCamel(payslip), zod(createPayslipFormSchema))
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

    if (!form.data.id) {
      error(400, 'エラーが発生しました');
    }

    const { count, error: errorOnCount } = await supabase
      .from('payslips')
      .select('*', { count: 'exact', head: true })
      .eq('id', form.data.id);

    if (errorOnCount) {
      console.error(errorOnCount);
      error(500, `エラーが発生しました: ${errorOnCount.code}`);
    }

    if (!count) {
      error(404, 'データが見つかりません');
    }

    const { error: errorOnUpdate } = await supabase
      .from('payslips')
      .update({
        ...convertKeysToSnake(form.data)
      })
      .eq('id', form.data.id);

    if (errorOnUpdate) {
      console.error(errorOnUpdate);
      error(500, `エラーが発生しました: ${errorOnUpdate.code}`);
    }

    const month = format(parse(form.data.paymentDate, 'yyyy-MM-dd', new Date()), 'yyyy-MM');

    redirect(303, `/payslip?month=${month}`);
  }
};
