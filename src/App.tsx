import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { TransactionForm } from './components/TransactionForm';
import { MonthlySummary } from './components/MonthlySummary';
import { CategoryChart } from './components/CategoryChart';
import { TransactionList } from './components/TransactionList';
import { StarField } from './components/StarField';
import { FuturePrediction } from './components/FuturePrediction';
import { AssetTrendChart } from './components/AssetTrendChart';
import { SubscriptionDetector } from './components/SubscriptionDetector';
import { AIInsight } from './components/AIInsight';
import './App.css';

type Tab = 'dashboard' | 'prediction' | 'subscriptions' | 'ai';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'dashboard',     icon: '◉', label: 'ダッシュボード' },
  { id: 'prediction',    icon: '◈', label: 'AI予測' },
  { id: 'subscriptions', icon: '⟳', label: 'サブスク' },
  { id: 'ai',            icon: '✦', label: 'AIアドバイス' },
];

export default function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const now = new Date();
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="app">
      <StarField />

      <header className="app-header">
        <div className="header-brand">
          <h1>Savvo</h1>
          <span className="header-sub">AI-POWERED FINANCE</span>
        </div>
        <nav className="tab-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-btn ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className={`app-main ${tab === 'dashboard' ? '' : 'wide'}`}>
        {tab === 'dashboard' && (
          <>
            <aside className="sidebar">
              <TransactionForm onAdd={addTransaction} />
            </aside>
            <section className="content">
              <MonthlySummary transactions={transactions} month={month} onMonthChange={setMonth} />
              <CategoryChart transactions={transactions} month={month} />
              <TransactionList transactions={transactions} month={month} onDelete={deleteTransaction} />
            </section>
          </>
        )}

        {tab === 'prediction' && (
          <section className="content wide-content">
            <FuturePrediction transactions={transactions} />
            <AssetTrendChart transactions={transactions} />
          </section>
        )}

        {tab === 'subscriptions' && (
          <section className="content wide-content">
            <SubscriptionDetector transactions={transactions} />
          </section>
        )}

        {tab === 'ai' && (
          <section className="content wide-content">
            <AIInsight transactions={transactions} month={month} />
          </section>
        )}
      </main>
    </div>
  );
}
