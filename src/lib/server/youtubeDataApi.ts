import { GOOGLE_API_KEY } from '$env/static/private';
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: GOOGLE_API_KEY
});

export const fetchVideoInfo = async (videoId: string) => {
  const res = await youtube.videos.list({
    part: ['snippet', 'statistics'],
    id: [videoId]
  });

  return res.data.items ?? [];
};
