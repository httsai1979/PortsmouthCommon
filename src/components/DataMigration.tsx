import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { ALL_DATA } from '../data';
import type { ServiceDocument } from '../types/schema';
import { useAuth } from '../contexts/AuthContext';

const DataMigration = () => {
    const { isPartner } = useAuth();
    const [migrating, setMigrating] = useState(false);
    const [log, setLog] = useState<string[]>([]);
    const [firestoreCount, setFirestoreCount] = useState<number | null>(null);

    const addLog = (message: string) => {
        setLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    };

    const checkFirestoreStatus = async () => {
        try {
            addLog('📡 Connecting to database...');
            const snapshot = await getDocs(collection(db, 'services'));
            setFirestoreCount(snapshot.size);
            addLog(`✅ Connection successful! Found ${snapshot.size} active records.`);
        } catch (error: any) {
            console.error(error);
            addLog(`❌ Connection Error: ${error.message}`);
            setFirestoreCount(0);
        }
    };

    const migrateData = async () => {
        if (migrating) return;

        const confirmed = window.confirm(
            `Ready to sanitise and upload ${ALL_DATA.length} records? This will overwrite existing cloud data.`
        );

        if (!confirmed) return;

        setMigrating(true);
        setLog([]);
        addLog('🚀 Starting Data Sanitisation & Upload...');

        const servicesCollection = collection(db, 'services');
        let success = 0;
        let failed = 0;

        for (let i = 0; i < ALL_DATA.length; i++) {
            const resource = ALL_DATA[i];

            // 🛠️ 關鍵修正：使用 ?? null 處理所有可能為 undefined 的欄位
            // Firebase 不接受 undefined，必須轉為 null
            const docData: ServiceDocument = {
                id: resource.id,
                name: resource.name,
                category: (['food', 'shelter', 'warmth', 'support', 'family'].includes(resource.category)
                    ? resource.category
                    : 'support') as any,
                location: {
                    lat: resource.lat,
                    lng: resource.lng,
                    address: resource.address,
                    area: resource.area,
                },
                thresholdInfo: {
                    idRequired: resource.entranceMeta?.idRequired ?? false,
                    queueStatus: resource.entranceMeta?.queueStatus
                        ? (resource.entranceMeta.queueStatus.charAt(0).toUpperCase() + resource.entranceMeta.queueStatus.slice(1)) as any
                        : 'Empty',
                    // [FIX] 這裡加上 ?? null
                    entrancePhotoUrl: resource.entranceMeta?.imageUrl ?? null
                },
                liveStatus: {
                    isOpen: true,
                    // [FIX] 確保 capacityLevel 有值
                    capacity: (resource.capacityLevel === 'low' || resource.capacityLevel === 'medium') 
                        ? (resource.capacityLevel.charAt(0).toUpperCase() + resource.capacityLevel.slice(1)) as any 
                        : 'High',
                    lastUpdated: new Date().toISOString(),
                    message: ""
                },
                b2bData: {
                    // [FIX] 電話如果是 undefined，改為 'N/A'
                    internalPhone: resource.phone || 'N/A',
                    partnerNotes: "System migrated from V1 static dataset."
                },
                description: resource.description,
                tags: resource.tags || [],
                // [FIX] 這裡加上 ?? null
                phone: resource.phone ?? null,
                schedule: resource.schedule || {},
                // [FIX] 這裡加上 ?? 0
                trustScore: resource.trustScore ?? 0
            };

            try {
                await setDoc(doc(servicesCollection, resource.id), docData);
                success++;
                addLog(`✓ Uploaded: ${resource.name}`);
            } catch (error: any) {
                failed++;
                console.error(`Error uploading ${resource.name}:`, error);
                // 顯示更詳細的錯誤訊息以便除錯
                addLog(`❌ Failed: ${resource.name} - ${error.message}`);
            }
        }

        addLog(`🏁 Task Complete! Success: ${success}, Failed: ${failed}`);
        setMigrating(false);
        await checkFirestoreStatus();
    };

    if (!isPartner) return <div className="p-10 text-center">Access Denied</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 pb-32 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">Data Migration Centre</h2>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-100">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Local Data</p>
                        <p className="text-3xl font-black text-slate-900">{ALL_DATA.length}</p>
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Cloud Data</p>
                        <p className={`text-3xl font-black ${firestoreCount === 0 ? 'text-rose-500' : 'text-indigo-600'}`}>
                            {firestoreCount === null ? '?' : firestoreCount}
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={checkFirestoreStatus}
                        className="w-full py-3 bg-white border-2 border-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                    >
                        Check Connection
                    </button>
                    
                    <button
                        onClick={migrateData}
                        disabled={migrating}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-200"
                    >
                        {migrating ? 'Fixing & Uploading...' : 'Start Migration (Retry)'}
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-6 shadow-lg border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase">System Logs</h3>
                    <button onClick={() => setLog([])} className="text-xs text-slate-500 hover:text-white">Clear</button>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1">
                    {log.length === 0 && <span className="text-slate-600 italic">Waiting to start...</span>}
                    {log.map((line, i) => (
                        <div key={i} className={line.includes('❌') ? 'text-rose-400' : line.includes('✓') ? 'text-emerald-400' : ''}>
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataMigration;