import React from 'react';
import { Transaction, Category } from '../types';
import CollapsibleSection from './CollapsibleSection';
import TransactionItem from './TransactionItem';

interface TransactionHistoryProps {
  transactions: Transaction[];
  categories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, categories, onEditTransaction, isOpen, onToggle }) => {
  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const sortedTransactions = [...transactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <CollapsibleSection title="Transaction History" isOpen={isOpen} onToggle={onToggle}>
        {sortedTransactions.length > 0 ? (
            sortedTransactions.map(t => (
                <TransactionItem 
                    key={t.id} 
                    transaction={t} 
                    category={categoryMap.get(t.categoryId)} 
                    onEdit={onEditTransaction}
                />
            ))
        ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">No transactions for this period.</p>
        )}
    </CollapsibleSection>
  );
};

export default TransactionHistory;