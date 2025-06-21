import { format } from 'date-fns';
import { z as z3 } from 'zod/v3';
import { z as z4 } from 'zod/v4';

export const loadSchema = z4.object({
  month: z4
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .catch(format(new Date(), 'yyyy-MM'))
});

export const searchSchema = z4.object({
  q: z4.string().optional(),
  category: z4.string().optional().default(''),
  since: z4.iso.date().optional().default(''),
  until: z4.iso.date().optional().default(''),
  sort: z4.enum(['oldest', 'newest']).optional().default('oldest')
});

export type SearchParams = z4.infer<typeof searchSchema>;

export const csvSchema = z4
  .tuple([
    z4.string(),
    z4.iso.date('日付を入力してください'),
    z4.coerce.number('整数値を入力してください').int('整数値を入力してください'),
    z4.string(),
    z4.string(),
    z4.stringbool('真偽値を入力してください')
  ])
  .transform(([service, date, amount, category, description, isTransfer]) => ({
    service,
    date,
    category,
    amount,
    description,
    isTransfer
  }));

export type Transaction = z4.infer<typeof csvSchema>;

export const addFormSchame = z4
  .object({
    service: z4.string(),
    date: z4.iso.date('日付を入力してください'),
    amount: z4.int('整数値を入力してください'),
    category: z4.string(),
    description: z4.string(),
    isTransfer: z4.boolean()
  })
  .array();

export const editFormSchame = z3.object({
  id: z3.coerce.number().int(),
  service: z3.string(),
  date: z3.string().date(),
  amount: z3.coerce.number().int(),
  category: z3.string(),
  description: z3.string(),
  isTransfer: z3.coerce.boolean()
});

export const deleteFormSchame = z3.object({
  id: z3.coerce.number().int()
});
