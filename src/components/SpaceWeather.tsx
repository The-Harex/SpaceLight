'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sun, MapPin } from 'lucide-react';

interface KpData {
  time_tag: string; // "YYYY-MM-DDTHH:mm:ss" (UTC)
  kp_index: number;
  localTime: string; // Formatted for display
  timestamp: number; // For sorting/key
}

export default function SpaceWeather() {
  const [data, setData] = useState<KpData[]>([]);
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);
  const [kpNeeded, setKpNeeded] = useState<number | null>(null);

  useEffect(() => {
    // 1. Get Location
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition((pos) => {
         setLocation({ lat: pos.coords.latitude, long: pos.coords.longitude });
         
         // Rough estimation of Kp needed for overhead aurora based on magnetic lat
         // Using geographic lat as proxy (mag lat ~ lat + correction, varies by longitude).
         // This is a rough estimation for "Visibility".
         // Data: https://www.swpc.noaa.gov/content/tips-viewing-aurora
         const absLat = Math.abs(pos.coords.latitude);
         let needed = 9;
         if (absLat >= 66) needed = 0;
         else if (absLat >= 64) needed = 1;
         else if (absLat >= 62) needed = 2;
         else if (absLat >= 60) needed = 3;
         else if (absLat >= 58) needed = 4;
         else if (absLat >= 54) needed = 5;
         else if (absLat >= 50) needed = 6;
         else if (absLat >= 46) needed = 7;
         else if (absLat >= 40) needed = 8;
         else needed = 9;
         
         setKpNeeded(needed);
       });
    }

    // 2. Fetch Data
    async function fetchData() {
      try {
        const res = await fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
        if (!res.ok) throw new Error('Failed to fetch KP index');
        const rawData = await res.json();
        
        // Take last 2 hours (120 points)
        const recentData = rawData.slice(-120).map((item: any) => {
             // Append Z to ensure UTC if missing
             const dateStr = item.time_tag.endsWith('Z') ? item.time_tag : item.time_tag + 'Z';
             const date = new Date(dateStr);
             return {
                 time_tag: item.time_tag,
                 kp_index: item.kp_index,
                 localTime: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                 timestamp: date.getTime()
             };
        });
        
        setData(recentData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000 * 5); // 5 min
    return () => clearInterval(interval);
  }, []);

  const currentKp = data.length > 0 ? data[data.length - 1].kp_index : 0;
  
  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full flex flex-col">
       <h2 className="text-xl font-bold mb-4 text-yellow-300 flex items-center gap-2">
        <Sun className="w-6 h-6" /> Space Weather (Kp {currentKp.toFixed(1)})
      </h2>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                dataKey="timestamp" 
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                stroke="#64748b"
                tick={{ fontSize: 10 }}
                minTickGap={30}
            />
            <YAxis stroke="#94a3b8" domain={[0, 9]} ticks={[0,3,6,9]} width={20} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
                itemStyle={{ color: '#fcd34d' }}
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
            />
            <Line 
                type="monotone" 
                dataKey="kp_index" 
                stroke="#fcd34d" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

       {location && (
        <div className="mt-4 pt-3 border-t border-slate-700/50">
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Your Location Impact:
                </span>
                <span className={`font-bold ${currentKp >= (kpNeeded || 9) ? 'text-green-400' : 'text-slate-500'}`}>
                    {currentKp >= (kpNeeded || 9) ? "Possible Aurora!" : "Low Activity"}
                </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
                 You need ~Kp {kpNeeded} for visibility at {Math.abs(location.lat).toFixed(0)}° latitude.
            </p>
        </div>
       )}
    </div>
  );
}
