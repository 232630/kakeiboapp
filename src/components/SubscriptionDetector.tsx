import { Transaction } from '../types';
import { detectSubscriptions } from '../utils/subscription';

interface Props { transactions: Transaction[] }

export function SubscriptionDetector({ transactions }: Props) {
  const subs = detectSubscriptions(transactions);
  const monthly = subs.reduce((s, sub) => s + sub.amount, 0);
  const annual = monthly * 12;

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">⟳</span>
          <h2>サブスク・定期支出</h2>
        </div>
        {subs.length > 0 && (
          <div className="sub-totals">
            <div className="sub-total-item">
              <span className="sub-total-label">月額合計</span>
              <span className="sub-total-val">¥{monthly.toLocaleString('ja-JP')}</span>
            </div>
            <div className="sub-total-item">
              <span className="sub-total-label">年間換算</span>
              <span className="sub-total-val annual">¥{annual.toLocaleString('ja-JP')}</span>
            </div>
          </div>
        )}
      </div>
      <p className="card-desc">パターン認識AIが取引履歴から自動検出した定期支出</p>

      {subs.length === 0 ? (
        <div className="no-data-block">
          <span className="no-data-icon">⟳</span>
          <p className="no-data">定期支出が検出されませんでした</p>
          <p className="no-data-hint">同じカテゴリ・金額の支出が2回以上あると自動検出します</p>
        </div>
      ) : (
        <div className="sub-list">
          {subs.map(sub => {
            const isHigh = sub.amount >= 10000;
            return (
              <div key={sub.id} className="sub-item">
                <div className="sub-left">
                  <div className={`sub-dot ${isHigh ? 'high' : ''}`} />
                  <div className="sub-info">
                    <span className="sub-name">{sub.name || sub.category}</span>
                    <span className="sub-meta">
                      {sub.category} · {sub.count}回検出 · 最終: {sub.lastDate}
                    </span>
                  </div>
                </div>
                <div className="sub-right">
                  <span className={`sub-amount ${isHigh ? 'high' : ''}`}>
                    ¥{sub.amount.toLocaleString('ja-JP')}
                  </span>
                  <span className="sub-period">/月</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
