import { Transaction } from '../types';

const KEY = 'kakeibo_transactions';

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(KEY, JSON.stringify(transactions));
}
