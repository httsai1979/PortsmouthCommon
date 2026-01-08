import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import type { ServiceDocument } from '../types/schema';
import Icon from './Icon';

const PartnerDashboard = () => {
    const { currentUser } = useAuth();
    const [managedServices, setManagedServices] = useState<ServiceDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        // 監聽雲端資料庫的變化
        const unsubscribe = onSnapshot(collection(db, 'services'), (snapshot) => {
            const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceDocument));
            setManagedServices(services);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    // 更新狀態的功能
    const updateStatus = async (serviceId: string, updates: any) => {
        setUpdating(serviceId);
        try {
            const serviceRef = doc(db, 'services', serviceId);
            await updateDoc(serviceRef, {
                ...updates,
                'liveStatus.lastUpdated': new Date().toISOString()
            });
        } catch (error) {
            console.error("Error:", error);
            alert("更新失敗，請檢查權限或網路");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">載入中...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8 pb-32">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">合作夥伴儀表板</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">即時資源管理中心</p>
                </div>
                <div className="px-4 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                    Live System
                </div>
            </div>

            {/* 如果沒有資料，顯示引導畫面 (這是新增的部分) */}
            {managedServices.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="info" size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">資料庫目前是空的</h3>
                    <p className="text-xs text-slate-500 font-medium mb-6 max-w-xs mx-auto">
                        這可能是第一次使用，請先到「Data Migration」頁面將初始資料上傳。
                    </p>
                    <div className="p-4 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl inline-block">
                        請點擊上方的 "Data Migration" 按鈕開始設定
                    </div>
                </div>
            ) : (
                // 如果有資料，顯示控制卡片
                <div className="grid gap-6">
                    {managedServices.map(service => (
                        <div key={service.id} className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 overflow-hidden relative">
                            
                            {/* 更新中的遮罩動畫 */}
                            {updating === service.id && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
                                    <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        更新中...
                                    </div>
                                </div>
                            )}

                            {/* 卡片標題與狀態 */}
                            <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{service.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${service.liveStatus.isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {service.liveStatus.isOpen ? '營業中 (Open)' : '已關閉 (Closed)'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-300 uppercase">最後更新: {new Date(service.liveStatus.lastUpdated).toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                {/* 開關按鈕 */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(service.id, { 'liveStatus.isOpen': true })}
                                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${service.liveStatus.isOpen ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        開啟
                                    </button>
                                    <button
                                        onClick={() => updateStatus(service.id, { 'liveStatus.isOpen': false })}
                                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${!service.liveStatus.isOpen ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}
                                    >
                                        關閉
                                    </button>
                                </div>
                            </div>

                            {/* 狀態調整區 */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">物資存量 / 容量 (Capacity)</label>
                                <div className="flex gap-2">
                                    {(['High', 'Medium', 'Low', 'Full'] as const).map(lev => (
                                        <button
                                            key={lev}
                                            onClick={() => updateStatus(service.id, { 'liveStatus.capacity': lev })}
                                            className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all border-2 ${service.liveStatus.capacity === lev ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-50 text-slate-400'}`}
                                        >
                                            {lev === 'High' ? '充足' : lev === 'Medium' ? '普通' : lev === 'Low' ? '少量' : '已滿'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 緊急廣播區 */}
                            <div className="mt-8 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">緊急公告 (Broadcast)</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        defaultValue={service.liveStatus.message || ''}
                                        placeholder="例如：目前急需毛毯..."
                                        onBlur={(e) => updateStatus(service.id, { 'liveStatus.message': e.target.value })}
                                        className="flex-1 p-5 bg-slate-50 border-2 border-slate-50 rounded-[24px] outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-bold"
                                    />
                                    <div className="p-5 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center">
                                        <Icon name="zap" size={20} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartnerDashboard;