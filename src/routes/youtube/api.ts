import type { Infer } from 'sveltekit-superforms';
import type { ParamsSchema } from './schema';
import type { Video, VideoRow } from './type';

const tableName = 'youtube_videos';

/**
 * 動画のリストを取得する。
 * @param params クエリパラメータ
 * @returns Promise<VideoRow[]> 動画のリスト
 */
export const fetchVideos = async (
  supabase: App.Locals['supabase'],
  params: Infer<ParamsSchema>,
  userId: string
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
  }

  return query
    .order('created_at', { ascending: false })
    .overrideTypes<Array<VideoRow>, { merge: false }>();
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
    .overrideTypes<VideoRow>();
};

/**
 * 動画を保存する。
 * @param value 保存する値
 * @returns Promise<VideoRow> 保存した動画
 */
export const saveVideo = async (supabase: App.Locals['supabase'], value: Video) => {
  return supabase.from(tableName).insert(value).select().single().overrideTypes<VideoRow>();
};

/**
 * 動画を更新する。
 * @param id ID
 * @param value 更新する値
 * @returns Promise<VideoRow> 更新した動画
 */
export const updateVideo = async (supabase: App.Locals['supabase'], id: number, value: Video) => {
  return supabase
    .from(tableName)
    .update(value)
    .eq('id', id)
    .select()
    .single()
    .overrideTypes<VideoRow>();
};

/**
 * 動画を削除する。
 * @param id ID
 * @returns Promise<void>
 */
export const deleteVideo = async (supabase: App.Locals['supabase'], id: number) => {
  return supabase.from(tableName).delete().eq('id', id);
};
