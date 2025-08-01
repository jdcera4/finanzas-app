'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { realtimeDb, auth } from '../../lib/firebase';
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

        const userCardsRef = ref(realtimeDb, `users/${user.uid}/financeCards`);
        const unsubscribe = onValue(userCardsRef, (snapshot) => {
            const data = snapshot.val();
            const newCards = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key],
            })) : [];
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
