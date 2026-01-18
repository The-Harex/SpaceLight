'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import { Satellite } from 'lucide-react';

// Fix for default marker icon in Leaflet with Next.js/Webpack
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [100, 100],
  iconAnchor: [50, 50],
  popupAnchor: [0, -50],
  className: 'drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] brightness-150 filter'
});

function MapController({ position }: { position: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function ISSMap() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await res.json();
        setPosition([data.latitude, data.longitude]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching ISS position", err);
      }
    };

    fetchISS();
    const interval = setInterval(fetchISS, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !position) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-900 text-blue-400">
        <Satellite className="animate-spin w-8 h-8 mr-2" />
        Loading ISS Position...
      </div>
    );
  }

  return (
    <MapContainer 
      center={position} 
      zoom={3} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={issIcon}>
        <Popup>
          ISS Current Location <br />
          Lat: {position[0].toFixed(2)}, Lon: {position[1].toFixed(2)}
        </Popup>
      </Marker>
      <MapController position={position} />
    </MapContainer>
  );
}
