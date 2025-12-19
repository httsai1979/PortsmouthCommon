import { useState, useEffect, useMemo } from 'react';
import Icon from './Icon';
import { checkStatus, getTagConfig } from '../utils';
import { TAG_ICONS, type Resource } from '../data';

interface DashboardProps {
    data: Resource[];
    onNavigate: (cat: string) => void;
}

const Dashboard = ({ data, onNavigate }: DashboardProps) => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const day = now.getDay();
    const currentHour = now.getHours();

    let greeting = "Good Morning";
    if (currentHour >= 12) greeting = "Good Afternoon";
    if (currentHour >= 17) greeting = "Good Evening";

    const isOpen = (schedule: Record<number, string>) => {
        if (!schedule) return false;
        const hours = schedule[day];
        if (!hours || hours === 'Closed') return false;
        if (hours === "00:00-23:59") return true;
        const [start, end] = hours.split('-');
        const [sH, sM] = start.split(':').map(Number);
        const [eH, eM] = end.split(':').map(Number);
        const cur = now.getHours() * 60 + now.getMinutes();
        return cur >= (sH * 60 + sM) && cur < (eH * 60 + eM);
    };

    const openFood = data.filter(i => i.category === 'food' && isOpen(i.schedule)).length;
    const openShelter = data.filter(i => i.category === 'shelter' && isOpen(i.schedule)).length;

    const upcoming = useMemo(() => {
        const events: (Resource & { statusLabel: string; statusColor: string; sortKey: number })[] = [];
        data.forEach(item => {
            const status = checkStatus(item.schedule);
            if (status.status !== 'closed') {
                events.push({ ...item, statusLabel: status.label, statusColor: status.color, sortKey: status.status === 'closing' ? 1 : 2 });
            }
        });
        return events.sort((a, b) => a.sortKey - b.sortKey).slice(0, 5);
    }, [data]);

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{greeting},</h1>
                    <p className="text-slate-500 font-medium">Here's what's happening in Portsmouth.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=James`} alt="User" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => onNavigate('food')} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] bg-emerald-50 w-32 h-32 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 text-emerald-600">
                            <div className="bg-emerald-100 p-2 rounded-full"><Icon name="utensils" size={16} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900/60">Food</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{openFood}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">Open Now</div>
                    </div>
                </button>
                <button onClick={() => onNavigate('shelter')} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left group relative overflow-hidden">
                    <div className="absolute right-[-20px] top-[-20px] bg-indigo-50 w-32 h-32 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3 text-indigo-600">
                            <div className="bg-indigo-100 p-2 rounded-full"><Icon name="bed" size={16} /></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-900/60">Shelter</span>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{openShelter}</div>
                        <div className="text-xs font-bold text-slate-400 mt-1">Open Now</div>
                    </div>
                </button>
            </div>

            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Live Activity
                    </h3>
                    <button className="text-xs font-bold text-blue-600" onClick={() => onNavigate('all')}>View All</button>
                </div>
                <div className="space-y-4">
                    {upcoming.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => onNavigate(item.category)}>
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <Icon name={getTagConfig(item.category, TAG_ICONS).icon} size={20} />
                                </div>
                                {item.statusColor.includes('orange') && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                                <div className="flex items-center gap-2 text-xs">
                                    <span className={`px-1.5 py-0.5 rounded-md font-bold ${item.statusColor.includes('orange') ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                        {item.statusLabel}
                                    </span>
                                    <span className="text-slate-400 truncate">• {item.area}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {upcoming.length === 0 && <div className="text-slate-400 text-sm font-medium py-2">No active resources at the moment.</div>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
