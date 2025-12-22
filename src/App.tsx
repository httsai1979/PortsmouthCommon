import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, MapPin, Navigation, Utensils, Bed, Flame, Heart, 
  Info, Shield, Star, Trash, Eye, Zap, Calendar, 
  ArrowRight, X, CheckCircle, Share2, Sparkles, ShoppingBag, 
  BookOpen, Briefcase, LifeBuoy, AlertTriangle, Phone, Bell
} from 'lucide-react';

// --- [SECTION 1: DATA - British English Content] ---
const AREAS = ['All', 'Southsea', 'City Centre', 'Fratton', 'North End', 'Cosham'];

const ALL_DATA = [
  {
    id: 'res-01',
    name: 'Portsmouth Food Bank (Main)',
    area: 'City Centre',
    category: 'food',
    address: 'City Centre, Portsmouth PO1 1AT',
    description: 'Providing emergency food parcels and support for families in crisis.',
    tags: ['emergency', 'food', 'essential'],
    trustScore: 98,
    lat: 50.7989,
    lng: -1.0912,
    phone: '023 9281 1234',
    transport: 'Close to City Centre Train Station',
    schedule: {
      0: 'Closed',
      1: '09:00-17:00',
      2: '09:00-17:00',
      3: '09:00-17:00',
      4: '09:00-20:00',
      5: '09:00-17:00',
      6: '10:00-14:00'
    }
  },
  {
    id: 'res-02',
    name: 'Safe Night Shelter',
    area: 'Southsea',
    category: 'shelter',
    address: 'Southsea Common Area, PO4 0LP',
    description: 'Warm, safe emergency accommodation for tonight.',
    tags: ['overnight', 'warmth', 'safe'],
    trustScore: 94,
    lat: 50.7850,
    lng: -1.0750,
    phone: '023 9285 5678',
    transport: 'Bus route 23 stop nearby',
    schedule: {
      0: '18:00-08:00',
      1: '18:00-08:00',
      2: '18:00-08:00',
      3: '18:00-08:00',
      4: '18:00-08:00',
      5: '18:00-08:00',
      6: '18:00-08:00'
    }
  },
  {
    id: 'res-03',
    name: 'Community Skills Hub',
    area: 'Fratton',
    category: 'skills',
    address: 'Fratton Road, PO1 5HB',
    description: 'CV writing, job application support and digital skills training.',
    tags: ['jobs', 'training', 'support'],
    trustScore: 89,
    lat: 50.8010,
    lng: -1.0780,
    phone: '023 9282 2233',
    transport: 'Near Fratton Station',
    schedule: {
      0: 'Closed',
      1: '10:00-16:00',
      2: '10:00-16:00',
      3: '10:00-16:00',
      4: '10:00-16:00',
      5: '10:00-16:00',
      6: 'Closed'
    }
  },
  {
    id: 'res-04',
    name: 'Health & Wellbeing Clinic',
    area: 'North End',
    category: 'support',
    address: 'Kingston Crescent, PO2 8AA',
    description: 'Walk-in support for mental health and general well-being advice.',
    tags: ['health', 'mental help', 'medical'],
    trustScore: 92,
    lat: 50.8120,
    lng: -1.0850,
    phone: '023 9266 4455',
    transport: 'Main bus route stops outside',
    schedule: {
      0: 'Closed',
      1: '08:30-18:30',
      2: '08:30-18:30',
      3: '08:30-18:30',
      4: '08:30-18:30',
      5: '08:30-18:30',
      6: '09:00-12:00'
    }
  }
];

const PROGRESS_TIPS = [
  { title: "Today's Growth Tip", note: "Remember, seeking help is not a weakness, but the first step towards success." },
  { title: "Digital Footprint Safety", note: "Stealth mode helps protect your browsing history on shared devices." }
];

const COMMUNITY_DEALS = [
  { id: 'd1', store: 'Victory Cafe', deal: 'Free Hot Drink', time: 'Before 10am', info: 'Show this page to staff', lat: 50.795, lng: -1.085 }
];

