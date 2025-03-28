'use client';
import React, { useRef, useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '@/lib/firebase'; // Importa Firestore desde tu configuración de Firebase
import { doc, setDoc, collection, updateDoc, arrayUnion, getDocs } from 'firebase/firestore';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment';
type TransactionType = 'income' | 'expense';

interface Transaction {
    id: number;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: TransactionType; // Solo puede ser 'income' o 'expense'
}

interface FinanceCardData {
    id: string;
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
        id: '',
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
                type: formData.category === 'expense' ? 'expense' : 'income',
            };

            const newCardId = Date.now().toString(); // Genera un ID único
            const docRef = doc(collection(db, 'users', user.uid, 'financeCards'), newCardId);
            const newCard = {
                id: newCardId, // Agrega el ID único al nuevo objeto de tarjeta
                title: formData.title || 'Nueva Tarjeta',
                category: formData.category,
                transactions: [initialTransaction],
            };

            // Verificar si la colección existe
            const userCardsCollectionRef = collection(db, 'users', user.uid, 'financeCards');
            const userCardsSnapshot = await getDocs(userCardsCollectionRef);
            if (userCardsSnapshot.empty) {
                // Si la colección no existe, se puede crear
                await setDoc(doc(userCardsCollectionRef, newCardId), newCard);
            } else {
                await setDoc(docRef, newCard);
            }

            setFormData((prev) => ({ ...prev, id: newCardId })); // Actualiza formData.id
            console.log('formData.id después de crear la tarjeta:', newCardId); // Verifica el valor

            onCardAdded();
            setIsOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error al crear la tarjeta:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            id: '',
            title: '',
            category: 'income',
            description: '',
            transactions: [],
        });
        setNewAmount('');
        setNewDescription('');
    };

    const addTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('newAmount:', newAmount, 'newDescription:', newDescription); // Verifica los valores

        // Permitir que el campo de monto esté vacío
        if (!newDescription) return;

        const amount = parseFloat(newAmount);
        if (isNaN(amount)) return;

        const newTransaction: Transaction = {
            id: Date.now(),
            description: newDescription,
            amount,
            date: new Date().toISOString(),
            category: formData.category,
            type: amount >= 0 ? 'income' : 'expense',
        };

        try {
            if (!user) {
                console.error('El usuario no está autenticado:', user);
                return;
            }
            const cardRef = doc(db, 'users', user.uid, 'financeCards', formData.id); // Usa el ID de la tarjeta
            await updateDoc(cardRef, {
                transactions: arrayUnion(newTransaction),
            });

            setTransactions((prevTransactions) => {
                const updatedTransactions = [...prevTransactions, newTransaction];
                console.log('Transacciones actualizadas:', updatedTransactions); // Verifica el estado actualizado
                return updatedTransactions;
            });
            setNewAmount(''); // Reinicia el campo de monto
            setNewDescription('');
        } catch (error) {
            console.error('Error al agregar la transacción:', error);
        }
    };

    const deleteTransaction = async (id: number) => {
        console.log('formData.id en deleteTransaction:', formData.id); // Verifica el valor de formData.id
        const updatedTransactions = transactions.filter((t) => t.id !== id);
        setTransactions(updatedTransactions);

        try {
            if (!user) {
                console.error('El usuario no está autenticado.');
                return;
            }
            const cardRef = doc(db, 'users', user.uid, 'financeCards', 'ID_FIJO'); // Reemplaza 'ID_FIJO' con un ID válido
            await updateDoc(cardRef, {
                transactions: updatedTransactions,
            });
        } catch (error) {
            console.error('Error al eliminar la transacción:', error);
        }
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
                                <span
                                    className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}
                                >
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
                <span
                    className={`font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                    ${Math.abs(total).toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default FinanceCard;
