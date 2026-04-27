import { useState } from 'react';
import { Transaction, TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../types';

interface Props {
  onAdd: (tx: Transaction) => void;
}

export function TransactionForm({ onAdd }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeChange(t: TransactionType) {
    setType(t);
    setCategory(t === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (!num || num <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      date,
      type,
      category,
      amount: num,
      memo,
    });
    setAmount('');
    setMemo('');
  }

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <h2>記録を追加</h2>
      <div className="type-toggle">
        <button
          type="button"
          className={type === 'expense' ? 'active expense' : ''}
          onClick={() => handleTypeChange('expense')}
        >
          支出
        </button>
        <button
          type="button"
          className={type === 'income' ? 'active income' : ''}
          onClick={() => handleTypeChange('income')}
        >
          収入
        </button>
      </div>
      <div className="form-row">
        <label>日付</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div className="form-row">
        <label>カテゴリ</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label>金額（円）</label>
        <input
          type="number"
          min="1"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label>メモ</label>
        <input
          type="text"
          placeholder="任意"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
      <button type="submit" className="submit-btn">
        追加
      </button>
    </form>
  );
}
