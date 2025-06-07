import { z } from 'zod';

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, { message: '8文字以上入力してください' }),
    newPassword: z.string().min(8, { message: '8文字以上入力してください' }),
    confirmPassword: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({
        path: ['newPassword'],
        code: z.ZodIssueCode.custom,
        message: '新しいパスワードは現在のパスワードと異なる必要があります'
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ['confirmPassword'],
        code: z.ZodIssueCode.custom,
        message: '新しいパスワード（確認用）が新しいパスワードと一致しません'
      });
    }
  });

export type UpdatePasswordSchema = typeof updatePasswordSchema;
