import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  month: string;
  onMonthChange: (m: string) => void;
}

export function MonthlySummary({ transactions, month, onMonthChange }: Props) {
  const filtered = transactions.filter((t) => t.date.startsWith(month));
  const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  function fmt(n: number) {
    return n.toLocaleString('ja-JP');
  }

  function changeMonth(delta: number) {
    const [y, m] = month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    onMonthChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  return (
    <div className="monthly-summary">
      <div className="month-nav">
        <button onClick={() => changeMonth(-1)}>‹</button>
        <span className="month-label">{month.replace('-', '年')}月</span>
        <button onClick={() => changeMonth(1)}>›</button>
      </div>
      <div className="summary-cards">
        <div className="card income-card">
          <span className="card-label">収入</span>
          <span className="card-value">¥{fmt(income)}</span>
        </div>
        <div className="card expense-card">
          <span className="card-label">支出</span>
          <span className="card-value">¥{fmt(expense)}</span>
        </div>
        <div className={`card balance-card ${balance >= 0 ? 'positive' : 'negative'}`}>
          <span className="card-label">残高</span>
          <span className="card-value">¥{fmt(balance)}</span>
        </div>
      </div>
    </div>
  );
}
