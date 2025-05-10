import { fail, redirect } from '@sveltejs/kit';
import type { Quiz } from '../../../lib/types';
import type { Actions } from './$types';
import { generateQuizzesWithAI } from './quizGenerator';

export const actions: Actions = {
  generate: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const genre = formData.get('genre') as string;
    const difficulty = (formData.get('difficulty') as string) ?? '難しい';

    /**
     * OpenAI APIを使ってクイズを生成する
     */
    let userInputText = genre
      ? `ジャンル「${genre}」で難易度「${difficulty}」の4択クイズを5問出題してください。`
      : `難易度「${difficulty}」の4択クイズを5問出題してください。`;
    const response = await generateQuizzesWithAI('gpt-4.1-nano', userInputText).catch((error) => {
      console.error(error);
    });

    if (!response) {
      return fail(500, { error: { message: 'クイズの生成に失敗しました。' } });
    }

    /**
     * 出力をパースしてクイズとしてSupabaseのquizzesテーブルに保存する
     */
    const jsonResponse: { data: Quiz[] } = JSON.parse(response.output_text);

    const groupId = crypto.randomUUID();

    const { error: errorOnSaveQuizzes } = await supabase.from('quizzes').insert(
      jsonResponse.data.map((q) => {
        return {
          group_id: groupId,
          genre: q.genre,
          difficulty: q.difficulty,
          question: q.question,
          explanation: q.explanation,
          choices: q.choices,
          correct_choice_id: q.correct_choice_id
        };
      })
    );

    if (errorOnSaveQuizzes) {
      console.error(errorOnSaveQuizzes);
      return fail(500, { error: { message: 'クイズの生成に失敗しました。' } });
    }

    const searchParams = new URLSearchParams();
    searchParams.set('groupId', groupId);

    redirect(303, `/quiz?${searchParams.toString()}`);
  }
};
