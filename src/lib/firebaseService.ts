import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from './firebase';

interface FinanceCard {
    userId: string;
    title: string;
    transactions: Transaction[];
    createdAt: string;
    updatedAt: string;
}

interface Transaction {
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'income' | 'expense';
}

export const financeServices = {
    // Crear nueva tarjeta
    async createCard(userId: string, cardData: Partial<FinanceCard>) {
        try {
            const newCard = {
                ...cardData,
                userId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                transactions: []
            };

            const docRef = await addDoc(collection(db, 'cards'), newCard);
            return docRef.id;
        } catch (error) {
            console.error('Error creando tarjeta:', error);
            throw error;
        }
    },

    // Obtener tarjetas del usuario
    async getUserCards(userId: string) {
        try {
            const q = query(collection(db, 'cards'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error obteniendo tarjetas:', error);
            throw error;
        }
    },

    // Actualizar tarjeta
    async updateCard(cardId: string, data: Partial<FinanceCard>) {
        try {
            const cardRef = doc(db, 'cards', cardId);
            await updateDoc(cardRef, {
                ...data,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error actualizando tarjeta:', error);
            throw error;
        }
    },

    // Eliminar tarjeta
    async deleteCard(cardId: string) {
        try {
            await deleteDoc(doc(db, 'cards', cardId));
        } catch (error) {
            console.error('Error eliminando tarjeta:', error);
            throw error;
        }
    }
};