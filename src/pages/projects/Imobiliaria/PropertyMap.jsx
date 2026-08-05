// src/pages/projects/Imobiliaria/PropertyMap.jsx
// Mapa "cru" com Leaflet (sem lib de integração React), no mesmo espírito do
// DeliveryMap do App de Delivery. Leaflet + OpenStreetMap não exigem chave
// de API. Mostra só a localização aproximada (cidade) — não a morada exata,
// por privacidade dos proprietários.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function pinIcon() {
  return L.divIcon({ className: 'im-map-pin', iconSize: [22, 22] });
}

export default function PropertyMap({ lat, lng, label }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (lat == null || lng == null) return undefined;

    const map = L.map(mountRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

    const marker = L.marker([lat, lng], { icon: pinIcon() }).addTo(map);
    if (label) marker.bindPopup(label);

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (lat == null || lng == null) return null;

  return <div ref={mountRef} className="im-map" />;
}
