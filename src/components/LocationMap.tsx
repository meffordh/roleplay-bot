import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.scss';

interface LocationMapProps {
  center: [number, number];
  location?: string;
}

export function LocationMap({ center, location }: LocationMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(center, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        mapRef.current,
      );
    } else {
      mapRef.current.setView(center);
    }

    const marker = L.marker(center).addTo(mapRef.current);
    if (location) {
      marker.bindPopup(location).openPopup();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, location]);

  return <div ref={containerRef} data-component="Map" />;
}
