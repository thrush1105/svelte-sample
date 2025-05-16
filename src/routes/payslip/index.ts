import type { PayslipRow } from '$lib/types/payslip';
import { error } from '@sveltejs/kit';
import { addMonths, format } from 'date-fns';
import { z } from 'zod';

export const fetchQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/) // yyyy-MM
    .optional()
    .transform((v) => {
      return v || format(new Date(), 'yyyy-MM');
    }),
  contentType: z.enum(['json', 'csv']).optional()
});

export const validateSearchParams = (searchParams: URLSearchParams) => {
  const params = Object.fromEntries(searchParams.entries());
  const result = fetchQuerySchema.safeParse(params);

  if (!result.success) {
    return result;
  }

  const { month: yyyyMM } = result.data;

  const year = parseInt(yyyyMM.substring(0, 4));
  const month = parseInt(yyyyMM.substring(5, 7));
  const date = new Date(year, month - 1, 1);

  const since = format(date, 'yyyy-MM-dd');
  const until = format(addMonths(date, 1), 'yyyy-MM-dd'); // 1か月後

  return { ...result, since, until };
};

const buildFetchQuery = (supabase: App.Locals['supabase'], since: string, until: string) => {
  let query = supabase
    .from('payslips')
    .select('*')
    .gte('payment_date', since)
    .lt('payment_date', until);

  return query;
};

export const fetchPayslip = async (
  supabase: App.Locals['supabase'],
  since: string,
  until: string
) => {
  let query = buildFetchQuery(supabase, since, until);

  return await query.overrideTypes<Array<PayslipRow>, { merge: false }>();
};

export const fetchPayslipCsv = async (
  supabase: App.Locals['supabase'],
  since: string,
  until: string
) => {
  let query = buildFetchQuery(supabase, since, until);

  return await query.csv();
};
