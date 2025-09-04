
import React, { useState, useMemo } from 'react';
import type { Transaction, Category, Filters, Budget, CurrencyCode } from './types';
import { TransactionType } from './types';
import { DEFAULT_CATEGORIES } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryManager from './components/CategoryManager';
import BudgetManager from './components/BudgetManager';
import { Card } from './components/ui/Card';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
  const [currency, setCurrency] = useLocalStorage<CurrencyCode>('currency', 'INR');
  
  const [isCategoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [isBudgetManagerOpen, setBudgetManagerOpen] = useState(false);

  const getTodayDateString = () => new Date().toISOString().split('T')[0];
  const getMonthStartDateString = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };

  const [filters, setFilters] = useState<Filters>({
    dateFrom: getMonthStartDateString(),
    dateTo: getTodayDateString(),
    category: 'all',
    type: 'all',
  });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: crypto.randomUUID() }]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addCategory = (name: string) => {
    const newCategory: Category = { id: crypto.randomUUID(), name };
    setCategories(prev => [...prev, newCategory]);
  };

  const setBudgetsForMonth = (newBudgetsForMonth: { categoryId: string; amount: number }[], month: string) => {
    setBudgets(prev => {
        // Filter out old budgets for the selected month
        const otherMonthsBudgets = prev.filter(b => b.month !== month);
        
        // Create new budget objects for the current month
        const updatedBudgetsForMonth: Budget[] = newBudgetsForMonth.map(b => ({
            id: crypto.randomUUID(),
            ...b,
            month: month,
        }));

        // Try to reuse existing IDs to prevent key changes in react lists, which is better for performance
        const newBudgetsWithStableIds = updatedBudgetsForMonth.map(newBudget => {
            const oldBudget = prev.find(b => b.month === month && b.categoryId === newBudget.categoryId);
            return oldBudget ? { ...newBudget, id: oldBudget.id } : newBudget;
        });
        
        return [...otherMonthsBudgets, ...newBudgetsWithStableIds];
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        return transactionDate >= fromDate && transactionDate <= toDate;
      })
      .filter(t => filters.category === 'all' || t.categoryId === filters.category)
      .filter(t => filters.type === 'all' || t.type === filters.type)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filters]);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header
        onOpenCategoryManager={() => setCategoryManagerOpen(true)}
        onOpenBudgetManager={() => setBudgetManagerOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
      />
      <main className="container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Dashboard
            transactions={filteredTransactions}
            categories={categories}
            budgets={budgets}
            currency={currency}
          />
          <TransactionList
            transactions={filteredTransactions}
            deleteTransaction={deleteTransaction}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            currency={currency}
          />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <h2 className="text-xl font-bold mb-4 text-on-surface">Add New Transaction</h2>
            <TransactionForm
              addTransaction={addTransaction}
              categories={categories}
            />
          </Card>
        </div>
      </main>
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setCategoryManagerOpen(false)}
        categories={categories}
        addCategory={addCategory}
      />
      <BudgetManager 
        isOpen={isBudgetManagerOpen}
        onClose={() => setBudgetManagerOpen(false)}
        categories={categories}
        budgets={budgets}
        setBudgetsForMonth={setBudgetsForMonth}
      />
    </div>
  );
}

export default App;
