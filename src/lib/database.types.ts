export type YoutubeVideo = {
  id: number;
  created_at: string;
  updated_at: string;
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
