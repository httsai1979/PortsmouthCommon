
import { useMemo } from 'react';
import Icon from './Icon';
import type { Resource } from '../data';

interface FoodScheduleProps {
    data: Resource[];
}

const FoodSchedule = ({ data }: FoodScheduleProps) => {
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const DAY_INDICES = [1, 2, 3, 4, 5, 6, 0]; // Mapping visual days to JS Date.getDay() (0=Sun)

    const processedSchedule = useMemo(() => {
        const scheduleByDay: Record<number, Array<{ resource: Resource, time: string, start: number }>> = {};

        // Filter only FOOD items
        const foodItems = data.filter(d => d.category === 'food');

        DAY_INDICES.forEach(dayIndex => {
            scheduleByDay[dayIndex] = [];
            foodItems.forEach(item => {
                const hours = item.schedule[dayIndex];
                if (hours && hours !== 'Closed') {
                    // Normalize time for sorting
                    const startH = parseInt(hours.split(':')[0]);
                    scheduleByDay[dayIndex].push({
                        resource: item,
                        time: hours,
                        start: startH
                    });
                }
            });
            // Sort by start time
            scheduleByDay[dayIndex].sort((a, b) => a.start - b.start);
        });

        return scheduleByDay;
    }, [data]);

    return (
        <div className="bg-white rounded-[32px] p-6 shadow-sm border-2 border-slate-100 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Icon name="calendar" size={20} className="text-emerald-600" />
                </div>
                <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">Weekly Food Calendar</h3>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Plan your meals & pantry visits</p>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mb-6 text-[10px] font-bold uppercase tracking-wide bg-slate-50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-100 border-2 border-white shadow-sm ring-1 ring-emerald-200"></div>
                    <span className="text-slate-600">Free / Meal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-100 border-2 border-white shadow-sm ring-1 ring-orange-200"></div>
                    <span className="text-slate-600">Pantry / Low Cost</span>
                </div>
            </div>

            <div className="space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

                {DAYS.map((dayName, index) => {
                    const dayIndex = DAY_INDICES[index];
                    const items = processedSchedule[dayIndex] || [];
                    const isToday = new Date().getDay() === dayIndex;

                    return (
                        <div key={dayName} className="relative z-10">
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center font-black text-[10px] uppercase tracking-wider shrink-0 transition-colors ${isToday ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {dayName.slice(0, 3)}
                                </div>
                                <h4 className={`text-sm font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {dayName} {isToday && <span className="ml-2 text-[8px] bg-indigo-50 px-2 py-0.5 rounded-full text-indigo-600">TODAY</span>}
                                </h4>
                            </div>

                            <div className="pl-14 space-y-2">
                                {items.length > 0 ? (
                                    items.map(({ resource, time }) => {
                                        const isPantry = resource.type.toLowerCase().includes('pantry') || resource.tags.includes('membership');
                                        return (
                                            <div key={resource.id} className={`p-3 rounded-xl border-l-4 shadow-sm transition-all hover:scale-[1.01] ${isPantry
                                                    ? 'bg-orange-50 border-orange-400'
                                                    : 'bg-emerald-50 border-emerald-400'
                                                }`}>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h5 className="text-xs font-black text-slate-900 leading-snug">{resource.name}</h5>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                                                            {resource.area} • {resource.type}
                                                        </p>
                                                    </div>
                                                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${isPantry ? 'bg-white text-orange-600' : 'bg-white text-emerald-600'
                                                        }`}>
                                                        {time}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] text-slate-400 italic">
                                        No food resources scheduled.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FoodSchedule;
