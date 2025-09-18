
import { Transaction, Category, RecurringExpense } from '../types';

interface AppState {
  transactions: Transaction[];
  incomeCategories: Category[];
  expenseCategories: Category[];
  recurringExpenses: RecurringExpense[];
  darkMode: boolean;
}

const STORAGE_KEY = 'cashflowJournalData';

export const storageService = {
  saveData: (data: AppState): void => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serializedData);
    } catch (error) {
      console.error("Could not save data to localStorage", error);
    }
  },

  loadData: (): AppState | null => {
    try {
      const serializedData = localStorage.getItem(STORAGE_KEY);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error("Could not load data from localStorage", error);
      return null;
    }
  },

  clearData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Could not clear data from localStorage", error);
    }
  }
};
