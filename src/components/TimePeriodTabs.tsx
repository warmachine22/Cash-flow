import React from 'react';
import { TimePeriod } from '../types';

interface TimePeriodTabsProps {
  selectedPeriod: TimePeriod;
  onSelectPeriod: (period: TimePeriod) => void;
}

const TimePeriodTabs: React.FC<TimePeriodTabsProps> = ({ selectedPeriod, onSelectPeriod }) => {
  const periods = Object.values(TimePeriod);

  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-full p-1 flex items-center justify-between">
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onSelectPeriod(period)}
          className={`w-full py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none ${
            selectedPeriod === period
              ? 'bg-white dark:bg-gray-600 text-primary shadow'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default TimePeriodTabs;