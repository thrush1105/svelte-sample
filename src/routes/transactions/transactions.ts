import type { Tables } from '../../database.types';

export const summarize = (transactions: Tables<'transactions'>[]) => {
  // 収入を合計
  const totalIncome = transactions
    .filter((item) => !item.is_transfer && (item.amount ?? 0) > 0) // 振替でないかつ金額が0より大きい
    .reduce((sum, item) => sum + (item.amount as number), 0);

  // 支出を合計
  const totalSpending = transactions
    .filter((item) => !item.is_transfer && (item.amount ?? 0) < 0) // 振替でないかつ金額が0より小さい
    .reduce((sum, item) => sum + -(item.amount as number), 0);

  // カテゴリーごとに収入を合計
  const incomeByCategory = transactions.reduce<Record<string, number>>((acc, item) => {
    if (item.amount == null || item.amount < 0 || item.category == null || item.is_transfer)
      return acc;
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});

  // カテゴリーごとに支出を合計
  const spendingByCategory = transactions.reduce<Record<string, number>>((acc, item) => {
    if (item.amount == null || item.amount > 0 || item.category == null || item.is_transfer)
      return acc;
    acc[item.category] = (acc[item.category] || 0) + -item.amount;
    return acc;
  }, {});

  // 統計
  const statistics = {
    income: {
      total: totalIncome,
      details: Object.entries(incomeByCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          ratio: Math.round((amount / totalIncome) * 100)
        }))
        .sort((a, b) => b.amount - a.amount)
    },
    spending: {
      total: totalSpending,
      details: Object.entries(spendingByCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          ratio: Math.round((amount / totalSpending) * 100)
        }))
        .sort((a, b) => b.amount - a.amount)
    },
    difference: totalIncome - totalSpending
  };

  return {
    ...statistics
  };
};
