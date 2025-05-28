import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email({ message: 'メールアドレスを入力してください' }),
  password: z.string().min(8, { message: '8文字以上入力してください' })
});

export type LoginFormSchema = typeof loginFormSchema;
