import React from 'react';
import Icon from './Icon';

interface TransactionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const TransactionButtons: React.FC<TransactionButtonsProps> = ({ onAddIncome, onAddExpense }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={onAddExpense}
        className="flex items-center justify-center gap-2 w-full py-3 text-white bg-danger rounded-lg font-semibold shadow hover:bg-red-600 transition-colors"
      >
        <Icon name="minus" className="w-4 h-4" />
        Add Expense
      </button>
      <button 
        onClick={onAddIncome}
        className="flex items-center justify-center gap-2 w-full py-3 text-white bg-primary rounded-lg font-semibold shadow hover:bg-green-600 transition-colors"
      >
        <Icon name="plus" className="w-4 h-4" />
        Add Income
      </button>
    </div>
  );
};

export default TransactionButtons;