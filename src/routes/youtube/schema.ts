import { z } from 'zod';

export const paramsSchema = z.object({
  q: z.string().optional(),
  sort: z.string().optional().default('-created_at')
});

export type ParamsSchema = typeof paramsSchema;

export const formSchema = z.object({
  url: z.string().url({ message: 'URLを入力してください。' })
});

export type FormSchema = typeof formSchema;
