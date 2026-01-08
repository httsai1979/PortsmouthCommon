import { useState } from 'react';
import Icon from './Icon';

interface FAQItem {
    question: string;
    answer: string;
    category: 'privacy' | 'access' | 'dignity' | 'logistics';
}

// 20 Questions designed with empathy and dignity
const FAQ_DATA: FAQItem[] = [
    // --- Dignity (尊嚴與心理建設) ---
    {
        category: 'dignity',
        question: "Is it okay for me to come here?",
        answer: "Yes, absolutely. These spaces belong to the community—that means you. Whether you are a pensioner, between jobs, or just managing rising costs, you are welcome here as a guest."
    },
    {
        category: 'dignity',
        question: "I have a job, am I still allowed to use this?",
        answer: "Yes. Many working people use community pantries to save money on bills. It is a smart, responsible way to manage your household budget. You are maximizing resources to stay stable."
    },
    {
        category: 'dignity',
        question: "I feel embarrassed to ask for help.",
        answer: "We understand, but please know that everyone needs a hand sometimes. The volunteers are friendly neighbors who just want to share what they have. There is no judgment here, only a warm welcome."
    },
    {
        category: 'dignity',
        question: "Can I give back or volunteer later?",
        answer: "That is a wonderful thought. Many people who visit eventually become volunteers when they are ready. But for now, please just focus on yourself. Using these services *is* supporting the community project."
    },
    {
        category: 'dignity',
        question: "Is this 'charity'?",
        answer: "We prefer to think of it as 'community sharing'. Supermarkets have surplus food, and our partners ensure it gets to people instead of the bin. You are helping to reduce waste and build a stronger community."
    },

    // --- Access (誰可以來、門檻) ---
    {
        category: 'access',
        question: "Do I need to show ID or explain my situation?",
        answer: "For most places marked 'Open Access' (Green tag), you do not need ID or a referral. You can simply walk in. We respect your privacy and you don't need to tell your life story to get a warm meal."
    },
    {
        category: 'access',
        question: "Can I bring my children?",
        answer: "Of course. Look for the 'Family' tag. These are safe, warm places where children can play or read while you have a cup of tea. You are not alone in this."
    },
    {
        category: 'access',
        question: "Can I bring my dog?",
        answer: "Many of our 'Warm Spaces' and outdoor food stops are pet-friendly. Look for the 'Pet Friendly' tag on the card. Your furry friend is family, and we want you both to be safe."
    },
    {
        category: 'access',
        question: "Do I need to be religious?",
        answer: "No. While some hubs are hosted in churches, they are open to everyone regardless of faith or background. You will not be asked to pray or join a service to receive support."
    },
    {
        category: 'access',
        question: "What if I am not a British citizen?",
        answer: "You are our neighbor, and that is enough. Most community meals and pantries do not check immigration status. We are here to support humans, not check paperwork."
    },
    {
        category: 'access',
        question: "Is it safe for women alone?",
        answer: "We prioritize safety. Many hubs have specific 'Women's Safe Space' hours or dedicated areas. You can also look for the 'Women' tag to find services specifically run by and for women."
    },
    {
        category: 'access',
        question: "I have mobility issues, can I access these places?",
        answer: "Most hubs strive to be accessible. Check the 'Details' button on any card to see if it is marked 'Wheelchair Accessible'. If you are unsure, the 'Call' button lets you check directly."
    },

    // --- Logistics (實際操作與細節) ---
    {
        category: 'logistics',
        question: "What is a 'Community Pantry'?",
        answer: "Think of it like a local shop with very low prices. For a small weekly fee (e.g., £4), you can choose your own fresh food, fruit, and veg worth much more (£15-£20). It helps your money go further."
    },
    {
        category: 'logistics',
        question: "Is the food fresh?",
        answer: "Yes. Our partners work hard to provide good quality fresh fruit, vegetables, and bread. It is about dignity and health, not just filling a gap."
    },
    {
        category: 'logistics',
        question: "Can I charge my phone or use WiFi?",
        answer: "Yes. Look for the 'WiFi' and 'Power' tags. Libraries and Warm Hubs are happy for you to stay, charge your device, and get online for free."
    },
    {
        category: 'logistics',
        question: "How often can I visit?",
        answer: "For 'Open Access' meals, you can usually go every time they are open. For Pantries, it is typically once a week. Check the 'Schedule' on each card to plan your week."
    },
    {
        category: 'logistics',
        question: "What if I have dietary needs (Halal/Vegetarian)?",
        answer: "We have added tags for 'Halal' and 'Vegetarian'. Many community meals offer vegetarian options by default to be inclusive for everyone."
    },
    {
        category: 'logistics',
        question: "How do I find a warm place to just sit?",
        answer: "Select 'Warm Hubs' (Orange Fire Icon) from the menu. These are friendly places like libraries where you can sit, read, and have a hot drink for free, for as long as you like."
    },
    {
        category: 'logistics',
        question: "What if I see information that is wrong?",
        answer: "You can help us. On every place's card, there is now a 'Report Issue' button. If you see a place is closed when it should be open, please let us know so we can help others."
    },

    // --- Privacy (隱私) ---
    {
        category: 'privacy',
        question: "Will anyone know I used this app?",
        answer: "No. This app is designed for your safety. It does not track you, does not ask for your name, and your location stays on your phone. You can use it with complete peace of mind."
    }
];

interface FAQSectionProps {
    onClose: () => void;
}

const FAQSection = ({ onClose }: FAQSectionProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');

    const filteredFAQ = FAQ_DATA.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCat;
    });

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-fade-in-up">
            {/* Header */}
            <div className="bg-white p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Common Questions</h2>
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-widest mt-1">You are not alone</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-4 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 transition-all"
                    aria-label="Close FAQ"
                >
                    <Icon name="x" size={24} />
                </button>
            </div>

            {/* Search */}
            <div className="p-5">
                <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Icon name="search" size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for 'pets', 'job', 'kids'..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-5 pl-14 pr-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none text-base font-bold text-slate-800 shadow-sm transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 'all', label: 'All Questions' },
                    { id: 'dignity', label: 'Community' },
                    { id: 'access', label: 'Can I come?' },
                    { id: 'logistics', label: 'Details' },
                    { id: 'privacy', label: 'Privacy' }
                ].map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-4">
                {filteredFAQ.length > 0 ? (
                    filteredFAQ.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm hover:border-indigo-50 transition-all group">
                            <div className="flex gap-4 items-start mb-3">
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-black ${item.category === 'dignity' ? 'bg-rose-50 text-rose-600' :
                                    item.category === 'privacy' ? 'bg-emerald-50 text-emerald-600' :
                                        item.category === 'access' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    ?
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors pt-1">
                                    {item.question}
                                </h3>
                            </div>
                            <div className="pl-14">
                                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-400 font-bold">
                        No questions found matching your search.
                    </div>
                )}

                {/* Human Connection Box */}
                <div className="mt-8 p-8 bg-indigo-900 rounded-[32px] text-white text-center relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <Icon name="heart" size={40} className="mx-auto mb-4 text-rose-400" />
                        <h4 className="text-xl font-black mb-2">Still unsure?</h4>
                        <p className="text-sm text-indigo-200 mb-6 font-medium leading-relaxed">
                            Sometimes it helps to see a friendly face. Visit any "Community Hub" on the map, and a volunteer will be happy to chat with you.
                        </p>
                        <button onClick={onClose} className="px-8 py-4 bg-white text-indigo-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-indigo-50">
                            Find a Hub Nearby
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;