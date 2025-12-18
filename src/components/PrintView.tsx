interface PrintViewProps {
    data: any[];
    onClose: () => void;
}

const PrintView = ({ data, onClose }: PrintViewProps) => {
    const today = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getOpenItems = (dayIdx: number) =>
        data.filter((i: any) => i.schedule[dayIdx] !== "Closed" && (i.category === 'food' || i.category === 'shelter' || i.category === 'support' || i.category === 'warmth'));

    return (
        <div className="fixed inset-0 bg-white z-[100] overflow-y-auto p-8 text-black font-mono">
            <div className="max-w-2xl mx-auto border-4 border-black p-8">
                <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">Pompey Haven</h1>
                        <p className="text-sm font-bold">WARMTH • DIGNITY • COMMUNITY</p>
                    </div>
                    <button onClick={onClose} className="bg-black text-white px-6 py-3 font-bold no-print">CLOSE</button>
                </div>

                <div className="mb-8">
                    <p className="font-bold mb-4 text-lg">A weekly guide to support in Portsmouth. You are not alone.</p>
                    <h2 className="text-2xl font-black bg-black text-white inline-block px-3 py-1 mb-6">OPEN TODAY ({days[today]})</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {getOpenItems(today).map(item => (
                            <div key={item.id} className="border-b-2 border-black pb-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-black text-lg">{item.name}</span>
                                    <span className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">{item.schedule[today]}</span>
                                </div>
                                <p className="text-sm font-bold">{item.address}</p>
                                <p className="text-xs mt-1 italic">"{item.description}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t-4 border-black text-center">
                    <p className="font-black text-lg">EMERGENCY: 999</p>
                    <p className="font-bold">Rough Sleeping Hub: 023 9288 2689</p>
                </div>
                <style>{`@media print { .no-print { display: none; } body { background: white; } }`}</style>
            </div>
        </div>
    );
};

export default PrintView;
