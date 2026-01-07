import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import Icon from './Icon';
import { checkStatus, getTagConfig } from '../utils';
import { TAG_ICONS } from '../data';
import type { ServiceDocument } from '../types/schema';

// Portsmouth Coordinates
const PORTSMOUTH_CENTER: [number, number] = [50.805, -1.07];

interface SimpleMapProps {
    data: any[]; // Supports Resource or ServiceDocument
    category: string;
    statusFilter: string;
    savedIds: string[];
    onToggleSave: (id: string) => void;
    stealthMode?: boolean;
    isPartner?: boolean;
    externalFocus?: { lat: number; lng: number; label?: string; id?: string } | null;
    onCategoryChange: (category: string) => void;
}

// Utility to create a custom marker icon
const createCustomIcon = (item: any, isSelected: boolean, stealthMode?: boolean, isSaved?: boolean) => {
    const service = item as ServiceDocument;
    const category = item.category || 'support';

    // Status Logic
    const status = checkStatus(item.schedule);
    const liveIsOpen = service.liveStatus?.isOpen ?? status.status === 'open';

    // PB: Safe Mode (Privacy Protection)
    if (stealthMode) {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div class="relative group">
                    <div class="w-6 h-6 rounded-full border-2 border-white bg-slate-400 shadow-sm flex items-center justify-center ${isSelected ? 'scale-110 ring-2 ring-slate-300' : ''}">
                         <div class="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                    </div>
                </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    }

    const config = TAG_ICONS[category] || TAG_ICONS.default;
    const color = config.hex;

    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div class="relative group">
                ${liveIsOpen ? `
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white z-50 animate-pulse shadow-lg"></div>
                ` : `
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-slate-400 rounded-full border-2 border-white z-50 shadow-lg"></div>
                `}
                
                ${isSaved ? `
                    <div class="absolute -top-2 -left-2 w-5 h-5 bg-amber-400 rounded-full border-2 border-white z-50 shadow-md flex items-center justify-center text-white">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                ` : ''}

                <div class="absolute inset-0 bg-black/20 blur-md rounded-full translate-y-1"></div>
                <div class="w-10 h-10 rounded-full border-[3px] border-white shadow-2xl flex items-center justify-center transition-all ${isSelected ? 'scale-125 z-50 ring-4 ring-indigo-500/40 translate-y-[-4px]' : 'hover:scale-110'} ${isSaved ? 'ring-2 ring-amber-400' : ''}" style="background-color: ${color}">
                    <div class="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v8M8 12h8" stroke-width="2"/>
                        </svg>
                    </div>
                </div>
                <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100 z-[-1] rounded-sm"></div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 z-[0]" style="background-color: ${color}"></div>
            </div>
        `,
        iconSize: [40, 48],
        iconAnchor: [20, 48],
    });
};

// Map Controller
const MapController = ({ selectedPos, locateTrigger, externalPos, data }: { selectedPos: [number, number] | null, locateTrigger: number, externalPos?: [number, number] | null, data: any[] }) => {
    const map = useMap();

    useEffect(() => {
        if (data.length > 0) {
            const points = data.map(item => [item.location?.lat || item.lat, item.location?.lng || item.lng]).filter(p => !isNaN(p[0]));
            if (points.length > 0) {
                const bounds = L.latLngBounds(points as any);
                map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
            }
        }
    }, [data, map]);

    useEffect(() => {
        if (selectedPos) map.flyTo(selectedPos, 16, { animate: true });
    }, [selectedPos, map]);

    useEffect(() => {
        if (externalPos) map.flyTo(externalPos, 18, { animate: true });
    }, [externalPos, map]);

    useEffect(() => {
        if (locateTrigger > 0) map.locate({ setView: true, maxZoom: 16 });
    }, [locateTrigger, map]);

    return null;
};

const SimpleMap = ({ data, category, statusFilter, savedIds, onToggleSave, stealthMode, isPartner, externalFocus, onCategoryChange }: SimpleMapProps) => {
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [locateTrigger, setLocateTrigger] = useState(0);
    const [showHours, setShowHours] = useState(false);

    useEffect(() => {
        if (externalFocus?.id) {
            const item = data.find(i => i.id === externalFocus.id);
            if (item) {
                setSelectedItem(item);
                setShowHours(true);
            }
        }
    }, [externalFocus, data]);

    const filteredPoints = useMemo(() => {
        return data.filter(item => {
            const status = checkStatus(item.schedule).status;
            const matchStatus = statusFilter === 'all' || (status === 'open' || status === 'closing');
            return matchStatus;
        });
    }, [data, category, statusFilter]);

    const categories = [
        { id: 'all', label: 'All Needs', icon: 'search' },
        { id: 'food', label: 'Food Support', icon: 'utensils' },
        { id: 'shelter', label: 'Safe Sleep', icon: 'home' },
        { id: 'warmth', label: 'Warm Hubs', icon: 'flame' },
        { id: 'support', label: 'Community', icon: 'lifebuoy' },
        { id: 'family', label: 'Family Support', icon: 'family' },
        { id: 'learning', label: 'Learning Hub', icon: 'book-open' },
        { id: 'skills', label: 'Opportunity', icon: 'briefcase' },
    ];

    return (
        <div className="w-full h-[65vh] bg-slate-100 rounded-[32px] relative overflow-hidden shadow-2xl border-4 border-white">
            {/* Category Filter HUD */}
            <div className="absolute top-4 left-4 right-4 z-[1000] bg-white/90 backdrop-blur-xl p-4 rounded-[32px] shadow-2xl border border-white/50">
                <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Find by Need</span>
                    {category !== 'all' && (
                        <button onClick={() => onCategoryChange('all')} className="text-[9px] font-bold text-indigo-600 uppercase hover:underline">Reset</button>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all active:scale-90 ${category === cat.id ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}
                        >
                            <Icon name={cat.icon} size={18} />
                            <span className={`text-[8px] font-black uppercase tracking-tight truncate w-full px-1 text-center ${category === cat.id ? 'text-white' : 'text-slate-400'}`}>{cat.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <MapContainer center={PORTSMOUTH_CENTER} zoom={14} className="w-full h-full" zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                {filteredPoints.map(item => (
                    <Marker
                        key={item.id}
                        position={[item.location?.lat || item.lat, item.location?.lng || item.lng]}
                        icon={createCustomIcon(item, selectedItem?.id === item.id, stealthMode, savedIds.includes(item.id))}
                        eventHandlers={{ click: () => { setSelectedItem(item); setShowHours(false); } }}
                    />
                ))}

                <MapController
                    selectedPos={selectedItem ? [selectedItem.location?.lat || selectedItem.lat, selectedItem.location?.lng || selectedItem.lng] : null}
                    externalPos={externalFocus ? [externalFocus.lat, externalFocus.lng] : null}
                    locateTrigger={locateTrigger}
                    data={filteredPoints}
                />
            </MapContainer>

            {/* Live Ecosystem HUD */}
            <div className={`absolute top-20 left-4 z-[1000] pointer-events-none transition-all ${stealthMode ? 'opacity-0' : ''}`}>
                <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex flex-col gap-1 border border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isPartner ? 'Agency Sync Active' : 'Live Status'}</span>
                    </div>
                    <div className="text-xl font-black tabular-nums">
                        {filteredPoints.filter(p => (p.liveStatus?.isOpen ?? checkStatus(p.schedule).status === 'open')).length} <span className="text-[10px] text-slate-400">Hubs Active</span>
                    </div>
                </div>
            </div>

            <button onClick={() => setLocateTrigger(prev => prev + 1)} className="absolute top-20 right-4 z-[1000] bg-white p-4 rounded-2xl shadow-xl text-indigo-600 hover:bg-slate-50 transition-all border border-slate-100 active:scale-90">
                <Icon name="mapPin" size={24} />
            </button>

            {selectedItem && (
                <div className="absolute bottom-6 left-6 right-6 z-[1000] bg-white rounded-3xl p-5 shadow-2xl border-2 transition-all" style={{ borderColor: stealthMode ? '#e2e8f0' : `${TAG_ICONS[selectedItem.category]?.hex || '#f1f5f9'}20` }}>
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl" style={{ backgroundColor: stealthMode ? '#cbd5e1' : TAG_ICONS[selectedItem.category]?.hex || '#475569' }}></div>
                    <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><Icon name="x" size={18} /></button>

                    {/* Broadcast Banner */}
                    {selectedItem.liveStatus?.message && (
                        <div className="mb-3 p-3 rounded-xl border flex gap-3 bg-indigo-50 border-indigo-200">
                            <Icon name="zap" size={14} className="text-indigo-600 mt-1 shrink-0" />
                            <div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Broadcast • {new Date(selectedItem.liveStatus.lastUpdated).toLocaleTimeString()}</h4>
                                <p className="text-xs font-bold text-slate-800 leading-tight">{selectedItem.liveStatus.message}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stealthMode ? 'bg-slate-100 text-slate-400' : getTagConfig(selectedItem.category, TAG_ICONS).bg}`}>
                            <Icon name={stealthMode ? 'mapPin' : getTagConfig(selectedItem.category, TAG_ICONS).icon} size={24} />
                        </div>
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedItem.area} • {selectedItem.category}</span>
                            <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">{selectedItem.name}</h3>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400"><Icon name="mapPin" size={12} /> {selectedItem.location?.address || selectedItem.address}</div>
                        </div>
                    </div>

                    {/* Partner Notes Section */}
                    {isPartner && selectedItem.b2bData && (
                        <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-[10px] font-bold text-indigo-900">
                            🛡️ <span className="uppercase font-black text-indigo-600 mr-2">Internal:</span> {selectedItem.b2bData.partnerNotes}
                        </div>
                    )}

                    {showHours && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-fade-in-up">
                            <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-slate-100">
                                <div><p className="text-[8px] font-bold text-slate-400 uppercase">Queue</p><p className="text-[10px] font-black">{selectedItem.thresholdInfo?.queueStatus || 'Unknown'}</p></div>
                                <div><p className="text-[8px] font-bold text-slate-400 uppercase">Access</p><p className="text-[10px] font-black">{selectedItem.thresholdInfo?.idRequired ? 'ID Required' : 'Open Access'}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(selectedItem.schedule || {}).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between items-center text-[10px] font-bold">
                                        <span className="text-slate-400 capitalize">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][Number(day)]}</span>
                                        <span className={hours === 'Closed' ? 'text-rose-500' : 'text-slate-700'}>{hours as string}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-5 flex gap-2">
                        <button onClick={() => onToggleSave(selectedItem.id)} className={`p-4 rounded-2xl transition-all shadow-lg ${savedIds.includes(selectedItem.id) ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Icon name="star" size={20} /></button>
                        <button onClick={() => setShowHours(!showHours)} className={`p-4 rounded-2xl transition-all shadow-lg ${showHours ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Icon name="info" size={20} /></button>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.location?.lat || selectedItem.lat},${selectedItem.location?.lng || selectedItem.lng}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                            <Icon name="navigation" size={18} /> Navigate
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleMap;
