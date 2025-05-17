import type { PayslipRow } from '$lib/types/payslip';
import { error, type RequestHandler } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  id: z.coerce.number().int(),
  format: z.enum(['csv', 'json']).optional()
});

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(schema));

  if (!params.valid) {
    console.error(params.errors);
    error(400);
  }

  let query = supabase.from('payslips').select('*').eq('id', params.data.id);

  const { data, error: errorOnSelect } =
    params.data.format === 'csv'
      ? await query.csv()
      : await query.maybeSingle().overrideTypes<PayslipRow, { merge: false }>();

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500);
  }

  if (!data) {
    error(404, 'Not Found');
  }

  const body = typeof data === 'string' ? data : JSON.stringify(data);

  const filename =
    params.data.format === 'csv'
      ? `${params.data.id}_payslip.csv`
      : `${params.data.id}_payslip.json`;

  return new Response(body, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': params.data.format === 'csv' ? 'text/csv' : 'application/json'
    }
  });
};
