import type { Payslip } from '$lib/types/payslip';
import { error } from '@sveltejs/kit';
import { fetchPayslip, validateSearchParams } from '.';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
  const result = validateSearchParams(url.searchParams);

  if (!result.success) {
    error(400);
  }

  const {
    since,
    until,
    data: { month: yyyyMM }
  } = result;

  const { data } = await fetchPayslip(supabase, since, until);

  return {
    month: yyyyMM,
    count: (data ?? []).length,
    payslipList: (data ?? []).map((p) => {
      return {
        date: p.payment_date,
        type: p.type === 'salary' ? '給与' : p.type === 'bonus' ? '賞与' : '',
        earnings: {
          items: [
            { label: '基準給', value: p.basic_salary },
            { label: '地域手当', value: p.area_allowance },
            { label: '割増給', value: p.overtime_allowance },
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
            { label: '住民税', value: p.resident_tax }
          ],
          total: { label: '控除合計', value: p.total_deductions }
        },
        netPay: {
          items: [{ label: '差引支給額', value: p.net_pay }]
        }
      } as Payslip;
    })
  };
};
