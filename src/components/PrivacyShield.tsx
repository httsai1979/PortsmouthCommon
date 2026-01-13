import { useState } from 'react';
import Icon from './Icon';

interface PrivacyShieldProps {
    onAccept: () => void;
}

const PrivacyShield = ({ onAccept }: PrivacyShieldProps) => {
    const [isVisible, setIsVisible] = useState(() => {
        return !localStorage.getItem('haven_privacy_accepted');
    });

    const handleAccept = () => {
        localStorage.setItem('haven_privacy_accepted', 'true');
        setIsVisible(false);
        onAccept();
    };

    const handleNuclearDelete = async () => {
        const confirmed = window.confirm(
            "CRITICAL ACTION: This will erase all local data, cached maps, and offline information from this device. You will need to re-download data when you next use the app. Continue?"
        );

        if (!confirmed) return;

        // 1. Clear Local Storage
        localStorage.clear();

        // 2. Clear Session Storage
        sessionStorage.clear();

        // 3. Delete IndexedDB (Firebase/Firestore use these)
        if (window.indexedDB) {
            const databases = ['firestore/[portsmouthbridge]/[default]', 'firebase-heartbeat-database', 'firebase-installations-database'];
            databases.forEach(dbName => {
                try {
                    window.indexedDB.deleteDatabase(dbName);
                } catch (e) {
                    console.warn(`Could not delete IndexedDB: ${dbName}`, e);
                }
            });
        }

        // 4. Unregister Service Workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        }

        // 5. Force Reload
        alert("All local data has been purged. The app will now reload.");
        window.location.reload();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-8 bg-indigo-600 text-white text-center relative">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="check_circle" size={40} />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Privacy First</h2>
                    <p className="text-indigo-100 text-sm">Your dignity and privacy are our top priority.</p>
                </div>

                <div className="p-8 overflow-y-auto space-y-6 flex-1">
                    <section className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Icon name="eye" size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800">Zero Personal Data</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            We don't know who you are. We don't use cookies, tracker, or require user accounts. Your search history never leaves this device.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                <Icon name="mapPin" size={18} />
                            </div>
                            <h3 className="font-bold text-slate-800">Local Location Only</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Your GPS location is only used locally to find resources near you. It is never transmitted to our servers or third parties.
                        </p>
                    </section>

                    <section className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
                        <p className="text-xs text-slate-500">
                            By using Portsmouth Bridge, you agree to our 100% anonymous, local-first privacy policy. You can clear all cached data anytime using the 'Forget Me' tool.
                        </p>
                    </section>

                    <button
                        onClick={handleNuclearDelete}
                        className="w-full py-4 border-2 border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="lifebuoy" size={14} /> Kill Switch: Forget This Device
                    </button>
                </div>

                <div className="p-8 border-t border-slate-100 bg-white">
                    <button
                        onClick={handleAccept}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Enter Portsmouth Bridge
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                        GDPR Compliant Architecture
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyShield;
