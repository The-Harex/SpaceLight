'use client';

import { useEffect, useState } from 'react';
import { Eye, Globe, Compass, ArrowUp, Loader2 } from 'lucide-react';
import * as Astronomy from 'astronomy-engine';

const BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'
];

interface PlanetData {
    name: string;
    altitude: number;
    azimuth: number;
    magnitude: number;
    visible: boolean;
}

export default function VisiblePlanets() {
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude
        });
      },
      (err) => {
        setError('Unable to retrieve location.');
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (!location) return;

    const calculatePositions = () => {
      const date = new Date();
      const observer = new Astronomy.Observer(location.lat, location.long, 0);
      
      const newPlanets = BODIES.map(bodyName => {
        // Body types in Astronomy Engine are strictly typed strings or enums
        // but string works for main bodies.
        const body = bodyName as Astronomy.Body; 
        
        // Calculate equatorial coordinates
        const equator = Astronomy.Equator(body, date, observer, true, true);
        
        // Calculate horizontal coordinates (Alt/Az)
        const horizon = Astronomy.Horizon(date, observer, equator.ra, equator.dec, 'normal');
        
        // Approximate magnitude (very rough, or omit if library doesn't provide easy one. 
        // Astronomy engine does have Illumination but maybe not visual mag for all. 
        // Let's skip mag or look for it. Astronomy.Illumination(body, date).mag exists.)
        const illum = Astronomy.Illumination(body, date);

        return {
          name: bodyName,
          altitude: horizon.altitude,
          azimuth: horizon.azimuth,
          magnitude: illum.mag,
          visible: horizon.altitude > 0
        };
      });

      // Sort by altitude descending
      setPlanets(newPlanets); // .sort((a, b) => b.altitude - a.altitude) // Keep simpler list order or sort by visibility?
      setLoading(false);
    };

    calculatePositions();
    const interval = setInterval(calculatePositions, 60000); // Update every minute
    return () => clearInterval(interval);

  }, [location]);

  if (loading) {
     return (
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full flex items-center justify-center text-slate-500">
             <Loader2 className="animate-spin w-6 h-6 mr-2" /> Calculating Sky...
        </div>
     );
  }

  if (error) {
     return (
        <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full flex items-center justify-center text-red-400">
             {error}
        </div>
     );
  }

  // Filter for display: Show visible ones first
  const visiblePlanets = planets.filter(p => p.visible).sort((a,b) => b.altitude - a.altitude);
  const belowHorizon = planets.filter(p => !p.visible);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
      <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
        <Globe className="w-5 h-5" /> What's Above You
      </h2>
      
      <div className="space-y-3">
        {visiblePlanets.length === 0 && (
            <p className="text-slate-400 text-sm">Nothing major visible right now.</p>
        )}
        
        {visiblePlanets.map((p) => (
            <div key={p.name} className="flex items-center justify-between bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${p.name === 'Sun' ? 'bg-yellow-400' : 'bg-emerald-400'} shadow-[0_0_8px_currentColor]`} />
                    <div>
                        <p className="font-bold text-slate-200">{p.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            Mag: {p.magnitude.toFixed(1)}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end text-emerald-300 gap-1 text-sm font-mono">
                         <ArrowUp className="w-3 h-3" /> {p.altitude.toFixed(0)}°
                    </div>
                    <div className="flex items-center justify-end text-slate-500 gap-1 text-xs">
                         <Compass className="w-3 h-3" /> {p.azimuth.toFixed(0)}°
                    </div>
                </div>
            </div>
        ))}

        {visiblePlanets.length > 0 && belowHorizon.length > 0 && (
            <div className="border-t border-slate-700/50 my-2" />
        )}

        {belowHorizon.map((p) => (
             <div key={p.name} className="flex items-center justify-between px-3 py-1 opacity-50">
                <p className="text-sm text-slate-500">{p.name}</p>
                <p className="text-xs text-slate-600">Below Horizon</p>
             </div>
        ))}
      </div>
    </div>
  );
}
