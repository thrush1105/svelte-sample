import { error, redirect } from '@sveltejs/kit';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types.js';
import { fetchVideoByVideoId, saveVideo } from './api.js';
import { fetchVideoInfo } from './api.server.js';
import { formSchema, paramsSchema } from './schema';
import { extractVideoId } from './utils.js';

export const load: PageServerLoad = async ({ url, locals: { supabase, user } }) => {
  // URLクエリパラメータを取得する。
  const params = await superValidate(url.searchParams, zod(paramsSchema));

  // URLクエリパラメータが不正な場合は、エラーを返す。
  if (!params.valid) {
    console.error(params.errors);
    error(400);
  }

  // ユーザーがログインしていない場合は、ログインページにリダイレクトする。
  if (!user) {
    return redirect(303, '/login');
  }

  return {
    params: params,
    form: await superValidate(zod(formSchema))
  };
};

export const actions: Actions = {
  default: async ({ request, locals: { supabase, user } }) => {
    // フォームデータを取得する。
    const form = await superValidate(request, zod(formSchema));

    // フォームデータが不正な場合は、エラーを返す。
    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    // ユーザーがログインしていない場合は、ログインページにリダイレクトする。
    if (!user) {
      return redirect(303, '/login');
    }

    // URLからYouTubeの動画IDを抽出する。
    const videoId = extractVideoId(form.data.url);

    // 動画IDが抽出できない場合は、エラーを返す。
    if (!videoId) {
      return setError(form, 'url', 'YouTubeのURLを入力してください。');
    }

    // 動画IDがすでに保存されているか確認する。
    const { data: existingVideo, error: errorOnFetch } = await fetchVideoByVideoId(
      supabase,
      videoId,
      user.id
    );

    // 動画情報の取得に失敗した場合は、エラーを返す。
    if (errorOnFetch) {
      console.error(errorOnFetch);
      return setError(form, 'url', '動画の取得に失敗しました。');
    }

    // 動画IDがすでに保存されている場合は、エラーを返す。
    if (existingVideo) {
      return setError(form, 'url', 'この動画はすでに追加されています。');
    }

    // YouTubeの動画情報を取得する。
    let videoList;

    try {
      videoList = await fetchVideoInfo(videoId);
    } catch (error) {
      console.error(error);
      return setError(form, 'url', '動画情報の取得に失敗しました。');
    }

    // YouTubeの動画情報が取得できない場合は、エラーを返す。
    if (videoList.pageInfo.totalResults === 0) {
      return setError(form, 'url', '動画情報が存在しません。');
    }

    const videoInfo = videoList.items[0];

    // 動画を保存する。
    const { error: errorOnSave } = await saveVideo(supabase, {
      video_id: videoInfo.id,
      title: videoInfo.snippet.title,
      channel_id: videoInfo.snippet.channelId,
      channel_title: videoInfo.snippet.channelTitle,
      thumbnail: videoInfo.snippet.thumbnails.medium.url,
      description: videoInfo.snippet.description,
      tags: videoInfo.snippet.tags || [],
      published_at: videoInfo.snippet.publishedAt,
      view_count: Number(videoInfo.statistics?.viewCount) || 0,
      user_id: user.id
    });

    // 動画の保存に失敗した場合は、エラーを返す。
    if (errorOnSave) {
      console.error(errorOnSave);
      return setError(form, 'url', '動画の追加に失敗しました。');
    }

    return message(form, '動画を追加しました!');
  }
};
