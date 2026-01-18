'use client';
import dynamic from 'next/dynamic';
import { Satellite } from 'lucide-react';

const ISSMap = dynamic(() => import('./ISSMap'), {
  ssr: false,
  loading: () => (
    <div className="h-64 md:h-full w-full flex items-center justify-center bg-slate-800 rounded-xl text-slate-500">
      <Satellite className="animate-pulse w-8 h-8 mr-2" />
      Loading Map...
    </div>
  ),
});

export default function ISSTracker() {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl h-[400px] md:h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
        <Satellite className="w-6 h-6" /> Live ISS Tracker
      </h2>
      <div className="flex-1 rounded-xl overflow-hidden relative z-0">
         <ISSMap />
      </div>
    </div>
  );
}
