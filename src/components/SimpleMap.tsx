import { useState, useMemo } from 'react';
import Icon from './Icon';
import { checkStatus, getTagConfig } from '../utils';
import { MAP_BOUNDS, TAG_ICONS } from '../data';
import type { Resource } from '../data';

interface SimpleMapProps {
    data: Resource[];
    category: string;
    statusFilter: string;
}

const SimpleMap = ({ data, category, statusFilter }: SimpleMapProps) => {
    const [selectedItem, setSelectedItem] = useState<Resource | null>(null);

    const mapPoints = useMemo(() => {
        return data.filter(item => {
            const matchCat = category === 'all' || item.category === category;
            const status = checkStatus(item.schedule).status;
            if (statusFilter === 'open') return matchCat && (status === 'open' || status === 'closing');
            return matchCat;
        });
    }, [data, category, statusFilter]);

    const project = (lat: number, lng: number) => {
        const y = 100 - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
        const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
        return { x, y };
    };

    const getPinColor = (item: Resource) => {
        if (selectedItem?.id === item.id) return 'bg-slate-900 border-white scale-125 z-50';
        const config = getTagConfig(item.category, TAG_ICONS);
        return `${config.bg.replace('100', '500').replace('50', '500')} border-white`;
    };

    return (
        <div className="w-full h-[60vh] bg-slate-100 rounded-3xl relative overflow-hidden shadow-inner border border-slate-200">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {mapPoints.map(item => {
                const pos = project(item.lat, item.lng);
                if (pos.x < 0 || pos.x > 100 || pos.y < 0 || pos.y > 100) return null;
                return (
                    <button
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 shadow-sm transition-all duration-300 ${getPinColor(item)} ${selectedItem?.id === item.id ? 'ring-4 ring-black/10' : 'hover:scale-110'}`}
                        style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                    />
                );
            })}

            {selectedItem && (
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 animate-fade-in-up z-40">
                    <div className="flex justify-between items-start mb-2">
                        <div className="pr-8">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">{selectedItem.category}</span>
                            <h4 className="font-bold text-slate-900 text-lg leading-tight">{selectedItem.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{selectedItem.address}</p>
                        </div>
                        <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-slate-100 p-1 rounded-full text-slate-400 hover:bg-slate-200 transition"><Icon name="x" size={14} /></button>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.lat},${selectedItem.lng}`} target="_blank" className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-xs font-bold flex justify-center items-center gap-2 hover:bg-black transition shadow-lg shadow-slate-900/20">
                            <Icon name="navigation" size={12} /> Get Directions
                        </a>
                        <button onClick={() => setSelectedItem(null)} className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleMap;
