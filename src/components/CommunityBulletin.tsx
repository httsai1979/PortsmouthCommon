import Icon from './Icon';

interface Bulletin {
    id: string;
    title: string;
    desc: string;
    icon: string;
    theme: 'indigo' | 'emerald' | 'orange' | 'rose';
    cta: string;
}

// [內容優化] 改為針對使用者最迫切的四大需求，採用賦權與溫暖的語氣
const BULLETINS: Bulletin[] = [
    {
        id: '1',
        title: "Open Right Now",
        desc: "See what is open at this exact moment. Don't waste a journey.",
        icon: "clock",
        theme: "emerald",
        cta: "Check Map"
    },
    {
        id: '2',
        title: "Free Hot Meals",
        desc: "Find community kitchens serving nutritious food today.",
        icon: "utensils",
        theme: "orange",
        cta: "Find Food"
    },
    {
        id: '3',
        title: "Safe & Warm",
        desc: "Libraries and hubs offering free warmth, WiFi, and charging.",
        icon: "flame",
        theme: "rose",
        cta: "Find Warmth"
    },
    {
        id: '4',
        title: "No Data? No Problem",
        desc: "This app works offline. Your search history is safe and private.",
        icon: "wifi-off",
        theme: "indigo",
        cta: "Read Guide"
    }
];

const CommunityBulletin = ({ onCTAClick }: { onCTAClick: (id: string) => void }) => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-6 -mx-5 px-5 scrollbar-hide snap-x">
            {BULLETINS.map((item) => (
                <div 
                    key={item.id} 
                    className={`snap-center shrink-0 w-72 p-5 rounded-[32px] relative overflow-hidden shadow-lg transition-all active:scale-95 border-2 
                    ${item.theme === 'indigo' ? 'bg-indigo-900 border-indigo-800 text-white' : ''}
                    ${item.theme === 'emerald' ? 'bg-emerald-600 border-emerald-500 text-white' : ''}
                    ${item.theme === 'orange' ? 'bg-orange-500 border-orange-400 text-white' : ''}
                    ${item.theme === 'rose' ? 'bg-rose-600 border-rose-500 text-white' : ''}
                    `}
                >
                    {/* Decorative Circle for warmth and depth */}
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                        <div>
                            <div className="flex items-center gap-2 mb-2 opacity-90">
                                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                    <Icon name={item.icon} size={16} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {item.theme === 'emerald' ? 'Live Status' : 
                                     item.theme === 'orange' ? 'Eat Well' : 
                                     item.theme === 'rose' ? 'Stay Safe' : 'Accessible'}
                                </span>
                            </div>
                            <h3 className="text-xl font-black leading-tight mb-2 tracking-tight">{item.title}</h3>
                            <p className="text-xs font-medium opacity-90 leading-relaxed max-w-[90%]">
                                {item.desc}
                            </p>
                        </div>

                        <button 
                            onClick={() => onCTAClick(item.id)}
                            className="mt-4 w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors border border-white/10"
                        >
                            {item.cta} <Icon name="arrow-right" size={12} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommunityBulletin;