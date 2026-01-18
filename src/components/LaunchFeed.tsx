// src/components/LaunchFeed.tsx
import React from 'react';
import { Calendar, MapPin, Rocket } from 'lucide-react';

interface Launch {
  id: string;
  name: string;
  status: { name: string; abbrev: string };
  net: string; // No Earlier Than time
  pad: { name: string; location: { name: string } };
  rocket: { configuration: { name: string } };
  mission: { description: string } | null;
  image: string | null;
}

async function getLaunches() {
  try {
    const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=5', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch launches');
    const data = await res.json();
    return data.results as Launch[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function LaunchFeed() {
  const launches = await getLaunches();

  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
      <h2 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
        <Rocket className="w-5 h-5" /> Upcoming Launches
      </h2>
      <div className="space-y-4">
        {launches.length === 0 ? (
          <p className="text-slate-400">No launch data available.</p>
        ) : (
          launches.map((launch) => (
            <div key={launch.id} className="bg-slate-800/50 p-3 rounded-lg hover:bg-slate-800 transition-colors">
              <h3 className="font-semibold text-white text-md">{launch.name}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(launch.net).toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                 <MapPin className="w-3 h-3" />
                 {launch.pad.location.name}
              </p>
              {launch.mission && (
                <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                  {launch.mission.description}
                </p>
              )}
              <div className="mt-2 text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  launch.status.abbrev === 'Go' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                }`}>
                  {launch.status.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
