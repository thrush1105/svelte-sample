import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { countQuizzes, fetchQuizzes } from '../quiz';

export const load: PageServerLoad = async ({ url }) => {
  const groupId = url.searchParams.get('groupId');
  const page = parseInt(url.searchParams.get('page') ?? '1') ?? 1;
  const perPage = parseInt(url.searchParams.get('perPage') ?? '5') ?? 5;
  const filter = url.searchParams.get('filter');
  const from = perPage * (page - 1);
  const to = from + perPage - 1;

  const { error: errorOnCount, count: total } = await countQuizzes(groupId, filter);

  if (errorOnCount) {
    console.error(errorOnCount);
    error(500, errorOnCount.message);
  }

  const { data: quizzes, error: errorOnFetch } = await fetchQuizzes(groupId, filter, from, to);

  if (errorOnFetch) {
    console.error(errorOnFetch);
    error(500, errorOnFetch.message);
  }

  return {
    groupId: groupId,
    page: page,
    perPage: perPage,
    from: from,
    to: to,
    total: total ?? 0,
    quizzes: quizzes ?? []
  };
};
