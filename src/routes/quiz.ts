import { supabase } from '$lib/supabaseClient';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

const filterQuery = (params: URLSearchParams, query: PostgrestFilterBuilder<any, any, any>) => {
  const groupId = params.get('groupId');
  const favorite = params.get('favorite');
  const text = params.get('text');

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  if (favorite === 'true') {
    query = query.eq('is_favorite', true);
  }

  if (text) {
    query = query.or(`genre.ilike.%${text}%,question.ilike.%${text}%,explanation.ilike.%${text}%`);
  }

  return query;
};

export const countQuizzes = async (params: URLSearchParams) => {
  let query = supabase.from('quizzes').select('*', { count: 'exact', head: true });

  query = filterQuery(params, query);

  return await query.throwOnError();
};

export const fetchQuizzes = async (params: URLSearchParams) => {
  const page = parseInt(params.get('page') ?? '1') || 1;
  const perPage = parseInt(params.get('perPage') ?? '5') || 5;

  const from = perPage * (page - 1);
  const to = from + perPage - 1;

  let query = supabase
    .from('quizzes')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: false })
    .order('id', { ascending: true });

  query = filterQuery(params, query);

  return await query.throwOnError();
};