const GIFT_EXCHANGE = [
  { id: 'g1', item: 'Adult Winter Coat', location: 'St Mary’s Church', date: 'Every Tuesday', info: 'Various sizes available', lat: 50.801, lng: -1.072 }
];

// --- [SECTION 2: UTILS] ---
const checkStatus = (schedule) => {
  const now = new Date();
  const day = now.getDay();
  const timeStr = schedule[day];
  if (!timeStr || timeStr === 'Closed') return { status: 'closed', isOpen: false, label: 'Closed' };
  
  const [start, end] = timeStr.split('-');
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  
  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    return { status: 'open', isOpen: true, label: `Open until ${end}` };
  }
  return { status: 'closed', isOpen: false, label: 'Currently Closed' };
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const playSuccessSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) { console.log('Audio error'); }
};

// --- [SECTION 3: COMPONENTS] ---
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    search: <Search size={size} />, mapPin: <MapPin size={size} />,
    navigation: <Navigation size={size} />, utensils: <Utensils size={size} />,
    bed: <Bed size={size} />, flame: <Flame size={size} />,
    heart: <Heart size={size} />, info: <Info size={size} />,
    shield: <Shield size={size} />, star: <Star size={size} />,
    trash: <Trash size={size} />, eye: <Eye size={size} />,
    zap: <Zap size={size} />, calendar: <Calendar size={size} />,
    arrowRight: <ArrowRight size={size} />, x: <X size={size} />,
    check_circle: <CheckCircle size={size} />, share2: <Share2 size={size} />,
    sparkles: <Sparkles size={size} />, alert: <AlertTriangle size={size} />,
    phone: <Phone size={size} />, bell: <Bell size={size} />,
    family: <Heart size={size} />, 'shopping-bag': <ShoppingBag size={size} />,
    'book-open': <BookOpen size={size} />, briefcase: <Briefcase size={size} />,
    lifebuoy: <LifeBuoy size={size} />
  };
  return <span className={className}>{icons[name] || <Info size={size} />}</span>;
};

