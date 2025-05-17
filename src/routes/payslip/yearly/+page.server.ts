import type { YearlyPayslip } from '$lib/types/payslip';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data } = await supabase
    .rpc('get_yearly_payslip')
    .overrideTypes<Array<YearlyPayslip>, { merge: false }>();

  return {
    count: (data ?? []).length,
    payslipList: data ?? []
  };
};
