import { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  month: string;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, month, onDelete }: Props) {
  const filtered = transactions
    .filter((t) => t.date.startsWith(month))
    .sort((a, b) => b.date.localeCompare(a.date));

  if (filtered.length === 0) {
    return (
      <div className="transaction-list">
        <h2>取引履歴</h2>
        <p className="no-data">この月の記録がありません</p>
      </div>
    );
  }

  return (
    <div className="transaction-list">
      <h2>取引履歴</h2>
      <ul>
        {filtered.map((t) => (
          <li key={t.id} className={`tx-item ${t.type}`}>
            <div className="tx-left">
              <span className="tx-date">{t.date}</span>
              <span className="tx-category">{t.category}</span>
              {t.memo && <span className="tx-memo">{t.memo}</span>}
            </div>
            <div className="tx-right">
              <span className="tx-amount">
                {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString('ja-JP')}
              </span>
              <button
                className="delete-btn"
                onClick={() => onDelete(t.id)}
                title="削除"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
