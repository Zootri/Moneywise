
import type { Category, CurrencyCode } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Salary' },
  { id: '2', name: 'Groceries' },
  { id: '3', name: 'Rent' },
  { id: '4', name: 'Utilities' },
  { id: '5', name: 'Transport' },
  { id: '6', name: 'Dining Out' },
  { id: '7', name: 'Entertainment' },
  { id: '8', name: 'Shopping' },
  { id: '9', name: 'Health' },
  { id: '10', name: 'Freelance' },
];

export const CURRENCIES: Record<CurrencyCode, { symbol: string; name: string }> = {
  INR: { symbol: '₹', name: 'Indian Rupee' },
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
};
