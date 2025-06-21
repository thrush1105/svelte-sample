import { error, fail } from '@sveltejs/kit';
import { addMonths, format, parse } from 'date-fns';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { deletePayslipFormSchema } from './schema';

const loadSchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .catch(format(new Date(), 'yyyy-MM'))
});

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const params = await superValidate(url.searchParams, zod(loadSchema));

  if (!params.valid) {
    console.error(params.errors);
    error(400, 'エラーが発生しました');
  }

  const { month } = params.data;

  const date = parse(month, 'yyyy-MM', new Date());
  const since = format(date, 'yyyy-MM-dd');
  const until = format(addMonths(date, 1), 'yyyy-MM-dd');

  const { data, error: errorOnSelect } = await supabase
    .from('payslips')
    .select('*')
    .gte('payment_date', since)
    .lt('payment_date', until)
    .order('payment_date');

  if (errorOnSelect) {
    console.error(errorOnSelect);
    error(500, `エラーが発生しました: ${errorOnSelect.code}`);
  }

  return {
    params: params.data,
    total: (data ?? []).length,
    payslipList: (data ?? []).map((p) => {
      return {
        id: p.id,
        date: p.payment_date,
        type: p.type === 'salary' ? '給与' : p.type === 'bonus' ? '賞与' : '',
        earnings: {
          items: [
            { label: '基本給', value: p.basic_salary },
            { label: '地域手当', value: p.area_allowance },
            { label: '通勤手当', value: p.commutation_allowance },
            { label: '残業手当', value: p.overtime_allowance },
            { label: '奨励金', value: p.incentive }
          ],
          total: { label: '総支給額', value: p.total_earnings }
        },
        deductions: {
          items: [
            { label: '健康保険', value: p.health_insurance },
            { label: '介護保険', value: p.long_term_care_insurance },
            { label: '厚生年金', value: p.employees_pension },
            { label: '雇用保険', value: p.employment_insurance },
            { label: '所得税', value: p.income_tax },
            { label: '住民税', value: p.resident_tax },
            { label: '年調過不足', value: p.year_end_adjustment },
            { label: '定額減税', value: p.flat_amount_cut }
          ],
          total: { label: '控除合計', value: p.total_deductions }
        },
        netPay: {
          items: [{ label: '差引支給額', value: p.net_pay }]
        }
      };
    })
  };
};

export const actions: Actions = {
  delete: async ({ request, locals: { supabase } }) => {
    const form = await superValidate(request, zod(deletePayslipFormSchema));

    if (!form.valid) {
      console.error(form.errors);
      return fail(400, { form });
    }

    const { count } = await supabase
      .from('payslips')
      .select('*', { count: 'exact', head: true })
      .eq('id', form.data.id)
      .throwOnError();

    if (count !== 1) {
      error(400, '動画が存在しません');
    }

    await supabase.from('payslips').delete().eq('id', form.data.id).throwOnError();

    return message(form, '動画を削除しました');
  }
};
