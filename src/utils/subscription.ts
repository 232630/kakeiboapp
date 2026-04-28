import { Transaction } from '../types';

export interface Subscription {
  id: string;
  category: string;
  name: string;
  amount: number;
  count: number;
  lastDate: string;
}

export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  const expenses = transactions.filter(t => t.type === 'expense');
  const groups = new Map<string, Transaction[]>();

  for (const t of expenses) {
    const memoKey = t.memo.trim().toLowerCase().slice(0, 20);
    const key = `${t.category}::${memoKey}`;
    const list = groups.get(key) ?? [];
    list.push(t);
    groups.set(key, list);
  }

  const result: Subscription[] = [];

  for (const [key, txs] of groups) {
    if (txs.length < 2) continue;
    const sorted = [...txs].sort((a, b) => a.date.localeCompare(b.date));
    const amounts = sorted.map(t => t.amount);
    const avg = amounts.reduce((s, v) => s + v, 0) / amounts.length;
    const allSimilar = amounts.every(a => Math.abs(a - avg) / avg < 0.15);
    if (!allSimilar) continue;

    const [category] = key.split('::');
    result.push({
      id: key,
      category,
      name: sorted[0].memo || category,
      amount: Math.round(avg),
      count: txs.length,
      lastDate: sorted[sorted.length - 1].date,
    });
  }

  return result.sort((a, b) => b.amount - a.amount);
}
