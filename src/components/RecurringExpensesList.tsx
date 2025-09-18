import React from 'react';
import { RecurringExpense, Category } from '../types';
import CollapsibleSection from './CollapsibleSection';
import Icon from './Icon';

interface RecurringExpensesListProps {
  recurringExpenses: RecurringExpense[];
  categories: Category[];
  isOpen: boolean;
  onToggle: () => void;
}

const RecurringExpensesList: React.FC<RecurringExpensesListProps> = ({ recurringExpenses, categories, isOpen, onToggle }) => {
  const categoryMap = new Map(categories.map(c => [c.id, c]));
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <CollapsibleSection title="Recurring Expenses" isOpen={isOpen} onToggle={onToggle}>
      {recurringExpenses.length > 0 ? (
        recurringExpenses.map(expense => {
          const category = categoryMap.get(expense.categoryId);
          return (
            <div key={expense.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
                  <Icon name={category?.icon || 'tag'} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold">{category?.name || 'Uncategorized'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{expense.description}</p>
                </div>
              </div>
              <p className="font-semibold">-{formatCurrency(expense.amount)}</p>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recurring expenses set up.</p>
      )}
    </CollapsibleSection>
  );
};

export default RecurringExpensesList;