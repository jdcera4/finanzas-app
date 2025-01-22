'use client';
import React, { useRef, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { financeServices } from '@/lib/firebaseService';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment';
type TransactionType = 'income' | 'expense';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: TransactionType;  // Aquí especificamos que solo puede ser 'income' o 'expense'
}

interface FinanceCardData {
    title: string;
    category: CardCategory;
    description: string;
    transactions: Transaction[];
}

interface Props {
    onCardAdded: () => void;
}

const FinanceCard: React.FC<Props> = ({ onCardAdded }) => {
    const [title, setTitle] = useState('Nueva Tarjeta');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [newAmount, setNewAmount] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FinanceCardData>({
        title: '',
        category: 'income',
        description: '',
        transactions: [],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            const initialTransaction: Transaction = {
                id: Date.now(),
                description: formData.description,
                amount: 0,
                category: formData.category,
                date: new Date().toISOString(),
                type: formData.category === 'expense' ? 'expense' : 'income' as TransactionType
            };

            const newCard = {
                title: formData.title || 'Nueva Tarjeta',
                category: formData.category,
                transactions: [initialTransaction],
            };

            await financeServices.createCard(user.uid, newCard);
            onCardAdded();
            setIsOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error al crear la tarjeta:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'income',
            description: '',
            transactions: [],
        });
        setNewAmount('');
        setNewDescription('');
    };

    const addTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAmount || !newDescription) return;

        const amount = parseFloat(newAmount);
        if (isNaN(amount)) return;

        const newTransaction: Transaction = {
            id: Date.now(),
            description: newDescription,
            amount,
            date: new Date().toISOString(),
            category: formData.category,
            type: amount >= 0 ? 'income' : 'expense'
        };

        setTransactions(prevTransactions => [...prevTransactions, newTransaction]);
        setNewAmount('');
        setNewDescription('');
    };

    const deleteTransaction = (id: number) => {
        setTransactions(prevTransactions =>
            prevTransactions.filter(t => t.id !== id)
        );
    };

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const handleClickOutside = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
            {/* Header */}
            <div className="p-4 border-b">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                            onChange={(e) => setNewAmount(e.target.value)}
                            placeholder="Monto"
                            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            required
                        />
                        <input
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            placeholder="Descripción"
                            className="flex-2 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition-colors"
                            disabled={!newAmount || !newDescription}
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
                                    ${Math.abs(transaction.amount).toFixed(2)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => deleteTransaction(transaction.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label="Eliminar transacción"
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
                    ${Math.abs(total).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default FinanceCard;