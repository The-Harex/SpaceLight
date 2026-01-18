'use client';
import { useEffect, useState } from 'react';

export default function APODBackground() {
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAPOD() {
      try {
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        if (res.ok) {
            const data = await res.json();
            if (data.media_type === 'image') {
                setBgUrl(data.hdurl || data.url);
            }
        }
      } catch (e) {
        console.error("APOD fetch failed", e);
      }
    }
    fetchAPOD();
  }, []);

  if (!bgUrl) {
    return (
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#1e1b4b] to-black" />
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-opacity duration-1000 ease-in-out opacity-40"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-black/60 via-slate-900/50 to-slate-900/90" />
    </>
  );
}
