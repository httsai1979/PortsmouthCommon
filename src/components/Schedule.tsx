import Icon from './Icon';
import type { Resource } from '../data';

export const CategoryButton = ({ label, icon, active, onClick, color }: { label: string; icon: string; active: boolean; onClick: () => void; color: string }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-[28px] transition-all duration-300 ${active ? 'ring-4 ring-black/5 scale-[0.98]' : 'hover:scale-[1.02]'} ${color}`}
    >
        <div className="mb-2"><Icon name={icon} size={28} /></div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</span>
    </button>
);

export const AreaScheduleView = ({ data, area, category }: { data: Resource[]; area: string; category: string }) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6 pb-24">
            {days.map((day, idx) => {
                const dayData = data.filter(item => {
                    const matchesArea = area === 'All' || item.area === area;
                    const matchesCategory = category === 'all' || item.category === category;
                    const isOpen = item.schedule[idx] && item.schedule[idx] !== 'Closed';
                    return matchesArea && matchesCategory && isOpen;
                });

                if (dayData.length === 0) return null;

                return (
                    <div key={day} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {day === days[new Date().getDay()] ? `Today (${day})` : day}
                        </h3>
                        <div className="space-y-3">
                            {dayData.map(item => (
                                <div key={`${item.id}-${day}`} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-900 truncate">{item.name}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase">{item.type} • {item.area}</div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{item.schedule[idx]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
