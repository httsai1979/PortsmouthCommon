import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ServiceDocument } from '../types/schema';
import { useAppStore } from '../store/useAppStore';

/**
 * Custom hook that implements the Hybrid Data Sync Strategy:
 * 1. Instant Start: Hydrate from bridge_cache (localStorage)
 * 2. Static Baseline: Load latest data.json from server
 * 3. Real-time Overlay: Patch with Firestore updates for any change AFTER the baseline
 */
export const useDataSync = () => {
    const { setData, setSyncStatus, lastUpdated: currentLastUpdated } = useAppStore();

    useEffect(() => {
        let isMounted = true;

        const initializeData = async () => {
            try {
                // Phase 1: Local Cache (Instant Hydration)
                const cached = localStorage.getItem('bridge_cache');
                if (cached && isMounted) {
                    try {
                        const parsed = JSON.parse(cached);
                        // Ensure we have valid data before setting
                        if (parsed && Array.isArray(parsed.data)) {
                            setData(parsed.data, parsed.lastUpdated);
                            setSyncStatus({ loading: false });
                        }
                    } catch (e) {
                        console.warn('Failed to parse cache', e);
                    }
                }

                // Phase 2: Static Baseline (/data.json) - The "Warm" Start
                try {
                    const response = await fetch('/data.json');
                    if (!response.ok) throw new Error('Static baseline unavailable');

                    const staticCore = await response.json();
                    const staticData: ServiceDocument[] = staticCore.data;
                    const staticTimestamp = staticCore.generatedAt;

                    if (isMounted) {
                        setData(staticData, staticTimestamp);
                        setSyncStatus({ loading: false });
                    }

                    // Phase 3: Firestore Hydration - The "Live" Layer
                    setSyncStatus({ isHydrating: true });
                    const servicesRef = collection(db, 'services');

                    // Fetch anything updated since the static baseline was built
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
                            setData(patches);
                        }
                        setSyncStatus({ isHydrating: false });
                    }, (err) => {
                        console.warn('Live Hydration Error (Falling back to static):', err);
                        if (isMounted) setSyncStatus({ isHydrating: false });
                    });

                    return unsubscribe;
                } catch (fetchErr) {
                    console.error('Static data fetch failed:', fetchErr);
                    // If fetch fails (offline), we rely on cache. 
                    // We should still consider "loading" done if we have cache, or error if not.
                    if (isMounted) {
                        setSyncStatus({
                            loading: false, // Stop spinner so app shows
                            error: !cached ? 'Offline and no cache' : null
                        });
                    }
                }

            } catch (err: any) {
                console.error('Data Strategy Error:', err);
                if (isMounted) {
                    setSyncStatus({ error: err.message, loading: false, isHydrating: false });
                }
            }
        };

        const unsubscribePromise = initializeData();

        return () => {
            isMounted = false;
            unsubscribePromise.then(unsub => unsub && unsub());
        };
    }, [setData, setSyncStatus]);

    // Side effect: Persist store data to localStorage whenever it changes
    useEffect(() => {
        const store = useAppStore.getState();
        if (store.data.length > 0) {
            localStorage.setItem('bridge_cache', JSON.stringify({
                data: store.data,
                lastUpdated: store.lastUpdated
            }));
        }
    }, [currentLastUpdated]);
};
