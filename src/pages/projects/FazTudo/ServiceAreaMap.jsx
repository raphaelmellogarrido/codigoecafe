// src/pages/projects/FazTudo/ServiceAreaMap.jsx
// Mapa "cru" com Leaflet, no mesmo espírito do PropertyMap.jsx da Imobiliária:
// tile OpenStreetMap (sem chave de API), scroll-zoom desligado. Diferença: em
// vez de um marcador de imóvel, mostra um círculo representando o raio de
// atendimento a partir de um centro fixo.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function centerIcon() {
  return L.divIcon({ className: 'ft-map-pin', iconSize: [22, 22] });
}

export default function ServiceAreaMap({ center, radiusKm, label }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const map = L.map(mountRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    }).setView([center.lat, center.lng], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

    const marker = L.marker([center.lat, center.lng], { icon: centerIcon() }).addTo(map);
    if (label) marker.bindPopup(label);

    const circle = L.circle([center.lat, center.lng], {
      radius: radiusKm * 1000,
      color: '#ff7a1a',
      weight: 2,
      fillColor: '#ff7a1a',
      fillOpacity: 0.15,
    }).addTo(map);

    map.fitBounds(circle.getBounds());

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center.lat, center.lng, radiusKm, label]);

  return <div ref={mountRef} className="ft-map" />;
}
