import { AppError } from '$lib/errors.js';
import { saveVideoWithUrl, updateVideo } from '$lib/server/youtube.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import {
  addVideoFormSchema,
  deleteVideoFormSchema,
  searchVideosFormSchema,
  updateVideoFormSchema
} from './schema';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(searchVideosFormSchema));

  if (!params.valid) {
    console.error(params.errors);
    error(400, 'エラーが発生しました');
  }

  const { q, sort } = params.data;

  let query = supabase.from('youtube_videos').select('*', { count: 'exact', head: true });

  if (q) {
    query.or(`title.ilike.%${q}%,channel_title.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (sort) {
    const field = sort.startsWith('-') ? sort.slice(1) : sort;
    const ascending = !sort.startsWith('-');
    query.order(field, { ascending });
  }

  const { count: total } = await query.throwOnError();

  return {
    params: params.data,
    total: total ?? 0,
    addForm: await superValidate(zod(addVideoFormSchema))
  };
};

export const actions: Actions = {
  add: async ({ request, locals: { user } }) => {
    const form = await superValidate(request, zod(addVideoFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    if (!user) {
      redirect(303, '/login');
    }

    try {
      await saveVideoWithUrl(user.id, form.data.url);
    } catch (e) {
      console.error(e);
      if (e instanceof AppError) {
        return setError(form, 'url', e.message);
      } else {
        error(500, 'エラーが発生しました');
      }
    }

    return message(form, '動画を追加しました');
  },

  update: async ({ request, locals: { user } }) => {
    const form = await superValidate(request, zod(updateVideoFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    if (!user) {
      redirect(303, '/login');
    }

    try {
      const video = await updateVideo(user.id, form.data.videoId);
      return { video };
    } catch (e) {
      console.error(e);
      if (e instanceof AppError) {
        error(500, e.message);
      } else {
        error(500, 'エラーが発生しました');
      }
    }
  },

  delete: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deleteVideoFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    const { count } = await supabase
      .from('youtube_videos')
      .select('*', { count: 'exact', head: true })
      .eq('id', form.data.id)
      .throwOnError();

    if (!count) {
      error(400, '動画が存在しません');
    }

    await supabase.from('youtube_videos').delete().eq('id', form.data.id).throwOnError();

    return message(form, '動画を削除しました');
  }
};
