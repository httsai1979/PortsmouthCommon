import { useMemo } from 'react';
import Icon from './Icon';
import { getDistance } from '../utils';
import type { Resource } from '../data';

interface JourneyPlannerProps {
    items: Resource[];
    userLocation: { lat: number; lng: number } | null;
    onRemove: (id: string) => void;
    onClear: () => void;
    onNavigate: () => void;
}

const JourneyPlanner = ({ items, userLocation, onRemove, onClear, onNavigate }: JourneyPlannerProps) => {
    // Optimize route using nearest-neighbor algorithm
    const optimizedRoute = useMemo(() => {
        if (items.length === 0 || !userLocation) return items;

        const unvisited = [...items];
        const route: Resource[] = [];
        let current = userLocation;

        while (unvisited.length > 0) {
            // Find nearest unvisited location
            let nearestIndex = 0;
            let nearestDist = Infinity;

            unvisited.forEach((item, index) => {
                const dist = getDistance(current.lat, current.lng, item.lat, item.lng);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestIndex = index;
                }
            });

            const nearest = unvisited[nearestIndex];
            route.push(nearest);
            unvisited.splice(nearestIndex, 1);
            current = { lat: nearest.lat, lng: nearest.lng };
        }

        return route;
    }, [items, userLocation]);

    const totalDistance = useMemo(() => {
        if (!userLocation || optimizedRoute.length === 0) return 0;

        let total = 0;
        let prev = userLocation;

        optimizedRoute.forEach(item => {
            total += getDistance(prev.lat, prev.lng, item.lat, item.lng);
            prev = { lat: item.lat, lng: item.lng };
        });

        return total;
    }, [optimizedRoute, userLocation]);

    const estimatedTime = useMemo(() => {
        // Assume 5km/h walking speed + 10 min per stop
        const walkingTime = (totalDistance / 5) * 60; // minutes
        const stopTime = optimizedRoute.length * 10;
        return Math.round(walkingTime + stopTime);
    }, [totalDistance, optimizedRoute.length]);

    if (items.length === 0) {
        return (
            <div className="p-8 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <Icon name="mapPin" size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No stops added yet</p>
                <p className="text-xs text-slate-400 mt-2">Add resources to plan your journey</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-xl border-2 border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900">Your Journey</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {optimizedRoute.length} stops • {totalDistance.toFixed(1)}km • ~{estimatedTime}min
                    </p>
                </div>
                <button
                    onClick={onClear}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Clear all"
                >
                    <Icon name="trash" size={18} />
                </button>
            </div>

            {/* Route List */}
            <div className="space-y-3 mb-6">
                {optimizedRoute.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-slate-100 transition-all"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-black shrink-0">
                            {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{item.area} • {item.type}</p>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 transition-all"
                        >
                            <Icon name="x" size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Navigate Button */}
            <button
                onClick={onNavigate}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            >
                <Icon name="navigation" size={18} />
                Start Navigation
            </button>
        </div>
    );
};

export default JourneyPlanner;
