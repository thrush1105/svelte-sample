export type Video = {
  video_id: string;
  title: string;
  channel_id: string;
  channel_title: string;
  thumbnail: string;
  description: string;
  tags: string[];
  published_at: string;
  view_count: number;
  user_id: string;
};

export type YoutubeVideoResource = {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<string, { url: string; width: number; height: number }>;
    channelTitle: string;
    tags?: string[];
    categoryId?: string;
    localized?: {
      title: string;
      description: string;
    };
  };
  statistics?: {
    viewCount?: number | null;
    likeCount?: number | null;
    dislikeCount?: number | null;
    favoriteCount?: number | null;
    commentCount?: number | null;
  };
};

export type YoutubeVideoListResource = {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeVideoResource[];
};
