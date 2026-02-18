import React, { useMemo, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Header } from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import '@/App.css';

function App() {
  const [transactions, setTransactions] = useLocalStorage('expense-tracker-transactions', []);
  const [currency, setCurrency] = useLocalStorage('expense-tracker-currency', 'INR');
  const [darkMode, setDarkMode] = useLocalStorage('expense-tracker-dark-mode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAddTransaction = (transaction) => {
    setTransactions([{ ...transaction, currency }, ...transactions]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const { balance, totalIncome, totalExpense } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense
    };
  }, [transactions]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <Header 
          currency={currency}
          onCurrencyChange={setCurrency}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <div className="space-y-8 mt-8">
          <SummaryCards 
            balance={balance}
            income={totalIncome}
            expense={totalExpense}
            currency={currency}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 lg:col-span-3">
              <TransactionForm 
                onAddTransaction={handleAddTransaction}
                currency={currency}
              />
            </div>
            
            <div className="md:col-span-8 lg:col-span-9">
              <TransactionList 
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
                currency={currency}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;