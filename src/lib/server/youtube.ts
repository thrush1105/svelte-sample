import { GOOGLE_API_KEY } from '$env/static/private';
import { AppError } from '$lib/errors';
import { parseStringToInt } from '$lib/utils';
import { google } from 'googleapis';
import { supabase } from './supabaseClient';

const youtube = google.youtube({
  version: 'v3',
  auth: GOOGLE_API_KEY
});

export const fetchYoutubeVideoInfo = async (videoId: string) => {
  const res = await youtube.videos.list({
    part: ['snippet', 'statistics'],
    id: [videoId]
  });

  return res.data.items ?? [];
};

export const extractYoutubeVideoId = (url: string): string | null => {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const saveVideoWithUrl = async (userId: string, url: string) => {
  const videoId = extractYoutubeVideoId(url);

  if (!videoId) {
    throw new AppError('YouTubeのURLを入力してください');
  }

  const { count, error: errorOnSelect } = await supabase
    .from('youtube_videos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('video_id', videoId);

  if (errorOnSelect) {
    console.error(errorOnSelect);
    throw new AppError(`エラーが発生しました: ${errorOnSelect.code}`);
  }

  if (count) {
    throw new AppError('この動画はすでに追加されています');
  }

  let videoList;

  try {
    videoList = await fetchYoutubeVideoInfo(videoId);
  } catch (error) {
    console.error(error);
    throw new AppError('動画情報の取得に失敗しました');
  }

  if (videoList.length === 0) {
    throw new AppError('動画情報が存在しません');
  }

  const videoInfo = videoList[0];

  const { data: video, error: errorOnInsert } = await supabase
    .from('youtube_videos')
    .insert({
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
    })
    .select()
    .single();

  if (errorOnInsert) {
    console.error(errorOnInsert);
    throw new AppError(`エラーが発生しました: ${errorOnInsert.code}`);
  }

  return video;
};

export const updateVideo = async (userId: string, videoId: string) => {
  let videoList;

  const { count, error: errorOnSelect } = await supabase
    .from('youtube_videos')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('video_id', videoId);

  if (errorOnSelect) {
    console.error(errorOnSelect);
    throw new AppError(`エラーが発生しました: ${errorOnSelect.code}`);
  }

  if (!count) {
    throw new AppError('この動画は追加されていません');
  }

  try {
    videoList = await fetchYoutubeVideoInfo(videoId);
  } catch (error) {
    console.error(error);
    throw new AppError('動画情報の取得に失敗しました');
  }

  if (videoList.length === 0) {
    throw new AppError('動画情報が存在しません');
  }

  const videoInfo = videoList[0];

  const { data: video, error: errorOnUpdate } = await supabase
    .from('youtube_videos')
    .update({
      updated_at: new Date().toUTCString(),
      title: videoInfo.snippet?.title ?? '',
      channel_id: videoInfo.snippet?.channelId ?? '',
      channel_title: videoInfo.snippet?.channelTitle ?? '',
      thumbnail: videoInfo.snippet?.thumbnails?.medium?.url,
      description: videoInfo.snippet?.description,
      tags: videoInfo.snippet?.tags,
      published_at: videoInfo.snippet?.publishedAt,
      view_count: parseStringToInt(videoInfo.statistics?.viewCount)
    })
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .select()
    .single();

  if (errorOnUpdate) {
    console.error(errorOnUpdate);
    throw new AppError(`エラーが発生しました: ${errorOnUpdate.code}`);
  }

  return video;
};
