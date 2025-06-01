import { AppError } from '$lib/errors';
import logger from '$lib/logger';
import { supabase } from '$lib/server/supabaseClient';
import { fetchVideoInfo } from '$lib/server/youtubeDataApi';
import { parseStringToInt } from '$lib/utils';
import { saveVideo, selectVideoByVideoId } from '../../routes/youtube/api';

export type YoutubeVideo = {
  Row: {
    id: number;
    created_at: string;
    updated_at: string;
    video_id: string;
    title: string;
    channel_id: string;
    channel_title: string;
    thumbnail: string | null;
    description: string | null;
    tags: string[] | null;
    published_at: string | null;
    view_count: number | null;
    user_id: string | null;
  };
  Insert: {
    video_id: string;
    title: string;
    channel_id: string;
    channel_title: string;
    thumbnail?: string | null;
    description?: string | null;
    tags?: string[] | null;
    published_at?: string | null;
    view_count?: number | null;
    user_id: string | null;
  };
  Update: {
    updated_at: string;
    video_id?: string;
    title?: string;
    channel_id?: string;
    channel_title?: string;
    thumbnail?: string | null;
    description?: string | null;
    tags?: string[] | null;
    published_at?: string | null;
    view_count?: number | null;
  };
};

export const extractYoutubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const saveVideoWithUrl = async (
  supabase: App.Locals['supabase'],
  userId: string,
  url: string
) => {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    throw new AppError('URLが不正です。');
  }

  const { data: existingVideo, error: errorOnFetch } = await selectVideoByVideoId(
    supabase,
    videoId,
    userId
  );

  if (errorOnFetch) {
    console.error(errorOnFetch);
    throw new AppError(`エラーが発生しました: ${errorOnFetch.code}`);
  }

  if (existingVideo) {
    throw new AppError('この動画はすでに追加されています。');
  }

  let videoList;

  try {
    videoList = await fetchVideoInfo(videoId);
  } catch (error) {
    throw new AppError('動画情報の取得に失敗しました。');
  }

  if (videoList.length === 0) {
    throw new AppError('動画情報が存在しません。');
  }

  const videoInfo = videoList[0];

  const { data: video, error: errorOnSave } = await saveVideo(supabase, {
    video_id: videoInfo.id ?? '',
    title: videoInfo.snippet?.title ?? '',
    channel_id: videoInfo.snippet?.channelId ?? '',
    channel_title: videoInfo.snippet?.channelTitle ?? '',
    thumbnail: videoInfo.snippet?.thumbnails?.medium?.url,
    description: videoInfo.snippet?.description,
    tags: videoInfo.snippet?.tags,
    published_at: videoInfo.snippet?.publishedAt,
    view_count: parseStringToInt(videoInfo.statistics?.viewCount),
    user_id: userId
  });

  if (errorOnSave) {
    console.error(errorOnSave);
    throw new AppError(`エラーが発生しました: ${errorOnSave.code}`);
  }

  return video;
};

export const updateVideo = async (id: number, videoId: string) => {
  let videoList;

  try {
    videoList = await fetchVideoInfo(videoId);
  } catch (error) {
    throw new AppError('動画情報の取得に失敗しました。');
  }

  if (videoList.length === 0) {
    throw new AppError('動画情報が存在しません。');
  }

  const videoInfo = videoList[0];

  await supabase
    .from('youtube_videos')
    .update({
      title: videoInfo.snippet?.title ?? '',
      channel_id: videoInfo.snippet?.channelId ?? '',
      channel_title: videoInfo.snippet?.channelTitle ?? '',
      thumbnail: videoInfo.snippet?.thumbnails?.medium?.url,
      description: videoInfo.snippet?.description,
      tags: videoInfo.snippet?.tags,
      published_at: videoInfo.snippet?.publishedAt,
      view_count: parseStringToInt(videoInfo.statistics?.viewCount),
      updated_at: new Date().toUTCString()
    })
    .eq('id', id)
    .throwOnError();
};

export const updateAllVideos = async (userId: string | null | undefined) => {
  if (!userId) {
    return;
  }

  const { data: videos } = await supabase.from('youtube_videos').select().eq('user_id', userId);

  if (!videos) {
    return;
  }

  const len = videos.length;

  for (let i = 0; i < len; i++) {
    const v = videos[i];
    try {
      await updateVideo(v.id, v.video_id);
      logger.info(`動画情報を更新 [${i + 1}/${len}]`, { id: v.id });
    } catch (e) {
      logger.error(`動画情報の更新に失敗 [${i + 1}/${len}]`, { id: v.id });
      logger.error(e);
    } finally {
      await new Promise((r) => setTimeout(r, 500)); // 500ミリ秒待機
    }
  }
};
