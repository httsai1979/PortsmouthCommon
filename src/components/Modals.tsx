import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // 確保這些被正確引用
import Icon from './Icon';

// [核心防禦參數]
const RATE_LIMIT_MINUTES = 10;
const MAX_CONTENT_LENGTH = 300;

export const TipsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[70] flex items-center justify-center p-4 transition-all" onClick={onClose}>
            <div className="bg-white rounded-[40px] w-full max-w-sm overflow-auto max-h-[90vh] animate-bounce-in shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="bg-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
                        <Icon name="info" size={24} /> The Bridge Guide
                    </h2>
                    <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest leading-loose">How we help you cross the bridge to a better tomorrow.</p>
                </div>
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Welcome to Portsmouth Bridge</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">A live tool connecting you to verified support in Portsmouth. Everything you see is real, updated, and works offline.</p>
                    </section>
                    <div className="pt-2">
                        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all">Start Exploring</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CrisisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[80] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden animate-bounce-in shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="bg-rose-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <h2 className="text-2xl font-black flex items-center gap-3 relative z-10"><Icon name="alert" size={24} /> Emergency</h2>
                    <p className="text-rose-100 text-[10px] font-black uppercase tracking-widest mt-2 relative z-10">Immediate Support Required</p>
                </div>
                <div className="p-8 space-y-4 bg-slate-50/50">
                    <a href="tel:999" className="flex items-center w-full bg-white p-5 rounded-3xl border-2 border-rose-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group">
                        <div className="bg-rose-100 text-rose-600 p-3 rounded-2xl mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors"><Icon name="phone" size={20} /></div>
                        <div className="flex-1"><div className="font-black text-slate-900 text-xl">999</div><div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Immediate Police/Ambulance</div></div>
                    </a>
                    <button onClick={onClose} className="w-full py-4 mt-4 bg-slate-200 hover:bg-slate-300 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-colors">Go Back</button>
                </div>
            </div>
        </div>
    );
};

export const ReportModal = ({ isOpen, onClose, resourceName, resourceId }: { isOpen: boolean; onClose: () => void; resourceName: string; resourceId: string }) => {
    const [reason, setReason] = useState('Closed when stated open');
    const [details, setDetails] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [honeypot, setHoneypot] = useState(''); // [防禦] 蜜罐欄位

    // Reset form on open
    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
            setDetails('');
            setReason('Closed when stated open');
            setHoneypot('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // [防禦 1] 蜜罐檢查：機器人如果填了這個隱藏欄位，就直接攔截
        if (honeypot) {
            console.log("Bot detected.");
            setStatus('success'); // 假裝成功，欺騙機器人
            setTimeout(onClose, 1000);
            return;
        }

        // [防禦 2] 頻率限制
        const lastReport = localStorage.getItem('last_report_time');
        if (lastReport && (Date.now() - parseInt(lastReport)) < RATE_LIMIT_MINUTES * 60 * 1000) {
            alert(`Please wait ${RATE_LIMIT_MINUTES} minutes before reporting again.`);
            return;
        }

        // [防禦 3] 內容長度檢查
        if (details.length > MAX_CONTENT_LENGTH) {
            alert("Details are too long.");
            return;
        }

        setStatus('sending');
        try {
            await addDoc(collection(db, 'reports'), {
                resourceId,
                resourceName,
                reason,
                details: details.slice(0, MAX_CONTENT_LENGTH), // 再次確保截斷
                status: 'pending', // 預設為待審核
                timestamp: serverTimestamp(),
                platform: 'web'
            });
            // 更新本地回報時間戳記
            localStorage.setItem('last_report_time', Date.now().toString());
            setStatus('success');
            setTimeout(onClose, 2000);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-bounce-in relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 transition-colors z-10"><Icon name="x" size={18} /></button>
                
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900">Report Issue</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Help us keep {resourceName} accurate.</p>
                </div>

                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce"><Icon name="check" size={32} /></div>
                            <h4 className="text-xl font-black text-slate-900">Thank You</h4>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Your report has been received.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* [防禦] 隱藏的蜜罐欄位 */}
                            <input type="text" name="website_url" value={honeypot} onChange={e=>setHoneypot(e.target.value)} style={{display:'none'}} autoComplete="off" tabIndex={-1} />
                            
                            <div className="grid grid-cols-2 gap-2">
                                {['Closed', 'Wrong Time', 'Low Stock', 'Other'].map(opt => (
                                    <button key={opt} type="button" onClick={() => setReason(opt)} className={`p-3 rounded-xl text-xs font-bold border-2 transition-all ${reason === opt ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'}`}>{opt}</button>
                                ))}
                            </div>
                            
                            <div>
                                <textarea className="w-full p-3 bg-slate-50 rounded-xl border-2 border-slate-100 text-sm font-medium outline-none focus:border-indigo-500 h-24 resize-none" placeholder="Details (optional)..." value={details} onChange={e => setDetails(e.target.value)} maxLength={MAX_CONTENT_LENGTH} />
                                <p className="text-[9px] text-right text-slate-300 mt-1">{details.length}/{MAX_CONTENT_LENGTH}</p>
                            </div>

                            <button type="submit" disabled={status === 'sending'} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                                {status === 'sending' ? 'Sending...' : 'Submit Report'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export const PartnerRequestModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({ orgName: '', email: '', phone: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await addDoc(collection(db, 'partner_requests'), {
                ...formData,
                timestamp: serverTimestamp(),
                status: 'new'
            });
            setStatus('success');
            setTimeout(() => { onClose(); setStatus('idle'); setFormData({ orgName: '', email: '', phone: '' }); }, 2000);
        } catch (e) {
            console.error(e);
            alert("Error sending request.");
            setStatus('idle');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-5 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500"><Icon name="x" size={20} /></button>
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3"><Icon name="briefcase" size={24} /></div>
                    <h3 className="text-lg font-black text-slate-900">Partner Access</h3>
                </div>
                {status === 'success' ? <div className="text-center py-6 text-emerald-600 font-bold">Request Sent!</div> : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input required className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold" placeholder="Organization Name" value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} />
                        <input required type="email" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold" placeholder="Official Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        <input required type="tel" className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold" placeholder="Contact Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <button type="submit" disabled={status === 'sending'} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all">{status === 'sending' ? 'Sending...' : 'Request Access'}</button>
                    </form>
                )}
            </div>
        </div>
    );
};