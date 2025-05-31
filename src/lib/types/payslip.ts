export type PayslipRow = {
  id: number;
  created_at: string;
  user_id: string;
  payment_date: string;
  type: string;
  basic_salary: number;
  area_allowance: number;
  commutation_allowance: number;
  overtime_allowance: number;
  incentive: number;
  total_earnings: number;
  health_insurance: number;
  long_term_care_insurance: number;
  employees_pension: number;
  employment_insurance: number;
  income_tax: number;
  resident_tax: number;
  year_end_adjustment: number;
  flat_amount_cut: number;
  total_deductions: number;
  net_pay: number;
};

export type Payslip = {
  id: number;
  date: string;
  type: string;
  earnings: {
    items: { label: string; value: number }[];
    total: { label: string; value: number };
  };
  deductions: {
    items: { label: string; value: number }[];
    total: { label: string; value: number };
  };
  netPay: {
    items: { label: string; value: number }[];
  };
};

export type YearlyPayslip = {
  year: number;
  basic_salary: number;
  overtime_allowance: number;
  total_earnings: number;
  health_insurance: number;
  employees_pension: number;
  employment_insurance: number;
  income_tax: number;
  resident_tax: number;
  total_deductions: number;
  net_pay: number;
};
