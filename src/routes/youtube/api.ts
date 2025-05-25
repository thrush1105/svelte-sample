import * as Database from '$lib/database.types';
import type { Infer } from 'sveltekit-superforms';
import type { ParamsSchema } from './schema';
import type { Video } from './type';

const tableName = 'youtube_videos';

/**
 * 動画の件数の件数を取得する。
 * @param params クエリパラメータ
 * @returns Promise<count> 動画の件数
 */
export const countVideos = async (
  supabase: App.Locals['supabase'],
  params: Infer<ParamsSchema>,
  userId: string | undefined
) => {
  let query = supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (params.q)
    query = query.or(
      `title.ilike.%${params.q}%,channel_title.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );

  return query;
};

/**
 * 動画のリストを取得する。
 * @param params クエリパラメータ
 * @returns Promise<YoutubeVideo[]> 動画のリスト
 */
export const fetchVideos = async (
  supabase: App.Locals['supabase'],
  params: Infer<ParamsSchema>,
  userId: string | undefined,
  pageNumber: number = 1
) => {
  let query = supabase.from(tableName).select().eq('user_id', userId);

  if (params.q)
    query = query.or(
      `title.ilike.%${params.q}%,channel_title.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );

  if (params.sort) {
    const sortField = params.sort.startsWith('-') ? params.sort.slice(1) : params.sort;
    const ascending = !params.sort.startsWith('-');
    query = query.order(sortField, { ascending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const perPage = 20;
  const from = 20 * (pageNumber - 1);
  const to = from + perPage - 1;
  query = query.range(from, to);

  return query.overrideTypes<Array<Database.YoutubeVideo>, { merge: false }>();
};

/**
 * 動画IDで動画を取得する。
 */
export const fetchVideoByVideoId = async (
  supabase: App.Locals['supabase'],
  videoId: string,
  userId: string
) => {
  return supabase
    .from(tableName)
    .select()
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .maybeSingle()
    .overrideTypes<Database.YoutubeVideo>();
};

/**
 * 動画を保存する。
 * @param value 保存する値
 * @returns Promise<YoutubeVideo> 保存した動画
 */
export const saveVideo = async (supabase: App.Locals['supabase'], value: Video) => {
  return supabase
    .from(tableName)
    .insert(value)
    .select()
    .single()
    .overrideTypes<Database.YoutubeVideo>();
};

/**
 * 動画を更新する。
 * @param id ID
 * @param value 更新する値
 * @returns Promise<YoutubeVideo> 更新した動画
 */
export const updateVideo = async (supabase: App.Locals['supabase'], id: number, value: Video) => {
  return supabase
    .from(tableName)
    .update(value)
    .eq('id', id)
    .select()
    .single()
    .overrideTypes<Database.YoutubeVideo>();
};

/**
 * 動画を削除する。
 * @param id ID
 * @returns Promise<void>
 */
export const deleteVideo = async (supabase: App.Locals['supabase'], id: number) => {
  return supabase.from(tableName).delete().eq('id', id);
};
