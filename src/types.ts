export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  amount: number;
  memo: string;
}

export const INCOME_CATEGORIES = ['給与', '副業', '投資', 'その他収入'] as const;
export const EXPENSE_CATEGORIES = [
  '食費',
  '住居費',
  '交通費',
  '光熱費',
  '通信費',
  '医療費',
  '娯楽費',
  '衣服費',
  '教育費',
  'その他支出',
] as const;
