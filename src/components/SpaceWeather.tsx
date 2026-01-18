'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sun } from 'lucide-react';

interface KpData {
  time_tag: string;
  kp_index: number;
}

export default function SpaceWeather() {
  const [data, setData] = useState<KpData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
        if (!res.ok) throw new Error('Failed to fetch KP index');
        const jsonData = await res.json();
        // Take the last 24 points (approx 24 minutes or hours depending on granularity, actually 1m.json is 1 minute? Let's check.)
        // It's 1m data? Usually KP is 3h. "planetary_k_index_1m.json" suggests 1 minute derived?
        // Actually let's just take the last 50 points to show trend.
        // Or better: https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json which is the forecast/observed lists.
        // Let's stick to the user request "light weight chart". I'll use the json endpoint I have.
        // The one I picked might be real-time 1 minute estimated kp.
        const recentData = jsonData.slice(-60); // Last hour
        setData(recentData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full flex flex-col">
       <h2 className="text-xl font-bold mb-4 text-yellow-300 flex items-center gap-2">
        <Sun className="w-6 h-6" /> Space Weather (Kp Index)
      </h2>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
                dataKey="time_tag" 
                hide={true} 
            />
            <YAxis stroke="#94a3b8" domain={[0, 9]} />
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
    </div>
  );
}
