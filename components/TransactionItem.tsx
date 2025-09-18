
import React from 'react';
import { Transaction, Category, TransactionType } from '../types';
import Icon from './Icon';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onEdit: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, category, onEdit }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-green-500' : 'text-gray-800 dark:text-gray-200';
  const sign = isIncome ? '+' : '-';
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
          <Icon name={category?.icon || 'tag'} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <p className="font-semibold">{category?.name || 'Uncategorized'}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
        </div>
      </div>
      <div className="flex items-center">
        <p className={`font-semibold ${amountColor}`}>
            {sign}{formatCurrency(transaction.amount)}
        </p>
        <button onClick={() => onEdit(transaction)} className="ml-3 p-1 text-gray-400 hover:text-primary dark:hover:text-primary" aria-label="Edit transaction">
            <Icon name="pen" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionItem;
