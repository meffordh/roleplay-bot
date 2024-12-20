import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationMap.scss';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
      mapRef.current = L.map(containerRef.current, {
        zoomControl: true,
        attributionControl: true,
        fadeAnimation: false,
        zoomAnimation: false
      }).setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(center, mapRef.current.getZoom(), {
        animate: false
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom(), {
        animate: false
      });
    }
  }, [center]);

  return <div ref={containerRef} data-component="Map" />;
}
