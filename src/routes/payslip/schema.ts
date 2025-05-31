import { z } from 'zod';

const int = z.coerce.number().int().optional();

export const formSchema = z.object({
  id: int,
  paymentDate: z.string().date(), // 支給日
  type: z.enum(['salary', 'bonus']), // 給与/賞与
  basicSalary: int, // 基本給
  areaAllowance: int, // 地域手当
  commutationAllowance: int, // 通勤手当
  overtimeAllowance: int, // 残業手当
  incentive: int, // 奨励金
  totalEarnings: int, // 総支給額
  healthInsurance: int, // 健康保険
  longTermCareInsurance: int, // 介護保険
  employeesPension: int, // 厚生年金
  employmentInsurance: int, // 雇用保険
  incomeTax: int, // 所得税
  residentTax: int, // 住民税
  yearEndAdjustment: int, // 年調過不足
  flatAmountCut: int, // 定額減税
  totalDeductions: int, // 控除合計
  netPay: int // 差引支給額
});

export type FormSchema = typeof formSchema;
