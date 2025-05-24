import { YOUTUBE_API_KEY } from '$env/static/private';
import { AppError } from '$lib/utils';
import type { YoutubeVideoListResource } from './type';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

/**
 * YouTube Data APIを使用して動画情報を取得する。
 * @param id YouTubeの動画ID
 * @returns
 */
export const fetchVideoInfo = async (id: string): Promise<YoutubeVideoListResource> => {
  const query = new URLSearchParams({
    part: 'snippet,statistics',
    id: id,
    key: YOUTUBE_API_KEY
  });

  const response = await fetch(`${YOUTUBE_API_URL}?${query}`);

  const responseText = await response.text();

  if (!response.ok) {
    throw new AppError(`YouTube Data APIでエラー ${response.status} ${responseText}`);
  }

  return JSON.parse(responseText);
};
