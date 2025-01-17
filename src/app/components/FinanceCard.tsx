'use client';
import React, { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
}

const FinanceCard = () => {
    const [title, setTitle] = useState('Nueva Tarjeta');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAmount || !newDescription) return;

        const amount = parseFloat(newAmount);
        setTransactions(prevTransactions => [
            ...prevTransactions,
            {
                id: Date.now(),
                description: newDescription,
                amount,
                date: new Date().toISOString()
            }
        ]);
        setNewAmount('');
        setNewDescription('');
    };

    const deleteTransaction = (id: number) => {
        setTransactions(prevTransactions =>
            prevTransactions.filter(t => t.id !== id)
        );
    };

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{width: "500px"}}>
            {/* Header */}
            <div className="p-4 border-b">
                <input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="text-xl font-bold w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <form onSubmit={addTransaction} className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={newAmount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAmount(e.target.value)}
                            placeholder="Monto"
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                        />
                        <input
                            value={newDescription}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewDescription(e.target.value)}
                            placeholder="Descripción"
                            className="flex-2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                <div className="space-y-2">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                        >
                            <div>
                                <p className="font-medium">{transaction.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    ${transaction.amount.toFixed(2)}
                                </span>
                                <button
                                    onClick={() => deleteTransaction(transaction.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                <span className="font-bold">Total:</span>
                <span className={`font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${total.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default FinanceCard;