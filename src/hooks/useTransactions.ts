import { useState, useCallback } from 'react';
import { Transaction } from '../types';
import { loadTransactions, saveTransactions } from '../utils/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions((prev) => {
      const next = [tx, ...prev];
      saveTransactions(next);
      return next;
    });
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveTransactions(next);
      return next;
    });
  }, []);

  return { transactions, addTransaction, deleteTransaction };
}
