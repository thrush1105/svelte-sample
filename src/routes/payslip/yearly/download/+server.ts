import type { YearlyPayslip } from '$lib/types/payslip';
import { error, type RequestHandler } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  format: z.enum(['csv', 'json']).optional()
});

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(schema));

  if (!params.valid) {
    console.error(params.errors);
    error(400);
  }

  let query = supabase.rpc('get_yearly_payslip');

  const { data, error: errorOnSelect } =
    params.data.format === 'csv'
      ? await query.csv()
      : await query.overrideTypes<Array<YearlyPayslip>, { merge: false }>();

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500);
  }

  const body = typeof data === 'string' ? data : JSON.stringify(data);

  const filename = params.data.format === 'csv' ? 'payslip.csv' : 'payslip.json';

  return new Response(body, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': params.data.format === 'csv' ? 'text/csv' : 'application/json'
    }
  });
};
