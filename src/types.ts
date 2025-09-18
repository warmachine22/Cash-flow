export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum TimePeriod {
  WEEK = 'Week',
  MONTH = 'Month',
  QUARTER = 'Quarter',
  YEAR = 'Year',
  LIFETIME = 'Lifetime',
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  categoryId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string; // ISO 8601 format
}

export interface RecurringExpense {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  dayOfMonth: number;
}