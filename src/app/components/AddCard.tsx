// src/app/components/AddFinanceCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment';
type TransactionType = 'fixed' | 'variable';

interface FinanceCardData {
    title: string;
    category: CardCategory;
    amount: number;
    description: string;
    transactionType?: TransactionType;
    bankName?: string;
    accountNumber?: string;
    frequency?: 'monthly' | 'weekly' | 'yearly';
}

export default function AddFinanceCard() {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState<FinanceCardData>({
        title: '',
        category: 'income',
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica del formulario
        if (!formData.title || formData.amount <= 0) {
            alert('Por favor, completa todos los campos obligatorios correctamente.');
            return;
        }

        try {
            console.log('Nueva tarjeta financiera:', formData);
            setIsOpen(false);
            setFormData({
                title: '',
                category: 'income',
                amount: 0,
                description: '',
                transactionType: 'fixed',
            });
        } catch (error) {
            console.error('Error al crear la tarjeta:', error);
        }
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
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Número de Cuenta
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
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
                                value={formData.transactionType}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
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
                                value={formData.frequency}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="monthly">Mensual</option>
                                <option value="weekly">Semanal</option>
                                <option value="yearly">Anual</option>
                            </select>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full h-[400px] bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300 transition-colors"
            >
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M12 4v16m8-8H4"></path>
                </svg>
                <span className="mt-2 text-gray-500">Agregar Nueva Tarjeta Financiera</span>
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
                        className="bg-white rounded-lg shadow-xl w-full max-w-md"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 id="modal-title" className="text-xl font-bold text-gray-900">
                                    Agregar Nueva Tarjeta Financiera
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-500"
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
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Categoría
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="income">Ingreso</option>
                                        <option value="expense">Egreso</option>
                                        <option value="bank-account">Cuenta Bancaria</option>
                                        <option value="savings">Ahorro</option>
                                        <option value="investment">Inversión</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Monto
                                    </label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount || ''}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                        step="0.01"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                        Descripción
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows={3}
                                        required
                                    />
                                </div>

                                {renderCategorySpecificFields()}

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
