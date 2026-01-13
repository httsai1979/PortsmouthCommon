import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ServiceDocument } from '../types/schema';

interface DataContextType {
    data: ServiceDocument[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<ServiceDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            try {
                // 1. Fallback: Load from Local Storage for instant (offline) start
                const cached = localStorage.getItem('bridge_cache');
                if (cached && isMounted) {
                    try {
                        const parsed = JSON.parse(cached);
                        setData(parsed.data);
                        setLastUpdated(parsed.lastUpdated);
                        setLoading(false);
                    } catch (e) {
                        console.warn('Cache corrupted, ignored.');
                    }
                }

                // 2. Fetch Static Core (JSON)
                const response = await fetch('/data.json');
                if (!response.ok) throw new Error('Failed to fetch static core.');

                const staticCore = await response.json();
                const staticData: ServiceDocument[] = staticCore.data;
                const staticTimestamp = staticCore.generatedAt;

                if (isMounted) {
                    setData(staticData);
                    setLastUpdated(staticTimestamp);
                    setLoading(false);
                }

                // 3. Asynchronously Check Firestore for newer updates (Hybrid Patching)
                // We only fetch docs that were updated AFTER our JSON was generated
                const servicesRef = collection(db, 'services');
                const q = query(
                    servicesRef,
                    where('liveStatus.lastUpdated', '>', staticTimestamp)
                );

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    if (!isMounted) return;

                    const patches = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as ServiceDocument));

                    if (patches.length > 0) {
                        setData(prevData => {
                            const updatedData = [...prevData];
                            patches.forEach(patch => {
                                const index = updatedData.findIndex(item => item.id === patch.id);
                                if (index !== -1) {
                                    updatedData[index] = { ...updatedData[index], ...patch };
                                } else {
                                    updatedData.push(patch);
                                }
                            });

                            // Update Cache
                            const now = new Date().toISOString();
                            localStorage.setItem('bridge_cache', JSON.stringify({
                                data: updatedData,
                                lastUpdated: now
                            }));
                            setLastUpdated(now);

                            return updatedData;
                        });
                    }
                }, (err) => {
                    console.warn('Firestore Patching Error (likely permissions):', err);
                });

                return unsubscribe;

            } catch (err: any) {
                console.error('Hybrid Data Layer Error:', err);
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };

        const unsubscribePromise = initializeData();

        return () => {
            isMounted = false;
            unsubscribePromise.then(unsub => unsub && unsub());
        };
    }, []);

    return (
        <DataContext.Provider value={{ data, loading, error, lastUpdated }}>
            {children}
        </DataContext.Provider>
    );
};
