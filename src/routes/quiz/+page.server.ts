import { error } from '@sveltejs/kit';
import { countQuizzes, fetchQuizzes } from '../quiz';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const params = url.searchParams;
  const page = parseInt(params.get('page') ?? '1') || 1;
  const perPage = parseInt(params.get('perPage') ?? '5') || 5;
  const from = perPage * (page - 1);
  const to = from + perPage - 1;

  const { count: total, error: errorOnCount } = await countQuizzes(url.searchParams);

  if (errorOnCount) {
    console.error(errorOnCount);
    error(500, errorOnCount.message);
  }

  const { data: quizzes, error: errorOnFetch } = await fetchQuizzes(url.searchParams);

  if (errorOnFetch) {
    console.error(errorOnFetch);
    error(500, errorOnFetch.message);
  }

  return {
    page: page,
    perPage: perPage,
    from: from,
    to: to,
    total: total ?? 0,
    quizzes: quizzes ?? []
  };
};
