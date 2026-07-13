// src/pages/projects/AppDelivery/DeliveryMap.jsx
// Mapa "cru" com Leaflet (sem lib de integração React), no mesmo espírito do
// ThreeBackground do Portfolio Criativo: useRef/useEffect para montar e limpar
// tudo o que a lib externa cria. Leaflet + OpenStreetMap não exigem chave de API.

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function interpolate(a, b, t) {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}

function pinIcon(className) {
  return L.divIcon({ className: `delivery-pin ${className}`, iconSize: [16, 16] });
}

export default function DeliveryMap({ origin, destination, progress }) {
  const mountRef = useRef(null);
  const courierRef = useRef(null);

  useEffect(() => {
    const map = L.map(mountRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([(origin.lat + destination.lat) / 2, (origin.lng + destination.lng) / 2], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

    L.marker([origin.lat, origin.lng], { icon: pinIcon('delivery-pin-origin') }).addTo(map);
    L.marker([destination.lat, destination.lng], { icon: pinIcon('delivery-pin-destination') }).addTo(map);
    L.polyline(
      [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ],
      { color: '#dc2626', weight: 3, dashArray: '6 8', opacity: 0.7 }
    ).addTo(map);

    courierRef.current = L.marker([origin.lat, origin.lng], { icon: pinIcon('delivery-pin-courier') }).addTo(
      map
    );

    return () => {
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!courierRef.current) return;
    const pos = interpolate(origin, destination, progress);
    courierRef.current.setLatLng([pos.lat, pos.lng]);
  }, [progress, origin, destination]);

  return <div ref={mountRef} className="delivery-map" />;
}
