import { addMonths, format, subMonths } from 'date-fns';

export const getPreviousMonth = (ym: string) => {
  const [year, month] = ym.split('-').map(Number);
  const date = new Date(year, month - 1);
  return format(subMonths(date, 1), 'yyyy-MM');
};

export const getNextMonth = (ym: string) => {
  const [year, month] = ym.split('-').map(Number);
  const date = new Date(year, month - 1);
  return format(addMonths(date, 1), 'yyyy-MM');
};
