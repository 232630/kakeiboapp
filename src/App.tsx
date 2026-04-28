import { useState } from 'react';
import { useTransactions } from './hooks/useTransactions';
import { TransactionForm } from './components/TransactionForm';
import { MonthlySummary } from './components/MonthlySummary';
import { CategoryChart } from './components/CategoryChart';
import { TransactionList } from './components/TransactionList';
import './App.css';

export default function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions();
  const now = new Date();
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Savvo</h1>
      </header>
      <main className="app-main">
        <aside className="sidebar">
          <TransactionForm onAdd={addTransaction} />
        </aside>
        <section className="content">
          <MonthlySummary
            transactions={transactions}
            month={month}
            onMonthChange={setMonth}
          />
          <CategoryChart transactions={transactions} month={month} />
          <TransactionList
            transactions={transactions}
            month={month}
            onDelete={deleteTransaction}
          />
        </section>
      </main>
    </div>
  );
}
