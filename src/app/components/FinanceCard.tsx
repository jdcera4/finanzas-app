'use client';

import { useState, useRef, useEffect } from 'react';

type CardCategory = 'income' | 'expense' | 'bank-account' | 'savings' | 'investment';

export default function FinanceCard() {
    const [formData, setFormData] = useState({
        title: '',
        category: 'income',
        amount: 0,
        description: '',
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Formulario enviado:', formData);
    };

    return (
        <div className="finance-card">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Categoría</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}>
                        <option value="income">Ingreso</option>
                        <option value="expense">Egreso</option>
                    </select>
                </div>
                <div>
                    <label>Monto</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}
