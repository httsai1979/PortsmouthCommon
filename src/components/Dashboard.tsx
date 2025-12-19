import { useMemo } from 'react';
import type { Resource } from '../data';
import Icon from './Icon';
import { checkStatus } from '../utils';

interface DashboardProps {
    data: Resource[];
    onNavigate: (cat: string) => void;
}

export const Dashboard = ({ data, onNavigate }: DashboardProps) => {
    const stats = useMemo(() => {
        const openNow = data.filter(i => checkStatus(i.schedule).status === 'open').length;
        const totalFood = data.filter(i => i.category === 'food').length;
        const totalBeds = data.filter(i => i.category === 'shelter').length;

        return { openNow, totalFood, totalBeds };
    }, [data]);

    return (
        <div className="mb-8">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-1">Portsmouth Warmth Report</p>
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-500 p-4 rounded-[24px] text-white shadow-lg shadow-emerald-200 cursor-pointer active:scale-95 transition-all" onClick={() => onNavigate('all')}>
                    <div className="text-3xl font-black mb-1">{stats.openNow}</div>
                    <div className="text-[9px] uppercase font-black leading-tight opacity-90">Open<br />Right Now</div>
                </div>
                <div className="bg-indigo-600 p-4 rounded-[24px] text-white shadow-lg shadow-indigo-200 cursor-pointer active:scale-95 transition-all" onClick={() => onNavigate('food')}>
                    <div className="text-3xl font-black mb-1">{stats.totalFood}</div>
                    <div className="text-[9px] uppercase font-black leading-tight opacity-90">Food<br />Stations</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-[24px] text-white shadow-lg shadow-slate-200 cursor-pointer active:scale-95 transition-all" onClick={() => onNavigate('shelter')}>
                    <div className="text-3xl font-black mb-1">{stats.totalBeds}</div>
                    <div className="text-[9px] uppercase font-black leading-tight opacity-90">Shelter<br />Points</div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
                    <Icon name="sparkles" size={24} />
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-sm">Community Pulse</h4>
                    <p className="text-[11px] font-medium text-slate-500 leading-tight">Increased demand for Food in Fratton. All hubs remain operational with high trust scores.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
