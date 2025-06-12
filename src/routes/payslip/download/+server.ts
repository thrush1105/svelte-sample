import { error, json, type RequestHandler } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const schema = z.object({
  id: z.coerce.number({ message: '整数を指定してください' }).int(),
  format: z.enum(['csv', 'json'], { message: 'csvまたはjsonを指定してください' }).optional()
});

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(schema));

  if (!params.valid) {
    console.error(params.errors);
    return json({ message: 'エラーが発生しました', errors: params.errors }, { status: 400 });
  }

  let query = supabase.from('payslips').select('*').eq('id', params.data.id);

  const { data, error: errorOnSelect } =
    params.data.format === 'csv' ? await query.csv() : await query.maybeSingle();

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500, `エラーが発生しました: ${errorOnSelect.code}`);
  }

  if (!data) {
    error(404, 'データが見つかりません');
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
