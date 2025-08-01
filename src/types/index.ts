import { ReactNode } from 'react';

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
}

export interface FinanceCard {
    description: ReactNode;
    id: string;
    title: string;
    transactions: Transaction[];
    createdAt: string;
    updatedAt: string;
}

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}