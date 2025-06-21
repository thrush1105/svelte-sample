import { parseSearchParams } from '$lib/url';
import { error } from '@sveltejs/kit';
import { searchSchema } from '../schema';
import { summarize } from '../transactions';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = searchSchema.safeParse(parseSearchParams(url.searchParams));

  if (!params.success) {
    console.error(params.error);
    error(400);
  }

  let { data: categories } = await supabase.rpc('get_transaction_categories').throwOnError();

  const { q, category, since, until, sort } = params.data;

  let query = supabase.from('transactions').select();

  if (q) query.ilike('description', `%${q}%`);

  if (category) query.eq('category', category);

  if (since) query.gte('date', since);

  if (until) query.lte('date', until);

  if (sort) {
    query.order('date', { ascending: sort === 'oldest' });
  }

  let { data: transactions } = await query.throwOnError();

  const statistics = summarize(transactions);

  return {
    params: params.data,
    categories: categories.map((category) => ({ label: category.value, value: category.value })),
    transactions,
    statistics
  };
};
