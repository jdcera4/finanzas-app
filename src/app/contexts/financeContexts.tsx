'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import type { FinanceCard, User } from '../../types';

interface FinanceContextType {
    cards: FinanceCard[];
    loading: boolean;
    user: User | null;
}

const FinanceContext = createContext<FinanceContextType>({
    cards: [],
    loading: true,
    user: null,
});

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
    const [cards, setCards] = useState<FinanceCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                });
            } else {
                setUser(null);
            }
        });

        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!user) {
            setCards([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'cards'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newCards = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as FinanceCard[];

            setCards(newCards);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <FinanceContext.Provider value={{ cards, loading, user }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => useContext(FinanceContext);

export default FinanceContext;
