import type { YearlyPayslip } from '$lib/types/payslip';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data, error: errorOnRpc } = await supabase
    .rpc('get_yearly_payslip')
    .overrideTypes<Array<YearlyPayslip>, { merge: false }>();

  if (errorOnRpc) {
    console.error(errorOnRpc);
    error(500);
  }

  return {
    count: (data ?? []).length,
    payslipList: data ?? []
  };
};
