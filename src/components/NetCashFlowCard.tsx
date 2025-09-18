import React from 'react';
import { Transaction, TransactionType } from '../types';
import CashFlowChart from './CashFlowChart';

interface NetCashFlowCardProps {
  transactions: Transaction[];
}

const NetCashFlowCard: React.FC<NetCashFlowCardProps> = ({ transactions }) => {
  const netCashFlow = transactions.reduce((acc, t) => {
    return t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Net Cash Flow</p>
        <p className={`text-4xl font-bold ${netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(netCashFlow)}
        </p>
      </div>
      <div className="h-40">
        <CashFlowChart transactions={transactions} />
      </div>
    </div>
  );
};

export default NetCashFlowCard;