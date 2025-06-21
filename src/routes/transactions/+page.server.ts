import { parseSearchParams } from '$lib/url';
import { convertKeysToSnake } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { addMonths, format, parse } from 'date-fns';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';
import { deleteFormSchame, editFormSchame, loadSchema } from './schema';
import { summarize } from './transactions';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = loadSchema.safeParse(parseSearchParams(url.searchParams));

  if (!params.success) {
    console.error(params.error);
    error(400);
  }

  const { month } = params.data;

  const date = parse(month, 'yyyy-MM', new Date());
  const since = format(date, 'yyyy-MM-dd');
  const until = format(addMonths(date, 1), 'yyyy-MM-dd');

  const { data: transactions } = await supabase
    .from('transactions')
    .select()
    .gte('date', since)
    .lt('date', until)
    .order('date')
    .throwOnError();

  const statistics = summarize(transactions);

  return {
    params: params.data,
    transactions,
    statistics
  };
};

export const actions: Actions = {
  update: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(editFormSchame));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    const { id, service, date, amount, category, description, isTransfer } = form.data;

    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('id', id)
      .throwOnError();

    if (!count) {
      error(404);
    }

    await supabase
      .from('transactions')
      .update({
        ...convertKeysToSnake({ service, date, amount, category, description, isTransfer }),
        updated_at: new Date()
      })
      .eq('id', id)
      .throwOnError();

    return message(form, '更新しました!');
  },

  delete: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteFormSchame));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    const { id } = form.data;

    const { count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true })
      .eq('id', id)
      .throwOnError();

    if (!count) {
      error(404);
    }

    await supabase.from('transactions').delete().eq('id', id).throwOnError();

    return message(form, '削除しました!');
  }
};
