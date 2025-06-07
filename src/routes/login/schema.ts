import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().email('メールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上です')
});

export type LoginFormSchema = typeof loginFormSchema;