// --- [SECTION 4: MAIN APP COMPONENT] ---
const App = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [stealthMode, setStealthMode] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  
  // Phase 25 Features logic (Strictly Maintained)
  const [journeyItems, setJourneyItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedIds, setSavedIds] = useState(() => {
    const saved = localStorage.getItem('bridge_saved_resources');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState({ area: 'All', category: 'all', date: 'today' });
  const [smartFilters, setSmartFilters] = useState({ openNow: false, nearMe: false, verified: false });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Location access denied", err)
      );
    }
  }, []);

  // Journey Planner / Compare Toggle Logic (Maintained)
  const toggleJourneyItem = (id) => {
    setJourneyItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleCompareItem = (id) => {
    setCompareItems(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const toggleSaved = (id) => {
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('bridge_saved_resources', JSON.stringify(next));
      if (!prev.includes(id)) playSuccessSound();
      return next;
    });
  };

  const filteredData = useMemo(() => {
    return ALL_DATA.filter(item => {
      const matchesArea = filters.area === 'All' || item.area === filters.area;
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower);
      
      const status = checkStatus(item.schedule);
      const matchesOpenNow = !smartFilters.openNow || status.isOpen;
      const matchesVerified = !smartFilters.verified || (item.trustScore > 90);

      return matchesArea && matchesCategory && matchesSearch && matchesOpenNow && matchesVerified;
    });
  }, [filters, searchQuery, smartFilters]);

  if (loading) {
    return (
      <div id="app" className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center animate-pulse">
          <Icon name="zap" size={48} className="text-indigo-600 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-800">Portsmouth Bridge</h1>
          <p className="text-slate-400 font-medium">Loading... establishing your community connections</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app" className={`app-container min-h-screen font-sans text-slate-900 ${highContrast ? 'grayscale contrast-125' : ''}`}>
      <style>{`
        .app-container { max-width: 500px; margin: 0 auto; background-color: #f8fafc; min-height: 100vh; box-shadow: 0 0 50px rgba(0,0,0,0.1); position: relative; padding-bottom: 90px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center">
        <div>
          <h1 className={`text-xl font-black ${stealthMode ? 'text-slate-300' : 'text-slate-900'}`}>
            {stealthMode ? 'Stealth Compass' : 'Portsmouth Bridge'}
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Connecting Community • Restoring Hope</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStealthMode(!stealthMode)} className={`p-2 rounded-full ${stealthMode ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}><Icon name="eye" size={20} /></button>
          <button onClick={() => setHighContrast(!highContrast)} className="p-2 bg-slate-100 rounded-full"><Icon name="zap" size={20} /></button>
        </div>
      </header>

      <div className="p-5">
        {view === 'home' && (
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-xl shadow-indigo-200">
              <h2 className="text-2xl font-bold mb-1">Hello, Portsmouth</h2>
              <p className="text-indigo-100 text-xs mb-6">There are {ALL_DATA.filter(d => checkStatus(d.schedule).isOpen).length} service centres operating today</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setView('planner')} className="bg-white/20 hover:bg-white/30 p-4 rounded-2xl text-left transition-all">
                  <Icon name="calendar" size={20} className="mb-2" />
                  <div className="text-xs font-bold">Journey Planner</div>
                  <div className="text-[10px] opacity-70">{journeyItems.length} stops</div>
                </button>
                <button onClick={() => setView('compare')} className="bg-white/20 hover:bg-white/30 p-4 rounded-2xl text-left transition-all">
                  <Icon name="shield" size={20} className="mb-2" />
                  <div className="text-xs font-bold">Smart Compare</div>
                  <div className="text-[10px] opacity-70">{compareItems.length}/3 selected</div>
                </button>
              </div>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { label: 'Food', icon: 'utensils', cat: 'food' },
                { label: 'Shelter', icon: 'bed', cat: 'shelter' },
                { label: 'Support', icon: 'lifebuoy', cat: 'support' },
                { label: 'More', icon: 'arrowRight', cat: 'all' }
              ].map(c => (
                <button key={c.label} onClick={() => { setFilters({...filters, category: c.cat}); setView('list'); }} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600"><Icon name={c.icon} size={20} /></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Resource List (Preview) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest">Recommended Resources</h3>
                <button onClick={() => setView('list')} className="text-indigo-600 text-[10px] font-bold">View All</button>
              </div>
              
              {ALL_DATA.slice(0, 3).map(res => (
                <div key={res.id} className="bg-white border border-slate-100 p-4 rounded-[24px] flex justify-between items-center shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                      <Icon name={res.category === 'food' ? 'utensils' : 'bed'} size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{res.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{res.area} • {checkStatus(res.schedule).label}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSaved(res.id)} className={`p-2 rounded-xl ${savedIds.includes(res.id) ? 'text-amber-500 bg-amber-50' : 'text-slate-300'}`}>
                    <Icon name="star" size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-4">
             <div className="flex gap-2 items-center mb-4">
                <button onClick={() => setView('home')} className="p-2 bg-slate-100 rounded-full"><Icon name="arrowRight" className="rotate-180" size={18} /></button>
                <h2 className="text-xl font-black">Resource Directory</h2>
             </div>
             
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
               {AREAS.map(area => (
                 <button 
                  key={area}
                  onClick={() => setFilters({...filters, area})}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap border-2 ${filters.area === area ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                 >
                   {area}
                 </button>
               ))}
             </div>

             <div className="space-y-4">
               {filteredData.map(item => (
                 <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
                   <div className="flex justify-between items-start">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                         <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">{item.category}</span>
                         <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${checkStatus(item.schedule).isOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                           {checkStatus(item.schedule).label}
                         </span>
                       </div>
                       <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                       <p className="text-xs text-slate-500">{item.address}</p>
                     </div>
                     <button onClick={() => toggleSaved(item.id)} className={`p-2 rounded-xl ${savedIds.includes(item.id) ? 'text-amber-500 bg-amber-50' : 'text-slate-200'}`}>
                       <Icon name="star" size={20} />
                     </button>
                   </div>
                   
                   <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                   
                   <div className="pt-3 border-t border-slate-50 flex gap-2">
                     <button 
                      onClick={() => toggleJourneyItem(item.id)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${journeyItems.includes(item.id) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-indigo-600'}`}
                     >
                       <Icon name="navigation" size={14} /> {journeyItems.includes(item.id) ? 'Added to Journey' : 'Add to Journey'}
                     </button>
                     <button 
                      onClick={() => toggleCompareItem(item.id)}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${compareItems.includes(item.id) ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-emerald-600'}`}
                     >
                       <Icon name="shield" size={14} /> {compareItems.includes(item.id) ? 'Comparing' : 'Add to Compare'}
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Journey Planner View */}
        {view === 'planner' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Your Journey Route</h2>
              <button onClick={() => setView('home')} className="p-2 bg-slate-100 rounded-full"><Icon name="x" size={20} /></button>
            </div>
            
            {journeyItems.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                <Icon name="mapPin" size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No journeys planned at the moment</p>
                <button onClick={() => setView('list')} className="mt-4 text-indigo-600 font-black text-xs border-b-2 border-indigo-100">Go to directory to add resources</button>
              </div>
            ) : (
              <div className="space-y-4">
                {journeyItems.map((id, index) => {
                  const item = ALL_DATA.find(d => d.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="bg-white p-5 rounded-[32px] border-2 border-slate-50 shadow-sm flex items-center gap-4 relative">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xs">{index + 1}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.area} • {checkStatus(item.schedule).label}</p>
                      </div>
                      <button onClick={() => toggleJourneyItem(id)} className="text-slate-300 hover:text-rose-500"><Icon name="trash" size={18} /></button>
                    </div>
                  );
                })}
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/${journeyItems.map(id => {
                    const itm = ALL_DATA.find(d => d.id === id);
                    return itm ? `${itm.lat},${itm.lng}` : '';
                  }).join('/')}`, '_blank')}
                  className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                >
                  Start Google Maps Navigation
                </button>
              </div>
            )}
          </div>
        )}

        {/* Smart Compare View */}
        {view === 'compare' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">Smart Resource Comparison</h2>
              <button onClick={() => setView('home')} className="p-2 bg-slate-100 rounded-full"><Icon name="x" size={20} /></button>
            </div>
            
            {compareItems.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                <Icon name="shield" size={48} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Please select at least two resources to compare</p>
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-4" style={{ width: `${compareItems.length * 280}px` }}>
                  {compareItems.map(id => {
                    const item = ALL_DATA.find(d => d.id === id);
                    if (!item) return null;
                    return (
                      <div key={id} className="w-[260px] bg-white rounded-[32px] border-2 border-slate-100 p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-lg text-slate-900 leading-tight">{item.name}</h3>
                          <button onClick={() => toggleCompareItem(id)} className="text-slate-300"><Icon name="x" size={16} /></button>
                        </div>
                        
                        <div className="space-y-3 text-xs">
                          <div className="p-3 bg-slate-50 rounded-2xl">
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Trust Score</span>
                            <div className="flex items-center gap-2">
                               <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                 <div className="h-full bg-emerald-500" style={{ width: `${item.trustScore}%` }}></div>
                               </div>
                               <span className="font-black text-emerald-600">{item.trustScore}%</span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Transport Info</span>
                            <p className="font-bold text-slate-700">{item.transport}</p>
                          </div>
                          
                          <div>
                            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Opening Times Today</span>
                            <p className="font-bold text-slate-700">{item.schedule[new Date().getDay()]}</p>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-4 flex flex-col gap-2">
                          <a href={`tel:${item.phone}`} className="flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-[10px] uppercase">
                            <Icon name="phone" size={14} /> Call Now
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white/90 backdrop-blur-md border-t border-slate-100 py-4 px-8 flex justify-between items-center z-50">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 transition-all ${view === 'home' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Icon name="home" size={24} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button onClick={() => setView('list')} className={`flex flex-col items-center gap-1 transition-all ${view === 'list' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Icon name="search" size={24} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Directory</span>
        </button>
        <button onClick={() => setView('planner')} className={`flex flex-col items-center gap-1 transition-all ${view === 'planner' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Icon name="navigation" size={24} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Journey</span>
        </button>
        <button onClick={() => setView('compare')} className={`flex flex-col items-center gap-1 transition-all ${view === 'compare' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <Icon name="shield" size={24} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Compare</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
