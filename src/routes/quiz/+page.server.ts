import { countQuizzes, fetchQuizzes } from '../quiz';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const params = url.searchParams;
  const page = parseInt(params.get('page') ?? '1') || 1;
  const perPage = parseInt(params.get('perPage') ?? '5') || 5;
  const from = perPage * (page - 1);
  const to = from + perPage - 1;

  const { count: total } = await countQuizzes(url.searchParams);

  const { data: quizzes } = await fetchQuizzes(url.searchParams);

  return {
    params: {
      page,
      perPage,
      favorite: (params.get('favorite') ?? '') === 'true',
      text: params.get('text') ?? ''
    },
    from: from,
    to: to,
    total: total ?? 0,
    quizzes: quizzes ?? []
  };
};
