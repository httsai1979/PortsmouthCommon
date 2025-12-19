import Icon from './Icon';
import { checkStatus, getTagConfig, getDistance } from '../utils';
import { TAG_ICONS } from '../data';
import type { Resource } from '../data';

interface SmartCompareProps {
    items: Resource[];
    userLocation: { lat: number; lng: number } | null;
    onRemove: (id: string) => void;
    onNavigate: (id: string) => void;
    onCall: (phone: string) => void;
}

const SmartCompare = ({ items, userLocation, onRemove, onNavigate, onCall }: SmartCompareProps) => {
    if (items.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <Icon name="shield" size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No resources to compare</p>
                <p className="text-xs text-slate-400 mt-2">Add up to 3 resources for comparison</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-xl border-2 border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-6">Smart Compare</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => {
                    const status = checkStatus(item.schedule);
                    const distance = userLocation
                        ? getDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
                        : null;
                    const config = getTagConfig(item.category, TAG_ICONS);

                    return (
                        <div key={item.id} className="relative bg-slate-50 rounded-2xl p-4 border-2 border-slate-100 group">
                            {/* Remove Button */}
                            <button
                                onClick={() => onRemove(item.id)}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                                <Icon name="x" size={14} />
                            </button>

                            {/* Header */}
                            <div className="flex items-start gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bg} shrink-0`}>
                                    <Icon name={config.icon} size={24} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-black text-slate-900 leading-tight mb-1">{item.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{item.area} • {item.type}</p>
                                </div>
                            </div>

                            {/* Comparison Metrics */}
                            <div className="space-y-3 mb-4">
                                {/* Status */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${status.status === 'open' ? 'bg-emerald-500 animate-pulse' :
                                                status.status === 'closing' ? 'bg-amber-500' : 'bg-slate-300'
                                            }`}></div>
                                        <span className={`text-xs font-black ${status.status === 'open' ? 'text-emerald-600' :
                                                status.status === 'closing' ? 'text-amber-600' : 'text-slate-400'
                                            }`}>
                                            {status.status === 'open' ? 'Open Now' : status.status === 'closing' ? 'Closing Soon' : 'Closed'}
                                        </span>
                                    </div>
                                </div>

                                {/* Distance */}
                                {distance !== null && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Distance</span>
                                        <span className="text-xs font-black text-indigo-600">{distance.toFixed(1)} km</span>
                                    </div>
                                )}

                                {/* Trust Score */}
                                {item.trustScore && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-500">Verified</span>
                                        <div className="flex items-center gap-1">
                                            {item.trustScore > 90 && <Icon name="check_circle" size={12} className="text-emerald-500" />}
                                            <span className="text-xs font-black text-slate-700">{item.trustScore}%</span>
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                <div>
                                    <span className="text-xs font-bold text-slate-500 block mb-2">Services</span>
                                    <div className="flex flex-wrap gap-1">
                                        {item.tags.slice(0, 3).map(tag => (
                                            <span
                                                key={tag}
                                                className="text-[9px] font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-600"
                                            >
                                                {TAG_ICONS[tag]?.label || tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {item.phone && (
                                    <button
                                        onClick={() => onCall(item.phone!)}
                                        className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-emerald-700 transition-all shadow-sm active:scale-95"
                                    >
                                        <Icon name="phone" size={12} />
                                    </button>
                                )}
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
                                >
                                    <Icon name="navigation" size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SmartCompare;
