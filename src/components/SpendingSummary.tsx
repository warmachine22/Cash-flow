import React, { useState } from 'react';
import { Transaction, Category, TransactionType } from '../types';
import CollapsibleSection from './CollapsibleSection';
import Icon from './Icon';
import TransactionItem from './TransactionItem';

interface SpendingSummaryProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SpendingSummary: React.FC<SpendingSummaryProps> = ({ transactions, categories, onEditTransaction, isOpen, onToggle }) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const totalSpending = expenseTransactions.reduce((acc, t) => acc + t.amount, 0);

  const spendingByCategory = expenseTransactions.reduce((acc, t) => {
    acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount;
    return acc;
  }, {} as { [key: string]: number });

  const sortedSpending = Object.entries(spendingByCategory)
    .map(([categoryId, amount]) => ({
      categoryId,
      amount,
      category: categories.find(c => c.id === categoryId),
    }))
    .filter(item => item.category)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const handleToggleCategory = (categoryId: string) => {
      setExpandedCategoryId(prevId => prevId === categoryId ? null : categoryId);
  }

  return (
    <CollapsibleSection title="Top Non-Recurring Spending" isOpen={isOpen} onToggle={onToggle}>
      {sortedSpending.length > 0 ? (
        sortedSpending.map(item => (
          <div key={item.categoryId} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <button onClick={() => handleToggleCategory(item.categoryId)} className="w-full flex items-center justify-between py-3 text-left">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <Icon name={item.category?.icon || 'tag'} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold">{item.category?.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {totalSpending > 0 ? `${Math.round((item.amount / totalSpending) * 100)}% of total spending` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                  <p className="font-semibold">{formatCurrency(item.amount)}</p>
                  <Icon name={expandedCategoryId === item.categoryId ? 'chevron-up' : 'chevron-down'} className="w-4 h-4 text-gray-400" />
              </div>
            </button>
            {expandedCategoryId === item.categoryId && (
                <div className="pl-6 pb-2">
                    {expenseTransactions.filter(t => t.categoryId === item.categoryId).map(t => (
                        <TransactionItem 
                            key={t.id}
                            transaction={t}
                            category={item.category}
                            onEdit={onEditTransaction}
                        />
                    ))}
                </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No spending data for this period.</p>
      )}
    </CollapsibleSection>
  );
};

export default SpendingSummary;