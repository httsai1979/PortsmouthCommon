import { useState } from 'react';
import Icon from './Icon';
import { checkStatus, getTagConfig } from '../utils';
import { TAG_ICONS } from '../data';

const ResourceCard = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);
    const status = checkStatus(item.schedule);

    return (
        <div className="bg-white p-5 rounded-[24px] mb-4 shadow-sm border border-slate-100 relative group overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-wrap gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${status.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : status.status === 'closing' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                        {status.label}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-50 text-slate-500 border border-slate-100">
                        {item.type}
                    </span>
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">{item.name}</h3>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                <Icon name="mapPin" size={14} className="text-slate-400" /> {item.address}
            </div>

            <p className="text-sm text-slate-600 mb-5 leading-relaxed">{item.description}</p>

            <div className="flex flex-wrap gap-2 mb-5">
                {item.tags.slice(0, 4).map((tag: string) => {
                    const conf = getTagConfig(tag, TAG_ICONS);
                    return (
                        <span key={tag} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${conf.color} bg-slate-50 border border-slate-100`}>
                            <Icon name={conf.icon} size={10} /> {conf.label}
                        </span>
                    );
                })}
            </div>

            {expanded && (
                <div className="bg-slate-50 p-4 rounded-xl mb-5 animate-fade-in text-xs border border-slate-100">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                        <div key={d} className={`flex justify-between py-1.5 border-b border-slate-200/50 last:border-0 ${i === new Date().getDay() ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                            <span>{d}</span><span>{item.schedule[i] || 'Closed'}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2.5">
                <button onClick={() => setExpanded(!expanded)} className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    {expanded ? 'Hide Hours' : 'View Schedule'}
                </button>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`} target="_blank" className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10">
                    <Icon name="navigation" size={12} /> Directions
                </a>
                {item.phone && (
                    <a href={`tel:${item.phone}`} className="w-12 py-3 bg-white border border-slate-200 rounded-xl flex justify-center items-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700">
                        <Icon name="phone" size={16} />
                    </a>
                )}
            </div>
        </div>
    );
};

export default ResourceCard;
