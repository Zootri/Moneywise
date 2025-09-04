
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id:string;
  type: TransactionType;
  amount: number;
  date: string; // ISO string e.g. "2023-10-27"
  description: string;
  categoryId: string;
}

export interface Filters {
  dateFrom: string;
  dateTo: string;
  category: 'all' | string;
  type: 'all' | TransactionType;
}

export interface Budget {
    id: string;
    categoryId: string;
    amount: number;
    month: string; // YYYY-MM
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
