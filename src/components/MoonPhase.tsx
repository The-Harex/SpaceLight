'use client';
import { Moon, ArrowUp, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as Astronomy from 'astronomy-engine';

interface MoonData {
    phaseName: string;
    illumination: number; // 0 to 100
    rise?: string | null;
    set?: string | null;
}

function getPhaseName(date: Date): string {
    const phase = Astronomy.MoonPhase(date); // degrees 0-360
    
    if (phase < 6.1) return "New Moon";
    if (phase < 83.1) return "Waxing Crescent";
    if (phase < 96.9) return "First Quarter";
    if (phase < 173.1) return "Waxing Gibbous";
    if (phase < 186.9) return "Full Moon";
    if (phase < 263.1) return "Waning Gibbous";
    if (phase < 276.9) return "Last Quarter";
    if (phase < 353.9) return "Waning Crescent";
    return "New Moon";
}

export default function MoonPhase() {
    const [data, setData] = useState<MoonData | null>(null);
    const [locationInput, setLocationInput] = useState<{lat: number, lon: number} | null>(null);
    const [status, setStatus] = useState<string>("Locating...");

    useEffect(() => {
        // 1. Get Location
        if (!navigator.geolocation) {
            setStatus("Location not supported");
            calculateMoon(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocationInput({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                calculateMoon({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setStatus("");
            },
            (err) => {
                console.warn("Location access denied or failed", err);
                setStatus("(Using Geocentric View)");
                calculateMoon(null); 
            }
        );
    }, []);

    const calculateMoon = (loc: {lat: number, lon: number} | null) => {
        const date = new Date();
        const illumination = Astronomy.Illumination(Astronomy.Body.Moon, date);
        const phaseName = getPhaseName(date); 
        
        let riseStr = null;
        let setStr = null;

        if (loc) {
            const observer = new Astronomy.Observer(loc.lat, loc.lon, 0);
            
            // Search for next Rise and Set
            const rise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, 1, date, 30);
            const set = Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, date, 30);

            if (rise) riseStr = rise.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (set) setStr = set.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        setData({
            phaseName: phaseName,
            illumination: Math.round(illumination.phase_fraction * 100), 
            rise: riseStr,
            set: setStr
        });
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-xl font-bold mb-2 text-slate-200 flex items-center gap-2">
                <Moon className="w-5 h-5" /> The Moon
            </h2>
            
            {data ? (
                <div className="mt-2 w-full">
                    <p className="text-2xl font-bold text-white mb-1">{data.phaseName}</p>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 dark:bg-slate-700 overflow-hidden border border-slate-600">
                        <div className="bg-slate-200 h-2.5 rounded-full" style={{ width: `${data.illumination}%` }}></div>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">{data.illumination}% Illuminated</p>
                    
                    {locationInput && (
                        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-800/50 p-3 rounded-lg">
                            <div className="flex flex-col items-center">
                                <span className="text-slate-500 flex items-center gap-1"><ArrowUp className="w-3 h-3"/> Rise</span>
                                <span className="text-slate-200 font-mono">{data.rise || "--:--"}</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-slate-500 flex items-center gap-1"><ArrowDown className="w-3 h-3"/> Set</span>
                                <span className="text-slate-200 font-mono">{data.set || "--:--"}</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Correction: ArrowUp/ArrowDown labels usually imply Rise/Set. I labelled them Ends/Starts by accident in my mental draft? Checking code above. */}
                    {/* Corrected labels below in actual file content I am writing now to be 'Rise' and 'Set' */}
                </div>
            ) : <p className="text-slate-500 animate-pulse">Calculating...</p>}
            
            {status && <p className="text-xs text-slate-500 mt-2 italic">{status}</p>}
        </div>
    )
}
