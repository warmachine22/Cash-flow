
import { Category, Transaction, RecurringExpense, TransactionType } from './types';

export const ICONS: { [key: string]: string } = {
  Salary: 'briefcase',
  Rent: 'home',
  Groceries: 'shopping-cart',
  Supplies: 'gas-pump',
  'Online Shopping': 'credit-card',
  'Dinner with friends': 'utensils',
  'Streaming Service': 'tv',
  'Gym Membership': 'dumbbell',
  'Phone Bill': 'mobile-alt',
  Transportation: 'bus',
  Restaurants: 'utensils',
  Shopping: 'shopping-bag',
  Other: 'tag'
};

export const INITIAL_INCOME_CATEGORIES: Category[] = [
  { id: 'cat-inc-1', name: 'Salary', icon: 'briefcase', type: TransactionType.INCOME },
];

export const INITIAL_EXPENSE_CATEGORIES: Category[] = [
  { id: 'cat-exp-1', name: 'Rent', icon: 'home', type: TransactionType.EXPENSE },
  { id: 'cat-exp-2', name: 'Groceries', icon: 'shopping-cart', type: TransactionType.EXPENSE },
  { id: 'cat-exp-3', name: 'Supplies', icon: 'gas-pump', type: TransactionType.EXPENSE },
  { id: 'cat-exp-4', name: 'Online Shopping', icon: 'credit-card', type: TransactionType.EXPENSE },
  { id: 'cat-exp-5', name: 'Dinner with friends', icon: 'utensils', type: TransactionType.EXPENSE },
  { id: 'cat-exp-6', name: 'Streaming Service', icon: 'tv', type: TransactionType.EXPENSE },
  { id: 'cat-exp-7', name: 'Gym Membership', icon: 'dumbbell', type: TransactionType.EXPENSE },
  { id: 'cat-exp-8', name: 'Phone Bill', icon: 'mobile-alt', type: TransactionType.EXPENSE },
  { id: 'cat-exp-9', name: 'Transportation', icon: 'bus', type: TransactionType.EXPENSE },
  { id: 'cat-exp-10', name: 'Restaurants', icon: 'utensils', type: TransactionType.EXPENSE },
  { id: 'cat-exp-11', name: 'Shopping', icon: 'shopping-bag', type: TransactionType.EXPENSE },
];

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 't1', categoryId: 'cat-inc-1', type: TransactionType.INCOME, amount: 2500, description: 'Monthly paycheck', date: new Date(new Date().setDate(1)).toISOString() },
  { id: 't2', categoryId: 'cat-exp-1', type: TransactionType.EXPENSE, amount: 1200, description: 'Monthly payment', date: new Date(new Date().setDate(2)).toISOString() },
  { id: 't3', categoryId: 'cat-exp-2', type: TransactionType.EXPENSE, amount: 150.25, description: 'Supermarket run', date: new Date(new Date().setDate(3)).toISOString() },
  { id: 't4', categoryId: 'cat-exp-3', type: TransactionType.EXPENSE, amount: 65, description: 'Topped up the tank', date: new Date(new Date().setDate(5)).toISOString() },
  { id: 't5', categoryId: 'cat-exp-4', type: TransactionType.EXPENSE, amount: 110, description: 'New jacket', date: new Date(new Date().setDate(10)).toISOString() },
  { id: 't6', categoryId: 'cat-exp-5', type: TransactionType.EXPENSE, amount: 85.50, description: 'Italian restaurant', date: new Date(new Date().setDate(12)).toISOString() },
];

export const SAMPLE_RECURRING_EXPENSES: RecurringExpense[] = [
    { id: 're1', categoryId: 'cat-exp-1', amount: 1200, description: 'Due on 1st of every month', dayOfMonth: 1 },
    { id: 're2', categoryId: 'cat-exp-6', amount: 15.99, description: 'Due on 5th of every month', dayOfMonth: 5 },
    { id: 're3', categoryId: 'cat-exp-7', amount: 40.00, description: 'Due on 20th of every month', dayOfMonth: 20 },
    { id: 're4', categoryId: 'cat-exp-8', amount: 75.00, description: 'Due on 28th of every month', dayOfMonth: 28 },
];
