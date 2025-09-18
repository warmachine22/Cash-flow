export const TransactionType = Object.freeze({
  INCOME: 'income',
  EXPENSE: 'expense',
});

export const TimePeriod = Object.freeze({
  WEEK: 'Week',
  MONTH: 'Month',
  QUARTER: 'Quarter',
  YEAR: 'Year',
  LIFETIME: 'Lifetime',
});

// Mapped to Font Awesome 6 Free icons
export const ICONS = {
  // Categories
  Salary: 'fa-briefcase',
  Rent: 'fa-house-chimney',
  Groceries: 'fa-cart-shopping',
  Supplies: 'fa-gas-pump',
  'Online Shopping': 'fa-credit-card',
  'Dinner with friends': 'fa-utensils',
  'Streaming Service': 'fa-tv',
  'Gym Membership': 'fa-dumbbell',
  'Phone Bill': 'fa-mobile-screen-button',
  Transportation: 'fa-bus',
  Restaurants: 'fa-utensils',
  Shopping: 'fa-bag-shopping',
  Other: 'fa-tag',

  // UI Icons
  'fa-briefcase': 'fa-briefcase',
  'fa-house-chimney': 'fa-house-chimney',
  'fa-cart-shopping': 'fa-cart-shopping',
  'fa-gas-pump': 'fa-gas-pump',
  'fa-credit-card': 'fa-credit-card',
  'fa-utensils': 'fa-utensils',
  'fa-tv': 'fa-tv',
  'fa-dumbbell': 'fa-dumbbell',
  'fa-mobile-screen-button': 'fa-mobile-screen-button',
  'fa-bus': 'fa-bus',
  'fa-bag-shopping': 'fa-bag-shopping',
  'fa-tag': 'fa-tag',
  'fa-plus': 'fa-plus',
  'fa-minus': 'fa-minus',
  'fa-chevron-up': 'fa-chevron-up',
  'fa-chevron-down': 'fa-chevron-down',
  'fa-xmark': 'fa-xmark',
  'fa-delete-left': 'fa-delete-left',
  'fa-database': 'fa-database',
  'fa-cloud-arrow-up': 'fa-cloud-arrow-up',
  'fa-sun': 'fa-sun',
  'fa-moon': 'fa-moon',
  'fa-gear': 'fa-gear',
  'fa-repeat': 'fa-repeat',
  'fa-pen': 'fa-pen',
  'fa-trash': 'fa-trash',
  'fa-receipt': 'fa-receipt',
  'fa-chart-pie': 'fa-chart-pie',
};

export const INITIAL_INCOME_CATEGORIES = [
  { id: 'cat-inc-1', name: 'Salary', icon: ICONS['Salary'], type: TransactionType.INCOME },
];

export const INITIAL_EXPENSE_CATEGORIES = [
  { id: 'cat-exp-1', name: 'Rent', icon: ICONS['Rent'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-2', name: 'Groceries', icon: ICONS['Groceries'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-3', name: 'Supplies', icon: ICONS['Supplies'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-4', name: 'Online Shopping', icon: ICONS['Online Shopping'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-5', name: 'Dinner with friends', icon: ICONS['Dinner with friends'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-6', name: 'Streaming Service', icon: ICONS['Streaming Service'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-7', name: 'Gym Membership', icon: ICONS['Gym Membership'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-8', name: 'Phone Bill', icon: ICONS['Phone Bill'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-9', name: 'Transportation', icon: ICONS['Transportation'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-10', name: 'Restaurants', icon: ICONS['Restaurants'], type: TransactionType.EXPENSE },
  { id: 'cat-exp-11', name: 'Shopping', icon: ICONS['Shopping'], type: TransactionType.EXPENSE },
];

export const SAMPLE_TRANSACTIONS = [
  { id: 't1', categoryId: 'cat-inc-1', type: TransactionType.INCOME, amount: 2500, description: 'Monthly paycheck', date: new Date(new Date().setDate(1)).toISOString() },
  { id: 't2', categoryId: 'cat-exp-1', type: TransactionType.EXPENSE, amount: 1200, description: 'Monthly payment', date: new Date(new Date().setDate(2)).toISOString() },
  { id: 't3', categoryId: 'cat-exp-2', type: TransactionType.EXPENSE, amount: 150.25, description: 'Supermarket run', date: new Date(new Date().setDate(3)).toISOString() },
  { id: 't4', categoryId: 'cat-exp-3', type: TransactionType.EXPENSE, amount: 65, description: 'Topped up the tank', date: new Date(new Date().setDate(5)).toISOString() },
  { id: 't5', categoryId: 'cat-exp-4', type: TransactionType.EXPENSE, amount: 110, description: 'New jacket', date: new Date(new Date().setDate(10)).toISOString() },
  { id: 't6', categoryId: 'cat-exp-5', type: TransactionType.EXPENSE, amount: 85.50, description: 'Italian restaurant', date: new Date(new Date().setDate(12)).toISOString() },
];

export const SAMPLE_RECURRING_EXPENSES = [
    { id: 're1', categoryId: 'cat-exp-1', amount: 1200, description: 'Due on 1st of every month', dayOfMonth: 1 },
    { id: 're2', categoryId: 'cat-exp-6', amount: 15.99, description: 'Due on 5th of every month', dayOfMonth: 5 },
    { id: 're3', categoryId: 'cat-exp-7', amount: 40.00, description: 'Due on 20th of every month', dayOfMonth: 20 },
    { id: 're4', categoryId: 'cat-exp-8', amount: 75.00, description: 'Due on 28th of every month', dayOfMonth: 28 },
];