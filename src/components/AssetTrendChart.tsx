import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Transaction } from '../types';
import { getAssetTrend } from '../utils/prediction';

const fmt = (v: number) => `¥${v.toLocaleString('ja-JP')}`;

interface Props { transactions: Transaction[] }

export function AssetTrendChart({ transactions }: Props) {
  const data = getAssetTrend(transactions, 3);
  const lastActual = data.filter(d => d.balance !== undefined).slice(-1)[0];
  const hasPositive = lastActual ? lastActual.balance! >= 0 : true;

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">◎</span>
          <h2>総資産推移</h2>
        </div>
        {lastActual && (
          <div className="asset-current">
            <span className="asset-label">現在の純資産</span>
            <span className={`asset-value ${hasPositive ? 'pos' : 'neg'}`}>
              {fmt(lastActual.balance!)}
            </span>
          </div>
        )}
      </div>
      <p className="card-desc">月次純資産（収入 − 支出の累計）と今後3ヶ月の予測推移</p>

      {data.length === 0 ? (
        <p className="no-data">データがありません</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="areaBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="areaProj" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={v => `${Math.round(v / 10000)}万`}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false} tickLine={false} width={46}
            />
            <Tooltip
              contentStyle={{ background: 'rgba(10,6,40,0.96)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 10, fontSize: 13 }}
              labelStyle={{ color: '#c4b5fd', fontWeight: 700 }}
              formatter={(v: number, name: string) => [fmt(v), name === 'balance' ? '純資産' : '予測（AI）']}
            />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 3" />
            <Area
              type="monotone" dataKey="balance" name="balance"
              stroke="#8b5cf6" strokeWidth={2.5}
              fill="url(#areaBalance)" connectNulls
            />
            <Area
              type="monotone" dataKey="projected" name="projected"
              stroke="#22d3ee" strokeWidth={2} strokeDasharray="6 3"
              fill="url(#areaProj)" connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
