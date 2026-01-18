'use client';
import { Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

function getMoonPhase(date: Date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 3) {
    year--;
    month += 12;
  }

  const c = 365.25 * year;
  const e = 30.6 * month;
  const jd = c + e + day - 694039.09; // jd is total days elapsed
  const b = jd / 29.53058867; // divide by the moon cycle
  const phase = Number('0.' + b.toString().split('.')[1]); // int(b) -> b, take fraction
  
  // Phase is 0-1. 0=New, 0.5=Full. 
  const index = Math.round(phase * 8); 
  const phases = [
      "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous", 
      "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
  ];
  return { phase: phases[index % 8] || "Unknown", illumination: Math.round(((index <= 4 ? index : 8 - index ) / 4) * 100) };
}

export default function MoonPhase() {
    const [phaseData, setPhaseData] = useState<{phase: string, illumination: number} | null>(null);

    useEffect(() => {
        setPhaseData(getMoonPhase(new Date()));
    }, []);

    return (
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl flex flex-col items-center justify-center text-center h-full">
            <h2 className="text-xl font-bold mb-2 text-slate-200 flex items-center gap-2">
                <Moon className="w-5 h-5" /> Tonight's Sky
            </h2>
            {phaseData ? (
                <div className="mt-2">
                    <p className="text-2xl font-bold text-white">{phaseData.phase}</p>
                    <p className="text-sm text-slate-400">Illumination: {phaseData.illumination}%</p>
                    <p className="text-xs text-slate-500 mt-2">Visiblity is good for stargazing.</p>
                </div>
            ) : <p>Calculaing...</p>}
        </div>
    )
}
