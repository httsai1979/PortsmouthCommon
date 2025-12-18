import Icon from './Icon';
import { SUPERMARKET_TIPS } from '../data';

export const TipsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 transition-all" onClick={onClose}>
            <div className="bg-white/95 backdrop-blur-xl rounded-[32px] w-full max-w-sm overflow-hidden animate-bounce-in shadow-2xl border border-white/20" onClick={e => e.stopPropagation()}>
                <div className="bg-yellow-400 p-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                    <h2 className="text-xl font-black text-yellow-950 flex items-center gap-3 relative z-10">
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Icon name="tag" size={20} /></div>
                        Yellow Labels
                    </h2>
                    <button onClick={onClose} className="bg-black/10 p-2 rounded-full hover:bg-black/20 text-yellow-950 transition relative z-10"><Icon name="x" size={20} /></button>
                </div>
                <div className="p-6 bg-yellow-50/50">
                    <p className="text-xs font-bold text-yellow-700/60 uppercase tracking-widest mb-4">Supermarket Reduction Guide</p>
                    <div className="space-y-3">
                        {SUPERMARKET_TIPS.map((tip, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-yellow-100 shadow-sm flex justify-between items-center">
                                <span className="font-bold text-slate-800 text-sm">{tip.store}</span>
                                <div className="text-right">
                                    <span className="block text-[10px] font-black text-yellow-700 bg-yellow-100 px-2 py-1 rounded-md">{tip.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const CrisisModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[80] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden animate-bounce-in shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="bg-rose-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <h2 className="text-2xl font-black flex items-center gap-3 relative z-10">
                        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm"><Icon name="alert" size={24} /></div>
                        Emergency
                    </h2>
                    <p className="text-rose-100 text-sm mt-1 ml-1 relative z-10 font-medium">Immediate help contacts</p>
                </div>
                <div className="p-6 space-y-3 bg-rose-50/50">
                    <a href="tel:999" className="flex items-center w-full bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group">
                        <div className="bg-rose-100 text-rose-600 p-3 rounded-full mr-4 group-hover:bg-rose-600 group-hover:text-white transition-colors"><Icon name="phone" /></div>
                        <div><div className="font-black text-slate-900 text-lg">999</div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Police / Ambulance</div></div>
                    </a>
                    <a href="tel:02392882689" className="flex items-center w-full bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Icon name="home" /></div>
                        <div><div className="font-black text-slate-900 text-lg">023 9288 2689</div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Rough Sleeping Hub</div></div>
                    </a>
                    <a href="tel:111" className="flex items-center w-full bg-white p-4 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all group">
                        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Icon name="lifebuoy" /></div>
                        <div><div className="font-black text-slate-900 text-lg">111</div><div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Medical Advice (NHS)</div></div>
                    </a>
                    <button onClick={onClose} className="w-full py-4 mt-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm rounded-2xl transition-colors">Close</button>
                </div>
            </div>
        </div>
    );
};
