import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface CashFlowChartProps {
  transactions: Transaction[];
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ transactions }) => {
  const processData = () => {
    if (transactions.length === 0) return [];

    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const dataMap = new Map<string, number>();
    let cumulativeFlow = 0;

    sortedTransactions.forEach(t => {
      const date = new Date(t.date);
      const month = date.toLocaleString('default', { month: 'short' });
      
      cumulativeFlow += t.type === TransactionType.INCOME ? t.amount : -t.amount;
      dataMap.set(month, cumulativeFlow);
    });
    
    // Create a data structure for the past 6 months including the current one.
    const today = new Date();
    const chartMonths = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        chartMonths.push(d.toLocaleString('default', { month: 'short' }));
    }

    let lastValue = 0;
    return chartMonths.map(month => {
        if(dataMap.has(month)) {
            lastValue = dataMap.get(month)!;
        }
        return { name: month, value: lastValue };
    });
  };

  const data = processData();
  const gradientId = "colorValue";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
        <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
        </defs>
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} hide={true}/>
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: 'none',
                borderRadius: '0.5rem',
                color: '#fff',
            }}
            formatter={(value: number) => [
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value),
                'Cash Flow'
            ]}
        />
        <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default CashFlowChart;