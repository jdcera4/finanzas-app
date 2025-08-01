'use client';

import React, { useState, useEffect } from 'react';
import { realtimeDb } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';
import AddFinanceCard from './AddFinanceCard';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment' | 'debt';
type TransactionType = 'fixed' | 'variable';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
}

interface Installment {
    month: string;
    paid: boolean;
}

interface FinanceCardData {
    id: string;
    title: string;
    category: CardCategory;
    amount: number;
    description?: string;
    transactionType?: TransactionType;
    bankName?: string;
    accountNumber?: string;
    frequency?: 'monthly' | 'weekly' | 'yearly';
    createdAt: string;
    updatedAt: string;
    transactions: Transaction[];
    totalDebt?: number;
    remainingBalance?: number;
    installments?: Installment[];
}

interface FinanceCardProps {
    card: FinanceCardData;
    onCardUpdated: () => void;
    onCardDeleted: () => void;
}

interface Props {
    cards: FinanceCardData[];
    onCardAdded: () => void;
    onCardDeleted: () => void;
}

const FinanceCard: React.FC<FinanceCardProps> = ({ card, onCardUpdated, onCardDeleted }) => {
    const [totalAmount, setTotalAmount] = useState(() => {
        return card.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    });
    const [newTransactionAmount, setNewTransactionAmount] = useState(0);
    const [newTransactionDescription, setNewTransactionDescription] = useState('');

    const handleAddTransaction = () => {
        const newTransaction: Transaction = {
            id: `trans_${Date.now()}`,
            description: newTransactionDescription,
            amount: newTransactionAmount,
            date: new Date().toISOString(),
            category: card.category,
            type: card.category === 'income' ? 'income' : 'expense',
        };
        card.transactions.push(newTransaction);
        setTotalAmount(prev => prev + newTransactionAmount);
        onCardUpdated();
        setNewTransactionAmount(0);
        setNewTransactionDescription('');
    };

    const handleDeleteTransaction = (transactionId: string) => {
        const transactionIndex = card.transactions.findIndex(t => t.id === transactionId);
        if (transactionIndex > -1) {
            const [removedTransaction] = card.transactions.splice(transactionIndex, 1);
            setTotalAmount(prev => prev - removedTransaction.amount);
            onCardUpdated();
        }
    };

    const handleToggleInstallment = (index: number) => {
        if (!card.installments || card.totalDebt === undefined) return;
        const updatedInstallments = card.installments.map((installment, i) => {
            if (i === index) {
                return { ...installment, paid: !installment.paid };
            }
            return installment;
        });
        const totalDebt = card.totalDebt || 0;
        const updatedBalance = updatedInstallments.reduce((balance, installment) => {
            return installment.paid ? balance - (totalDebt / updatedInstallments.length) : balance;
        }, totalDebt);
        // Update card state with new installments and balance
        // Assuming setCard is a state update function for the card
        onCardUpdated();
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-md">
            <div className="mb-4 flex flex-col">
                <input
                    type="number"
                    value={newTransactionAmount}
                    onChange={(e) => setNewTransactionAmount(Number(e.target.value))}
                    placeholder="Amount"
                    className="border p-2 mb-2 rounded-md shadow-sm"
                />
                <input
                    type="text"
                    value={newTransactionDescription}
                    onChange={(e) => setNewTransactionDescription(e.target.value)}
                    placeholder="Description"
                    className="border p-2 mb-2 rounded-md shadow-sm"
                />
                <button onClick={handleAddTransaction} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700">Add Transaction</button>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
            <p className="text-gray-600">Category: {card.category}</p>
            <p className="text-gray-600">Amount: ${card.amount}</p>
            <p className="text-gray-600">Description: {card.description}</p>
            <p className="text-gray-900 font-bold">Total: ${totalAmount.toFixed(2)}</p>
            {card.category === 'debt' && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold">Installments</h4>
                    <ul className="list-disc pl-5">
                        {card.installments && card.installments.map((installment, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={installment.paid}
                                    onChange={() => handleToggleInstallment(index)}
                                    className="mr-2"
                                />
                                {installment.month}: {installment.paid ? 'Paid' : 'Unpaid'}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-2 text-gray-800 font-bold">Remaining Balance: ${card.remainingBalance?.toFixed(2)}</p>
                </div>
            )}
            <ul className="mt-4">
                {card.transactions.map(transaction => (
                    <li key={transaction.id} className="flex justify-between items-center py-1">
                        <span>{transaction.description}: ${transaction.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteTransaction(transaction.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </li>
                ))}
            </ul>
            <button onClick={onCardDeleted} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
                Delete Card
            </button>
        </div>
    );
};

export default function FinanceCardList() {
    const { user } = useAuth();
    const [cards, setCards] = useState<FinanceCardData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            setCards([]);
            return;
        }

        const cardsRef = ref(realtimeDb, `users/${user.uid}/financeCards`);

        const unsubscribe = onValue(cardsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const cardsArray: FinanceCardData[] = Object.entries(data).map(([id, cardData]: [string, any]) => ({
                    id,
                    ...cardData,
                    transactions: cardData.transactions || []
                }));

                // Ordenar por fecha de creación (más recientes primero)
                cardsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setCards(cardsArray);
            } else {
                setCards([]);
            }
            setLoading(false);
        }, (error) => {
            console.error('Error al obtener las tarjetas:', error);
            setLoading(false);
        });

        return () => off(cardsRef, 'value', unsubscribe);
    }, [user]);

    const handleCardAdded = () => {
        // Los datos se actualizan automáticamente a través del listener
        console.log('Nueva tarjeta agregada');
    };

    const handleCardUpdated = () => {
        // Los datos se actualizan automáticamente a través del listener
        console.log('Tarjeta actualizada');
    };

    const handleCardDeleted = () => {
        // Los datos se actualizan automáticamente a través del listener
        console.log('Tarjeta eliminada');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="text-gray-500">Cargando tarjetas...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center text-gray-500 py-12">
                <p>Debes iniciar sesión para ver tus tarjetas financieras.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Mis Tarjetas Financieras</h1>
                <div className="text-sm text-gray-500">
                    {cards.length} {cards.length === 1 ? 'tarjeta' : 'tarjetas'}
                </div>
            </div>
            <AddFinanceCard onCardAdded={handleCardAdded} onCardDeleted={handleCardDeleted} cards={cards} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <FinanceCard
                        key={card.id}
                        card={card}
                        onCardUpdated={handleCardUpdated}
                        onCardDeleted={handleCardDeleted}
                    />
                ))}
            </div>

            {cards.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                        No tienes tarjetas financieras aún
                    </div>
                    <p className="text-sm text-gray-400">
                        Haz clic en "Agregar Nueva Tarjeta Financiera" para comenzar
                    </p>
                </div>
            )}
        </div>
    );
}