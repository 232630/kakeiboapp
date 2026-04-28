import { Transaction } from '../types';

function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function linReg(values: number[]) {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] ?? 0 };
  const xm = (n - 1) / 2;
  const ym = values.reduce((s, v) => s + v, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xm) * (values[i] - ym);
    den += (i - xm) ** 2;
  }
  const slope = den ? num / den : 0;
  return { slope, intercept: ym - slope * xm };
}

export interface PredictionPoint {
  month: string;
  label: string;
  actual?: number;
  predicted?: number;
}

export interface AssetPoint {
  month: string;
  label: string;
  balance?: number;
  projected?: number;
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-');
  return `${y}/${m}`;
}

export function getPredictions(transactions: Transaction[], futureMonths = 3): PredictionPoint[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const monthMap = new Map<string, number>();
  for (const t of expenses) {
    const m = t.date.slice(0, 7);
    monthMap.set(m, (monthMap.get(m) ?? 0) + t.amount);
  }
  const months = [...monthMap.keys()].sort();
  if (months.length === 0) return [];

  const values = months.map(m => monthMap.get(m)!);
  const { slope, intercept } = linReg(values);
  const lastMonth = months[months.length - 1];

  const actual: PredictionPoint[] = months.map(m => ({
    month: m,
    label: monthLabel(m),
    actual: monthMap.get(m),
  }));

  const predicted: PredictionPoint[] = Array.from({ length: futureMonths }, (_, i) => {
    const fm = addMonths(lastMonth, i + 1);
    return {
      month: fm,
      label: monthLabel(fm),
      predicted: Math.max(0, Math.round(intercept + slope * (months.length + i))),
    };
  });

  return [...actual, ...predicted];
}

export function getAssetTrend(transactions: Transaction[], futureMonths = 3): AssetPoint[] {
  const monthMap = new Map<string, { income: number; expense: number }>();
  for (const t of transactions) {
    const m = t.date.slice(0, 7);
    const cur = monthMap.get(m) ?? { income: 0, expense: 0 };
    if (t.type === 'income') cur.income += t.amount;
    else cur.expense += t.amount;
    monthMap.set(m, cur);
  }
  const months = [...monthMap.keys()].sort();
  if (months.length === 0) return [];

  let running = 0;
  const actual: AssetPoint[] = months.map(m => {
    const { income, expense } = monthMap.get(m)!;
    running += income - expense;
    return { month: m, label: monthLabel(m), balance: running };
  });

  const recent = months.slice(-3);
  const avgNet = recent.reduce((s, m) => {
    const { income, expense } = monthMap.get(m)!;
    return s + (income - expense);
  }, 0) / recent.length;

  const lastMonth = months[months.length - 1];
  const lastBalance = running;

  const projected: AssetPoint[] = Array.from({ length: futureMonths }, (_, i) => {
    const fm = addMonths(lastMonth, i + 1);
    return {
      month: fm,
      label: monthLabel(fm),
      projected: Math.round(lastBalance + avgNet * (i + 1)),
    };
  });

  // Connect projected to last actual point
  if (projected.length > 0) {
    actual[actual.length - 1] = {
      ...actual[actual.length - 1],
      projected: lastBalance,
    };
  }

  return [...actual, ...projected];
}
