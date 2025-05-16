import { error, type RequestHandler } from '@sveltejs/kit';
import { fetchPayslip, fetchPayslipCsv, validateSearchParams } from '..';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const result = validateSearchParams(url.searchParams);

  if (!result.success) {
    error(400);
  }

  const {
    since,
    until,
    data: { month: yyyyMM, contentType }
  } = result;

  const { data } =
    contentType === 'csv'
      ? await fetchPayslipCsv(supabase, since, until)
      : await fetchPayslip(supabase, since, until);

  const body = typeof data === 'string' ? data : JSON.stringify(data);

  const filename = contentType === 'csv' ? `${yyyyMM}_payslip.csv` : `${yyyyMM}_payslip.json`;

  return new Response(body, {
    headers: {
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': contentType === 'csv' ? 'text/csv' : 'application/json'
    }
  });
};
