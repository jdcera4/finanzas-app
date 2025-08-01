'use client';

import { useState, useRef, useEffect } from 'react';
import { realtimeDb } from '@/lib/firebase';
import { ref, push, set, remove } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment' | 'debt';
type TransactionType = 'fixed' | 'variable';

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
}

interface DebtCardData extends FinanceCardData {
    totalDebt: number;
    paymentPeriod: 'monthly' | 'biweekly';
    installments: { month: string; paid: boolean; }[];
    remainingBalance: number;
}

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
}

interface Props {
    cards: FinanceCardData[];
    onCardAdded: () => void;
    onCardDeleted: () => void;
}

export default function AddFinanceCard({ cards, onCardAdded, onCardDeleted }: Props) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState<Omit<FinanceCardData, 'id' | 'createdAt' | 'updatedAt' | 'transactions'>>({
        title: '',
        category: 'income',
        amount: 0,
        description: '',
        transactionType: 'fixed',
    });

    const [debtFormData, setDebtFormData] = useState<Omit<DebtCardData, 'id' | 'createdAt' | 'updatedAt' | 'transactions'>>({
        title: '',
        category: 'debt',
        totalDebt: 0,
        paymentPeriod: 'monthly',
        installments: [],
        remainingBalance: 0,
        amount: 0,
        description: '',
        transactionType: 'fixed',
    });

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        const handleClickOutside = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleDebtInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDebtFormData(prev => ({
            ...prev,
            [name]: name === 'totalDebt' || name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'income',
            amount: 0,
            description: '',
            transactionType: 'fixed',
        });
    };

    const resetDebtForm = () => {
        setDebtFormData({
            title: '',
            category: 'debt',
            totalDebt: 0,
            paymentPeriod: 'monthly',
            installments: [],
            remainingBalance: 0,
            amount: 0,
            description: '',
            transactionType: 'fixed',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('Debes iniciar sesión para crear una tarjeta');
            return;
        }

        // Validación básica del formulario
        if (!formData.title.trim() || formData.amount < 0) {
            alert('Por favor, completa todos los campos obligatorios correctamente.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Crear transacción inicial basada en el monto y categoría
            const initialTransaction: Transaction = {
                id: `trans_${Date.now()}`,
                description: formData.description || 'Transacción inicial',
                amount: formData.category === 'expense' ? -Math.abs(formData.amount) : formData.amount,
                date: new Date().toISOString(),
                category: formData.category,
                type: formData.category === 'expense' ? 'expense' : 'income'
            };

            // Preparar datos de la tarjeta para Firebase
            const cardData: FinanceCardData = {
                id: `card_${Date.now()}`,
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                transactions: [initialTransaction]
            };

            // Referencia al nodo de tarjetas del usuario
            const userCardsRef = ref(realtimeDb, `users/${user.uid}/financeCards`);

            // Crear nueva tarjeta con ID único generado por Firebase
            const newCardRef = push(userCardsRef);
            await set(newCardRef, cardData);

            console.log('Nueva tarjeta financiera creada:', cardData);

            // Cerrar modal y resetear formulario
            setIsOpen(false);
            resetForm();
            onCardAdded();

        } catch (error) {
            console.error('Error al crear la tarjeta:', error);
            alert('Hubo un error al crear la tarjeta. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddDebtCard = async () => {
        if (!user) {
            alert('Debes iniciar sesión para crear una tarjeta');
            return;
        }

        setIsSubmitting(true);

        try {
            const newDebtCard = {
                id: `card_${Date.now()}`,
                ...debtFormData,
                remainingBalance: debtFormData.totalDebt,
                installments: generateInstallments(debtFormData.totalDebt, debtFormData.paymentPeriod),
            };

            // Referencia al nodo de tarjetas del usuario
            const userCardsRef = ref(realtimeDb, `users/${user.uid}/financeCards`);

            // Crear nueva tarjeta con ID único generado por Firebase
            const newCardRef = push(userCardsRef);
            await set(newCardRef, newDebtCard);

            console.log('Nueva tarjeta de deuda creada:', newDebtCard);

            // Cerrar modal y resetear formulario
            setIsOpen(false);
            resetDebtForm();
            onCardAdded();

        } catch (error) {
            console.error('Error al crear la tarjeta de deuda:', error);
            alert('Hubo un error al crear la tarjeta de deuda. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const generateInstallments = (totalDebt: number, period: 'monthly' | 'biweekly') => {
        const numInstallments = period === 'monthly' ? 12 : 24; // Example logic
        const installments = [];
        for (let i = 0; i < numInstallments; i++) {
            installments.push({ month: `Month ${i + 1}`, paid: false });
        }
        return installments;
    };

    const handleDeleteCard = async (cardId: string) => {
        if (!user) {
            alert('Debes iniciar sesión para realizar esta acción.');
            return;
        }

        try {
            const cardRef = ref(realtimeDb, `users/${user.uid}/financeCards/${cardId}`);
            await remove(cardRef);
            console.log('Card deleted:', cardId);
            onCardDeleted();
        } catch (error) {
            console.error('Error deleting card:', error);
            alert('Hubo un error al eliminar la tarjeta. Por favor, intenta de nuevo.');
        }
    };

    const getCategoryLabel = (category: CardCategory) => {
        const labels = {
            income: 'Ingreso',
            expense: 'Egreso',
            'bank-account': 'Cuenta Bancaria',
            savings: 'Ahorro',
            investment: 'Inversión',
            debt: 'Deuda'
        };
        return labels[category];
    };

    const renderCategorySpecificFields = () => {
        switch (formData.category) {
            case 'bank-account':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Nombre del Banco
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ej: Banco de Bogotá"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Número de Cuenta (opcional)
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="**** **** **** 1234"
                            />
                        </div>
                    </>
                );
            case 'income':
            case 'expense':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Tipo de Transacción
                            </label>
                            <select
                                name="transactionType"
                                value={formData.transactionType || 'fixed'}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="fixed">Fijo</option>
                                <option value="variable">Variable</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Frecuencia
                            </label>
                            <select
                                name="frequency"
                                value={formData.frequency || 'monthly'}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="monthly">Mensual</option>
                                <option value="weekly">Semanal</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>
                    </>
                );
            case 'debt':
                return (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Total de la Deuda
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="totalDebt"
                                    value={debtFormData.totalDebt || ''}
                                    onChange={handleDebtInputChange}
                                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Número de Cuotas
                            </label>
                            <input
                                type="number"
                                name="installmentsCount"
                                value={debtFormData.installments.length}
                                onChange={(e) => setDebtFormData(prev => ({
                                    ...prev,
                                    installments: Array.from({ length: Number(e.target.value) }, (_, i) => ({ month: `Cuota ${i + 1}`, paid: false }))
                                }))}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Período de Pago
                            </label>
                            <select
                                name="paymentPeriod"
                                value={debtFormData.paymentPeriod || 'monthly'}
                                onChange={handleDebtInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isSubmitting}
                            >
                                <option value="monthly">Mensual</option>
                                <option value="biweekly">Quincenal</option>
                            </select>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <button
                onClick={() => setIsOpen(true)}
                className={`w-full ${cards.length === 0 ? 'h-64' : 'h-12'} bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300 transition-colors group`}
            >
                <svg
                    className={`w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors ${cards.length === 0 ? '' : 'hidden'}`}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M12 4v16m8-8H4"></path>
                </svg>
                <span className={`mt-2 text-gray-500 group-hover:text-blue-600 transition-colors font-medium ${cards.length === 0 ? '' : 'hidden'}`}>Agregar Nueva Tarjeta Financiera</span>
                {cards.length > 0 && <span className="text-blue-700">Agregar Tarjeta</span>}
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    role="dialog"
                    aria-labelledby="modal-title"
                    aria-hidden={!isOpen}
                >
                    <div
                        ref={modalRef}
                        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
                                    Nueva Tarjeta Financiera
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ej: Salario, Arriendo, Cuenta Ahorros..."
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Categoría *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        disabled={isSubmitting}
                                    >
                                        <option value="income">Ingreso</option>
                                        <option value="expense">Egreso</option>
                                        <option value="bank-account">Cuenta Bancaria</option>
                                        <option value="savings">Ahorro</option>
                                        <option value="investment">Inversión</option>
                                        <option value="debt">Deuda</option>
                                    </select>
                                </div>

                                {formData.category === 'debt' ? (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Monto Inicial
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={debtFormData.amount || ''}
                                                onChange={handleDebtInputChange}
                                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">
                                            Monto Inicial
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formData.amount || ''}
                                                onChange={handleInputChange}
                                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {formData.category === 'expense'
                                                ? 'Se guardará como egreso (negativo)'
                                                : 'Se guardará como ingreso (positivo)'
                                            }
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Descripción *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        placeholder="Describe esta tarjeta financiera..."
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {renderCategorySpecificFields()}

                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </button>
                                    {formData.category === 'debt' ? (
                                        <button
                                            type="button"
                                            onClick={handleAddDebtCard}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Guardar Tarjeta de Deuda'}
                                        </button>
                                    ) : (
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Guardando...' : 'Guardar Tarjeta'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {cards.map((card) => (
                <div key={card.id} className="p-4 bg-white shadow-lg rounded-lg">
                    <h2 className="text-lg font-bold text-gray-900">{card.title}</h2>
                    <p className="text-sm text-gray-500">{getCategoryLabel(card.category)}</p>
                    <p className="text-sm text-gray-500">{card.description}</p>
                    <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                        Eliminar Tarjeta
                    </button>
                </div>
            ))}
        </div>
    );
}