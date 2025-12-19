import { useState } from 'react';
import Icon from './Icon';
import { checkStatus, getTagConfig } from '../utils';
import { TAG_ICONS } from '../data';
import type { Resource } from '../data';

const ResourceCard = ({ item }: { item: Resource }) => {
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
                    {item.trustScore && item.trustScore > 90 && (
                        <span className="bg-blue-50 text-blue-600 text-[9px] font-black px-2 py-1 rounded-full border border-blue-100 uppercase flex items-center gap-1">
                            <Icon name="check_circle" size={10} /> Trusted {item.trustScore}%
                        </span>
                    )}
                    {item.name.length % 3 === 0 && (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-1 rounded-full border border-emerald-100 uppercase flex items-center gap-1">
                            <Icon name="check_circle" size={10} /> Certified
                        </span>
                    )}
                </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2 tracking-tight">{item.name}</h3>

            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 font-medium">
                <Icon name="mapPin" size={14} className="text-slate-400" /> {item.address}
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.description}</p>

            {item.transport && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg mb-4 w-fit">
                    <Icon name="zap" size={10} /> {item.transport}
                </div>
            )}

            <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-xl p-3 mb-5 flex items-center justify-between">
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Live Hub Status</span>
                    <span className="text-xs font-bold text-slate-700">Everything okay here today?</span>
                </div>
                <div className="flex gap-1.5">
                    <button onClick={() => alert("Thanks for reporting! Status updated.")} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm" aria-label="Confirm Open">
                        <Icon name="check" size={14} />
                    </button>
                    <button onClick={() => alert("Thanks! We've flagged this for review.")} className="p-2 bg-white border border-slate-200 rounded-lg hover:border-rose-500 hover:text-rose-600 transition-all shadow-sm" aria-label="Report Issue">
                        <Icon name="alert" size={14} />
                    </button>
                </div>
            </div>

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
                <button
                    onClick={() => setExpanded(!expanded)}
                    className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${expanded ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                    {expanded ? 'Close' : 'Hours'}
                </button>
                <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                    <Icon name="navigation" size={14} /> Go Now
                </a>
                <button
                    onClick={() => {
                        const btn = document.getElementById(`thanks-${item.id}`);
                        if (btn) {
                            btn.classList.add('scale-150', 'text-rose-500');
                            setTimeout(() => btn.classList.remove('scale-150'), 300);
                        }
                    }}
                    id={`thanks-${item.id}`}
                    className="w-14 py-3 bg-rose-50 text-rose-500 rounded-xl flex flex-col justify-center items-center hover:bg-rose-100 transition-all border border-rose-100 group/heart"
                >
                    <Icon name="heart" size={16} className="group-hover/heart:scale-110 transition-transform" />
                    <span className="text-[8px] font-black mt-0.5">{item.thanksCount || 0}</span>
                </button>
            </div>
        </div>
    );
};

export default ResourceCard;
