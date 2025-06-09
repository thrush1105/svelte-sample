import { z } from 'zod';

export const searchVideosFormSchema = z.object({
  q: z.string().optional(),
  sort: z
    .enum([
      '-created_at',
      'created_at',
      '-published_at',
      'published_at',
      'view_count',
      '-view_count'
    ])
    .optional()
    .default('-created_at')
});

export const addVideoFormSchema = z.object({
  url: z.string().url({ message: 'URLを入力してください' })
});

export type AddVideoFormSchema = typeof addVideoFormSchema;

export const updateVideoFormSchema = z.object({
  videoId: z.string()
});

export type UpdateVideoFormSchema = typeof updateVideoFormSchema;

export const deleteVideoFormSchema = z.object({
  id: z.coerce.number()
});

export type DeleteVideoFormSchema = typeof deleteVideoFormSchema;
