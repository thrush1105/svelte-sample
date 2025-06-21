import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data, error: errorOnRpc } = await supabase.rpc('get_yearly_payslip');

  if (errorOnRpc) {
    console.error(errorOnRpc);
    error(500, `エラーが発生しました: ${errorOnRpc.code}`);
  }

  return {
    total: (data ?? []).length,
    payslipList: data ?? []
  };
};
