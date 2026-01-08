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

    // 這是用來顯示畫面上文字紀錄的功能
    const addLog = (message: string) => {
        setLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
    };

    // 檢查目前雲端有多少資料
    const checkFirestoreStatus = async () => {
        try {
            addLog('📡 正在連接資料庫...');
            const snapshot = await getDocs(collection(db, 'services'));
            setFirestoreCount(snapshot.size);
            addLog(`✅ 連線成功！目前雲端有 ${snapshot.size} 筆資料。`);
        } catch (error: any) {
            console.error(error);
            addLog(`❌ 連線錯誤: ${error.message}`);
            setFirestoreCount(0);
        }
    };

    // 開始上傳資料的主程式
    const migrateData = async () => {
        if (migrating) return;

        // 簡單的防呆確認
        const confirmed = window.confirm(
            `確定要將 ${ALL_DATA.length} 筆靜態資料上傳到雲端資料庫嗎？`
        );

        if (!confirmed) return;

        setMigrating(true);
        setLog([]); // 清空紀錄
        addLog('🚀 開始上傳資料...');

        const servicesCollection = collection(db, 'services');
        let success = 0;
        let failed = 0;

        // 迴圈：一筆一筆上傳
        for (let i = 0; i < ALL_DATA.length; i++) {
            const resource = ALL_DATA[i];

            // 準備要上傳的資料格式
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
                    queueStatus: 'Empty',
                    entrancePhotoUrl: resource.entranceMeta?.imageUrl
                },
                liveStatus: {
                    isOpen: true, 
                    capacity: 'High',
                    lastUpdated: new Date().toISOString(),
                    message: ""
                },
                b2bData: {
                    internalPhone: resource.phone || 'N/A',
                    partnerNotes: "資料由系統自動遷移建立"
                },
                description: resource.description,
                tags: resource.tags,
                phone: resource.phone,
                schedule: resource.schedule,
                trustScore: resource.trustScore
            };

            try {
                // 寫入資料庫
                await setDoc(doc(servicesCollection, resource.id), docData);
                success++;
                addLog(`✓ 成功上傳: ${resource.name}`);
            } catch (error: any) {
                failed++;
                addLog(`❌ 失敗: ${resource.name} (${error.code})`);
            }
        }

        addLog(`🏁 任務結束！ 成功: ${success}, 失敗: ${failed}`);
        setMigrating(false);
        await checkFirestoreStatus(); // 更新狀態
    };

    // 如果不是夥伴帳號，不顯示內容
    if (!isPartner) return <div className="p-10 text-center">沒有權限</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6 pb-32 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">資料遷移中心</h2>
            </div>

            {/* 控制面板 */}
            <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-100">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">本地資料</p>
                        <p className="text-3xl font-black text-slate-900">{ALL_DATA.length}</p>
                    </div>
                    <div className="flex-1 p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">雲端資料</p>
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
                        重新檢查連線
                    </button>
                    
                    <button
                        onClick={migrateData}
                        disabled={migrating}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                    >
                        {migrating ? '資料上傳中...' : '開始上傳資料 (Start Migration)'}
                    </button>
                </div>
            </div>

            {/* 執行紀錄視窗 */}
            <div className="bg-slate-900 rounded-[32px] p-6 shadow-lg border border-slate-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase">系統紀錄</h3>
                    <button onClick={() => setLog([])} className="text-xs text-slate-500 hover:text-white">清除</button>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1">
                    {log.length === 0 && <span className="text-slate-600 italic">等待執行...</span>}
                    {log.map((line, i) => (
                        <div key={i} className={line.includes('❌') ? 'text-rose-400' : line.includes('✅') ? 'text-emerald-400' : ''}>
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataMigration;