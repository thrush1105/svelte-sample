import { supabase } from '$lib/supabaseClient';

export const countQuizzes = async (groupId: string | null, filter: string | null) => {
  let query = supabase.from('quizzes').select('*', { count: 'exact', head: true });

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  if (filter === 'favorite') {
    query = query.eq('is_favorite', true);
  }

  return await query;
};

export const fetchQuizzes = async (
  groupId: string | null,
  filter: string | null,
  from: number,
  to: number
) => {
  let query = supabase
    .from('quizzes')
    .select('*')
    .range(from, to)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  if (filter === 'favorite') {
    query = query.eq('is_favorite', true);
  }

  return await query;
};
