import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import { Transaction } from '../types';
import { getPredictions } from '../utils/prediction';

const fmt = (v: number) => `¥${v.toLocaleString('ja-JP')}`;

const ActualBar = (props: any) => {
  const { x, y, width, height } = props;
  if (!height || height <= 0) return null;
  return (
    <rect x={x} y={y} width={width} height={Math.max(height, 0)}
      fill="url(#barActual)" rx={5} />
  );
};

const PredictedBar = (props: any) => {
  const { x, y, width, height } = props;
  if (!height || height <= 0) return null;
  return (
    <rect x={x} y={y} width={width} height={Math.max(height, 0)}
      fill="rgba(34,211,238,0.12)"
      stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="5 3"
      rx={5} />
  );
};

interface Props { transactions: Transaction[] }

export function FuturePrediction({ transactions }: Props) {
  const data = getPredictions(transactions, 3);
  const predicted = data.filter(d => d.predicted !== undefined);
  const lastActual = data.filter(d => d.actual !== undefined).slice(-1)[0];

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-group">
          <span className="card-icon">◈</span>
          <h2>支出未来予測</h2>
        </div>
        <span className="badge-ai">AI · 線形回帰</span>
      </div>
      <p className="card-desc">過去の支出トレンドから今後3ヶ月を予測します</p>

      {data.length < 2 ? (
        <p className="no-data">2ヶ月以上のデータが必要です</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={4}>
              <defs>
                <linearGradient id="barActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#4f46e5" />
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
                formatter={(v: number, name: string) => [fmt(v), name === 'actual' ? '実績' : '予測（AI）']}
              />
              <Legend
                formatter={v => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v === 'actual' ? '実績' : '予測（AI）'}</span>}
              />
              <Bar dataKey="actual" name="actual" maxBarSize={44} shape={<ActualBar />} />
              <Bar dataKey="predicted" name="predicted" maxBarSize={44} shape={<PredictedBar />} />
            </ComposedChart>
          </ResponsiveContainer>

          {predicted.length > 0 && (
            <div className="pred-row">
              {predicted.map(d => {
                const diff = lastActual?.actual ? d.predicted! - lastActual.actual : 0;
                const pct = lastActual?.actual ? (diff / lastActual.actual * 100).toFixed(1) : null;
                return (
                  <div key={d.month} className="pred-card">
                    <span className="pred-month">{d.label} 予測</span>
                    <span className="pred-amount">{fmt(d.predicted!)}</span>
                    {pct && (
                      <span className={`pred-diff ${diff > 0 ? 'up' : 'down'}`}>
                        {diff > 0 ? '▲' : '▼'} {Math.abs(+pct)}% 前月比
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
