import { useState } from 'react';
import Icon from './Icon';

interface FAQItem {
    question: string;
    answer: string;
    category: 'privacy' | 'access' | 'dignity' | 'logistics';
}

const FAQ_DATA: FAQItem[] = [
    {
        category: 'dignity',
        question: "Is it normal to feel hesitant about using these services?",
        answer: "Absolutely. Many of us were taught that we should always be the ones helping others, not the other way around. But life is a series of bridges—sometimes you're the one crossing, and sometimes you're the one providing support. Using these resources isn't 'charity'; it's part of a community ecosystem where we look out for one another."
    },
    {
        category: 'access',
        question: "Is this app only for people who are 'homeless'?",
        answer: "No. Portsmouth Bridge is for anyone in our city who is facing a gap in their needs. Whether you are a student, a working parent, a pensioner, or currently without a home, these community partners are here for you. If you're struggling with food, warmth, or just need a safe space, you belong here."
    },
    {
        category: 'privacy',
        question: "What happens to my personal data when I use this app?",
        answer: "Nothing. We built this with 'Privacy by Design.' We do not require logins, we do not store your name, and your GPS location never leaves your phone. We believe that seeking help shouldn't come with the price of your privacy."
    },
    {
        category: 'dignity',
        question: "I have a job, but I still can't make ends meet. Can I still use the 'Food Support'?",
        answer: "Yes. In fact, a significant number of people using Portsmouth shared meals and pantries are in employment. Cost of living is high, and no one should have to choose between heating and eating. You are maximizing your budget so you can stay stable, which is a smart and responsible choice."
    },
    {
        category: 'access',
        question: "Do I need a 'Referral' from a doctor or the council?",
        answer: "Many of the services on this map are 'Direct Access,' meaning you can just turn up during their opening hours. If a service requires a referral, it will be clearly marked with a 'Referral Only' tag. We prioritize showing you places where you can get help immediately."
    },
    {
        category: 'logistics',
        question: "What is the difference between a 'Food Bank' and a 'Community Pantry'?",
        answer: "A Food Bank typically provides an emergency three-day parcel of essentials. A Community Pantry (or Social Supermarket) is a more long-term, dignified model where you often pay a small membership fee (e.g., £4) to choose £20-30 worth of fresh food, much like a regular shop."
    },
    {
        category: 'dignity',
        question: "Will people look at me differently if they see me at these places?",
        answer: "The truth is, most people at these hubs are in similar situations or are dedicated volunteers who truly care. These spaces are designed to be 'shared tables' and community hubs, not 'handout lines.' They are places of connection, conversation, and mutual respect."
    },
    {
        category: 'access',
        question: "I'm worried about bringing my children. Are these spaces family-friendly?",
        answer: "Many of our partners provide dedicated family spaces, play areas, or 'Family Shared Meals.' Look for the 'Family' tag in the app. These hubs are often the heart of the neighborhood and very welcoming to parents and children."
    },
    {
        category: 'logistics',
        question: "What should I do if a service listed is closed or the info is wrong?",
        answer: "We work hard to keep data updated, but things change. Always check the 'Verified' status. If you find a mistake, you can use the 'Report' button (coming soon) or simply check the 'Live Status' updates which are managed by volunteers on the ground."
    },
    {
        category: 'privacy',
        question: "Is there a 'Stealth Mode' for using the app in public?",
        answer: "Yes! Tap the 'Eye' icon in the header. It will desaturate the colors and change the app's title to 'Safe Compass' so it's less obvious to anyone looking over your shoulder. Your safety and comfort are our priority."
    },
    {
        category: 'dignity',
        question: "I feel like I'm taking resources away from someone 'worse off.' What should I do?",
        answer: "This is a common worry, but resources are allocated to be used. By using these services when you need them, you are helping the organizations demonstrate the need for their funding and support. Staying stable now prevents a larger crisis later. You are worth the investment."
    },
    {
        category: 'access',
        question: "Can I use these services if I am an 'Asylum Seeker' or have 'No Recourse to Public Funds'?",
        answer: "Yes. The vast majority of community shared meals and safe spaces do not check your immigration status. They are humanitarian operations provided by local people to help local people. Everyone is human, and everyone is welcome."
    },
    {
        category: 'logistics',
        question: "What are 'Warm Hubs'?",
        answer: "Warm Hubs are safe, heated community spaces (like libraries or community centers) where you can sit, stay warm, and often get a free cup of tea or charge your phone without any pressure to buy anything or leave."
    },
    {
        category: 'dignity',
        question: "How can I give back when I'm back on my feet?",
        answer: "The best way to give back is to pay it forward. Once you're stable, consider volunteering for a few hours or simply sharing this app with someone else who might be struggling. The goal of Portsmouth Bridge is to turn recipients into part of the support network."
    },
    {
        category: 'access',
        question: "What if I have an addiction or mental health struggle?",
        answer: "You are still welcome. We have 'Health Support' and 'Wellbeing' tags for services that specialize in these areas. Many hubs are 'low-threshold,' meaning they meet you where you are without judgment."
    },
    {
        category: 'logistics',
        question: "Can I bring my dog or pet?",
        answer: "Look for the 'Pet Friendly' tag in the resource details. Many 'Safe Sleep' and 'Warm Hubs' understand that your pet is family and will have provisions for them."
    },
    {
        category: 'dignity',
        question: "Is it okay to use multiple services in one day?",
        answer: "Yes. You can use our 'Journey Planner' (the 'My Journey' button) to schedule a visit to a morning pantry and an afternoon shared meal. This is a smart way to manage your day and ensure you are well-supported."
    },
    {
        category: 'access',
        question: "I'm a veteran. Are there specific services for me?",
        answer: "Portsmouth has a strong military history. Several of our partners have veteran-specific advisors. Check the 'Support' category or search specifically for 'Veteran' in the search bar."
    },
    {
        category: 'privacy',
        question: "Do these hubs share my data with the police or government?",
        answer: "No. These are independent charities and community groups. Their purpose is support, not surveillance. They operate under strict confidentiality agreements to ensure your trust is protected."
    },
    {
        category: 'dignity',
        question: "Why is the app called 'The Bridge'?",
        answer: "Because a bridge connects two points that would otherwise be isolated. It’s a path over a difficult gap. We are the connection between the wealth of community support in Portsmouth and the people who need it most. You are the one walking across it."
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">You are not alone in your journey</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-slate-200 transition-all"
                >
                    <Icon name="x" size={20} />
                </button>
            </div>

            {/* Search */}
            <div className="p-5">
                <div className="relative group">
                    <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search questions (e.g., 'privacy', 'kids')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-4 pl-12 pr-4 bg-white rounded-2xl border-2 border-slate-100 focus:border-indigo-600 outline-none text-xs font-bold shadow-sm transition-all"
                    />
                </div>
            </div>

            {/* Category Filter */}
            <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['all', 'dignity', 'access', 'privacy', 'logistics'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-4">
                {filteredFAQ.length > 0 ? (
                    filteredFAQ.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[28px] border-2 border-slate-100 shadow-sm hover:border-indigo-50 transition-all group">
                            <div className="flex gap-4 items-start mb-3">
                                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black ${item.category === 'dignity' ? 'bg-rose-50 text-rose-600' :
                                    item.category === 'privacy' ? 'bg-emerald-50 text-emerald-600' :
                                        item.category === 'access' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                    Q
                                </div>
                                <h3 className="text-sm font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                                    {item.question}
                                </h3>
                            </div>
                            <div className="pl-12">
                                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-400 italic">
                        No answers found for your search. Please try a broader term.
                    </div>
                )}

                <div className="mt-8 p-8 bg-indigo-900 rounded-[32px] text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <Icon name="heart" size={32} className="mx-auto mb-4 text-rose-400" />
                        <h4 className="text-lg font-black mb-2">Still need to talk?</h4>
                        <p className="text-xs text-indigo-200 mb-6 font-medium">Use our Decision Wizard or find your local hub to speak with a community advocate in person.</p>
                        <button className="px-8 py-3 bg-white text-indigo-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">Connect with Someone</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
