import { useState, useEffect } from 'react';
import Icon from './Icon';

interface Bulletin {
    id: string;
    type: 'positive' | 'urgent' | 'impact';
    title: string;
    message: string;
    cta?: string;
}

const BULLETINS: Bulletin[] = [
    {
        id: '1',
        type: 'positive',
        title: "You're Not Alone",
        message: "Over 40+ community partners in Portsmouth are open today, ready to welcome you with a warm meal and a friendly face.",
        cta: "Find a Hub"
    },
    {
        id: '2',
        type: 'impact',
        title: "Shared Power",
        message: "Last month, our community shared 1,200+ meals across the city. We are stronger when we sustain each other.",
        cta: "See Success Stories"
    },
    {
        id: '3',
        type: 'positive',
        title: "Dignity First",
        message: "Did you know? Most hubs are 'Open Access'—no ID, no paperwork required. You are a neighbor, not a case file.",
        cta: "Read Our Promise"
    },
    {
        id: '4',
        type: 'urgent',
        title: "Stay Warm Tonight",
        message: "Winter Hubs are active tonight at 5 locations. Safe, warm spaces with hot tea and connectivity available.",
        cta: "Safe Sleep Map"
    }
];

const CommunityBulletin = ({ onCTAClick }: { onCTAClick: (id: string) => void }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % BULLETINS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const active = BULLETINS[activeIndex];

    return (
        <div className="relative mb-8 group overflow-hidden rounded-[40px] shadow-2xl shadow-indigo-100/50">
            {/* Background Layer with Animated Shift */}
            <div className={`absolute inset-0 transition-all duration-1000 ${active.type === 'urgent' ? 'bg-gradient-to-br from-rose-600 to-rose-900' :
                active.type === 'impact' ? 'bg-gradient-to-br from-emerald-600 to-emerald-900' :
                    'bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900'
                }`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-2xl"></div>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 p-8 min-h-[220px] flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">
                                {active.type === 'urgent' ? 'Active Update' : active.type === 'impact' ? 'City Impact' : 'Support Voice'}
                            </span>
                        </div>
                        {active.type === 'urgent' && <div className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></div>}
                    </div>

                    <h2 className="text-3xl font-black text-white tracking-tighter mb-2 leading-tight drop-shadow-sm">
                        {active.title}
                    </h2>
                    <p className="text-white/80 text-xs font-bold leading-relaxed mb-6 max-w-[85%]">
                        {active.message}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => onCTAClick(active.id)}
                        className="px-6 py-3 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-2"
                    >
                        {active.cta}
                        <Icon name="arrow-right" size={14} />
                    </button>

                    {/* Indicators */}
                    <div className="flex gap-2">
                        {BULLETINS.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${activeIndex === i ? 'w-8 bg-white' : 'w-1.5 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityBulletin;
