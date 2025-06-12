import { z } from 'zod';

export const createPayslipFormSchema = z
  .object({
    id: z.coerce.number().int().optional(),
    paymentDate: z.string().date(), // 支給日
    type: z.enum(['salary', 'bonus']), // 給与/賞与
    basicSalary: z.coerce.number().int().optional(), // 基本給
    areaAllowance: z.coerce.number().int().optional(), // 地域手当
    commutationAllowance: z.coerce.number().int().optional(), // 通勤手当
    overtimeAllowance: z.coerce.number().int().optional(), // 残業手当
    incentive: z.coerce.number().int().optional(), // 奨励金
    totalEarnings: z.coerce.number().int(), // 総支給額
    healthInsurance: z.coerce.number().int().optional(), // 健康保険
    longTermCareInsurance: z.coerce.number().int().optional(), // 介護保険
    employeesPension: z.coerce.number().int().optional(), // 厚生年金
    employmentInsurance: z.coerce.number().int().optional(), // 雇用保険
    incomeTax: z.coerce.number().int().optional(), // 所得税
    residentTax: z.coerce.number().int().optional(), // 住民税
    yearEndAdjustment: z.coerce.number().int().optional(), // 年調過不足
    flatAmountCut: z.coerce.number().int().optional(), // 定額減税
    totalDeductions: z.coerce.number().int(), // 控除合計
    netPay: z.coerce.number().int() // 差引支給額
  })
  .superRefine((data, ctx) => {
    if (
      (data.basicSalary ?? 0) +
        (data.areaAllowance ?? 0) +
        (data.commutationAllowance ?? 0) +
        (data.overtimeAllowance ?? 0) +
        (data.incentive ?? 0) !==
      data.totalEarnings
    ) {
      ctx.addIssue({
        path: ['totalEarnings'],
        code: z.ZodIssueCode.custom,
        message: '総支給額が正しくありません'
      });
    }

    if (
      (data.healthInsurance ?? 0) +
        (data.longTermCareInsurance ?? 0) +
        (data.employeesPension ?? 0) +
        (data.employmentInsurance ?? 0) +
        (data.incomeTax ?? 0) +
        (data.residentTax ?? 0) +
        (data.yearEndAdjustment ?? 0) +
        (data.flatAmountCut ?? 0) !==
      data.totalDeductions
    ) {
      ctx.addIssue({
        path: ['totalDeductions'],
        code: z.ZodIssueCode.custom,
        message: '控除合計が正しくありません'
      });
    }

    if (data.totalEarnings - data.totalDeductions !== data.netPay) {
      ctx.addIssue({
        path: ['netPay'],
        code: z.ZodIssueCode.custom,
        message: '差引支給額が正しくありません'
      });
    }
  });

export type CreatePayslipFormSchema = typeof createPayslipFormSchema;

export const deletePayslipFormSchema = z.object({
  id: z.coerce.number().int()
});

export type DeletePayslipFormSchema = typeof deletePayslipFormSchema;
