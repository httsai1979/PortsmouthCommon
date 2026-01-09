import { useState } from 'react';
import Icon from './Icon';

interface FAQItem {
    question: string;
    answer: string;
    category: 'community' | 'access' | 'privacy' | 'essentials';
    action: string;
    actionLabel: string;
}

// [文案重寫] 使用賦權 (Empowerment) 語言，避免 "Help" 或 "Crisis"
const FAQ_DATA: FAQItem[] = [
    // --- Community (取代 Dignity) ---
    {
        category: 'community',
        question: "Who are these services for?",
        answer: "They are for everyone in Portsmouth. Whether you are managing rising costs, between jobs, or just want to reduce food waste, you are a welcome guest.",
        action: "all",
        actionLabel: "Explore All Spaces"
    },
    {
        category: 'community',
        question: "Do I need to be 'in crisis' to visit?",
        answer: "No. Many community pantries are open to all members to help weekly budgets stretch further. It is a smart way to manage your household.",
        action: "food",
        actionLabel: "Find Community Pantries"
    },

    // --- Access (取代 Rules) ---
    {
        category: 'access',
        question: "Do I need a referral voucher?",
        answer: "Most places marked with the green 'Open Access' tag welcome you without any paperwork. Just walk in.",
        action: "no_referral",
        actionLabel: "Show Open Access Places"
    },
    {
        category: 'access',
        question: "I'm worried about going alone.",
        answer: "That is completely normal. Our 'Community Hubs' are known for their friendly, social atmosphere. You can just go for a coffee first to see how it feels.",
        action: "support",
        actionLabel: "Find a Friendly Hub"
    },

    // --- Essentials (取代 Logistics) ---
    {
        category: 'essentials',
        question: "Where can I find a warm meal today?",
        answer: "Several community kitchens serve hot, nutritious meals every day. It's a chance to sit down and eat with neighbors.",
        action: "food",
        actionLabel: "See Today's Meals"
    },
    {
        category: 'essentials',
        question: "Is there somewhere safe to charge my phone?",
        answer: "Yes. Libraries and Warm Spaces offer free power, WiFi, and a comfortable seat. No purchase necessary.",
        action: "warmth",
        actionLabel: "Find Warm Spaces"
    },

    // --- Privacy (建立信任) ---
    {
        category: 'privacy',
        question: "Will my visit be recorded?",
        answer: "This app does not track you. Most open access places do not keep records of who visits. Your privacy is respected.",
        action: "privacy",
        actionLabel: "Read Privacy Promise"
    }
];

const FAQSection = ({ onClose, onNavigate }: { onClose: () => void; onNavigate: (category: string) => void }) => {
    // 簡化狀態管理，避免 React Suspense 錯誤
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const filteredFAQ = FAQ_DATA.filter(item => 
        activeCategory === 'all' || item.category === activeCategory
    );

    const categories = [
        { id: 'all', label: 'All Topics' },
        { id: 'community', label: 'Community' },
        { id: 'access', label: 'How to Visit' },
        { id: 'essentials', label: 'Essentials' },
        { id: 'privacy', label: 'Privacy' }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in-up pb-32">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Support Guide</h2>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Common Questions</p>
                </div>
                <button onClick={onClose} className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all">
                    <Icon name="x" size={24} />
                </button>
            </div>

            {/* Category Pills */}
            <div className="px-5 py-4 bg-white border-b border-slate-50 flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }} 
                        className={`px-5 py-3 rounded-full text-[11px] font-black uppercase tracking-wider border transition-all whitespace-nowrap ${
                            activeCategory === cat.id 
                            ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
                {filteredFAQ.map((item, idx) => (
                    <div key={idx} className={`bg-white rounded-[24px] border-2 transition-all duration-300 overflow-hidden ${openIndex === idx ? 'border-indigo-600 shadow-xl scale-[1.01]' : 'border-slate-100'}`}>
                        <button 
                            onClick={() => setOpenIndex(openIndex === idx ? null : idx)} 
                            className="w-full flex justify-between items-center p-5 text-left active:bg-slate-50"
                        >
                            <span className={`text-sm font-bold pr-4 leading-relaxed ${openIndex === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                                {item.question}
                            </span>
                            <div className={`p-2 rounded-full transition-colors ${openIndex === idx ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                <Icon name={openIndex === idx ? "chevron-up" : "chevron-down"} size={16} />
                            </div>
                        </button>
                        
                        {openIndex === idx && (
                            <div className="px-6 pb-6 pt-0 animate-fade-in">
                                <p className="text-sm text-slate-600 leading-relaxed font-medium mb-6">
                                    {item.answer}
                                </p>
                                
                                {/* 智慧引導按鈕 (Action Button) */}
                                {item.action !== 'privacy' && (
                                    <button 
                                        onClick={() => { onClose(); onNavigate(item.action); }}
                                        className="w-full py-4 bg-indigo-50 text-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors border border-indigo-100"
                                    >
                                        {item.actionLabel} <Icon name="arrow-right" size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Human Connection Box */}
                <div className="mt-8 p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[32px] text-white text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Icon name="heart" size={24} className="text-rose-300" />
                        </div>
                        <h4 className="text-lg font-black mb-2">Prefer to talk to someone?</h4>
                        <p className="text-sm text-indigo-200 mb-6 font-medium leading-relaxed max-w-xs mx-auto">
                            Visit a "Community Hub". Volunteers are there to listen, not to judge.
                        </p>
                        <button 
                            onClick={() => { onClose(); onNavigate('support'); }} 
                            className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-indigo-50"
                        >
                            Find a Local Hub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;