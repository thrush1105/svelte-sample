import type YearlyPayslip from '$lib/components/yearly-payslip.svelte';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const contentType = url.searchParams.get('contentType');

  let query = supabase.rpc('get_yearly_payslip');

  const { data } =
    contentType === 'csv'
      ? await query.csv()
      : await query.overrideTypes<Array<YearlyPayslip>, { merge: false }>();

  const body = typeof data === 'string' ? data : JSON.stringify(data);

  const filename = contentType === 'csv' ? 'payslip.csv' : 'payslip.json';

  return new Response(body, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': contentType === 'csv' ? 'text/csv' : 'application/json'
    }
  });
};
