import React, { useState, useEffect } from 'react';
import { Category, RecurringExpense } from '../types';
import Icon from './Icon';
import DayPickerModal from './DayPickerModal';

interface AddRecurringExpenseModalProps {
  onClose: () => void;
  onSave: (expense: Omit<RecurringExpense, 'id'> | RecurringExpense) => void;
  expenseCategories: Category[];
  expenseToEdit?: RecurringExpense | null;
}

const AddRecurringExpenseModal: React.FC<AddRecurringExpenseModalProps> = ({ onClose, onSave, expenseCategories, expenseToEdit }) => {
  const [amountStr, setAmountStr] = useState('0');
  const [selectedCategoryId, setSelectedCategoryId] = useState(expenseCategories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [isDayPickerOpen, setIsDayPickerOpen] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      setAmountStr(String(expenseToEdit.amount));
      setSelectedCategoryId(expenseToEdit.categoryId);
      setDescription(expenseToEdit.description);
      setDayOfMonth(String(expenseToEdit.dayOfMonth));
    } else {
      setAmountStr('0');
      setSelectedCategoryId(expenseCategories[0]?.id || '');
      setDescription('');
      setDayOfMonth('1');
    }
  }, [expenseToEdit, expenseCategories]);

  const title = expenseToEdit ? 'Edit Recurring Expense' : 'Add Recurring Expense';
  
  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (amountStr.length > 1) {
        setAmountStr(amountStr.slice(0, -1));
      } else {
        setAmountStr('0');
      }
    } else if (key === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr(amountStr + '.');
      }
    } else {
      if (amountStr === '0' && key !== '.') {
        setAmountStr(key);
      } else {
        const decimalIndex = amountStr.indexOf('.');
        if (decimalIndex === -1 || amountStr.length - decimalIndex <= 2) {
            setAmountStr(amountStr + key);
        }
      }
    }
  };
  
  const handleSubmit = () => {
    const amount = parseFloat(amountStr);
    const dayOfMonthNum = parseInt(dayOfMonth, 10);
    if (amount > 0 && selectedCategoryId && !isNaN(dayOfMonthNum) && dayOfMonthNum >= 1 && dayOfMonthNum <= 31) {
      const expenseData = {
        amount,
        categoryId: selectedCategoryId,
        description,
        dayOfMonth: dayOfMonthNum,
      };
      
      if (expenseToEdit) {
        onSave({ ...expenseData, id: expenseToEdit.id });
      } else {
        onSave(expenseData);
      }
    } else {
        alert("Please ensure amount is greater than 0, a category is selected, and a day is chosen.");
    }
  };

  const handleDaySelect = (day: number) => {
    setDayOfMonth(String(day));
    setIsDayPickerOpen(false);
  };

  const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-t-2xl p-6 transform transition-transform duration-300 translate-y-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <Icon name="times" className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mb-6">
              <span className="text-2xl font-semibold text-gray-500 dark:text-gray-400">$</span>
              <span className="text-5xl font-bold ml-1">{parseFloat(amountStr).toLocaleString(undefined, {minimumFractionDigits: amountStr.endsWith('.') ? 1 : (amountStr.split('.')[1] || []).length, maximumFractionDigits: 2})}</span>
          </div>

          <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                      <select 
                          value={selectedCategoryId}
                          onChange={(e) => setSelectedCategoryId(e.target.value)}
                          className="w-full h-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 appearance-none font-semibold focus:ring-2 focus:ring-primary"
                      >
                          {expenseCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 dark:text-gray-300">
                          <Icon name="chevron-down" className="w-5 h-5" />
                      </div>
                  </div>
                  <button
                      onClick={() => setIsDayPickerOpen(true)}
                      className="w-full h-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 font-semibold text-left focus:ring-2 focus:ring-primary"
                  >
                      Day of Month: <span className="text-primary font-bold">{dayOfMonth}</span>
                  </button>
              </div>
              <input 
                  type="text" 
                  placeholder="Description (e.g., 'Monthly Subscription')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-4 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary"
              />
               <p className="text-xs text-gray-500 dark:text-gray-400 px-1">Select the day of the month this expense typically occurs.</p>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
              {keypadKeys.map((key) => (
                  <button 
                      key={key} 
                      onClick={() => handleKeyPress(key)}
                      className="py-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-2xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                      {key === 'backspace' ? <Icon name="backspace" className="w-6 h-6 mx-auto" /> : key}
                  </button>
              ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <button 
                  onClick={onClose}
                  className="w-full py-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                  Cancel
              </button>
              <button 
                  onClick={handleSubmit}
                  className="w-full py-4 text-white font-semibold rounded-lg transition-colors bg-primary hover:bg-green-600"
              >
                  Save Expense
              </button>
          </div>
        </div>
      </div>
      {isDayPickerOpen && (
        <DayPickerModal
          isOpen={isDayPickerOpen}
          onClose={() => setIsDayPickerOpen(false)}
          onSelect={handleDaySelect}
          initialDay={parseInt(dayOfMonth, 10)}
        />
      )}
    </>
  );
};

export default AddRecurringExpenseModal;