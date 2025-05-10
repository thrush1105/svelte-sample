import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const groupId = url.searchParams.get('groupId');

  let query = supabase.from('quizzes').select('*').order('created_at', { ascending: true });

  if (groupId) {
    query = query.eq('group_id', groupId);
  }

  const { data: quizzes, error: apiError } = await query;

  if (apiError) {
    console.error(apiError);
    error(500, apiError.message);
  }

  return {
    groupId: groupId,
    quizzes: quizzes ?? []
  };
};
