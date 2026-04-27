import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

const COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#C9CBCF', '#7BC8A4',
  '#E8A838', '#5A9BD4',
];

interface Props {
  transactions: Transaction[];
  month: string;
}

export function CategoryChart({ transactions, month }: Props) {
  const expenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(month)
  );

  const categoryMap = new Map<string, number>();
  for (const t of expenses) {
    categoryMap.set(t.category, (categoryMap.get(t.category) ?? 0) + t.amount);
  }

  const data = Array.from(categoryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="category-chart">
        <h2>支出カテゴリ内訳</h2>
        <p className="no-data">この月の支出データがありません</p>
      </div>
    );
  }

  return (
    <div className="category-chart">
      <h2>支出カテゴリ内訳</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `¥${v.toLocaleString('ja-JP')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
