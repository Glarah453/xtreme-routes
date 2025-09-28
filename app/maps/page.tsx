"use client";

import { useEffect, useState } from "react";
import LocationIconMap from '@/public/icons/location.png';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Ícono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: LocationIconMap, // puedes usar el de leaflet o uno tuyo
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

type Route = {
  id: number;
  name: string;
  location: string;
  coords: [number, number];
  difficulty: string;
  distance: string;
  time: string;
  image: string;
};

export default function RoutesPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Rutas de ejemplo
  const routes: Route[] = [
    {
      id: 1,
      name: "Cerro Peñón",
      location: "Maule, Chile",
      coords: [-35.426, -71.655],
      difficulty: "Moderada",
      distance: "4.8 km",
      time: "2-2.5 h",
      image: "/routes/penon.jpg",
    },
    {
      id: 2,
      name: "Laguna Querquel",
      location: "Talca, Chile",
      coords: [-35.44, -71.66],
      difficulty: "Fácil",
      distance: "3 km",
      time: "1 h",
      image: "/routes/querquel.jpg",
    },
  ];

  // Obtener ubicación actual del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[400px] overflow-y-auto bg-gray-50 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Explora nuestras rutas</h2>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          <select className="border rounded px-2 py-1 text-sm">
            <option>Distancia</option>
            <option>Corta</option>
            <option>Larga</option>
          </select>
          <select className="border rounded px-2 py-1 text-sm">
            <option>Dificultad</option>
            <option>Fácil</option>
            <option>Moderada</option>
            <option>Difícil</option>
          </select>
        </div>

        {/* Lista de rutas */}
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-white rounded-lg shadow">
              <img
                src={route.image}
                alt={route.name}
                className="h-40 w-full object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h3 className="font-semibold">{route.name}</h3>
                <p className="text-sm text-gray-500">{route.location}</p>
                <p className="text-xs mt-1">
                  ⭐ {route.difficulty} · {route.distance} · Est. {route.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="flex-1">
        {position && (
          <MapContainer
            center={position}
            zoom={12}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Marcador del usuario */}
            <Marker position={position} icon={customIcon}>
              <Popup>Tu ubicación</Popup>
            </Marker>

            {/* Marcadores de rutas */}
            {routes.map((route) => (
              <Marker key={route.id} position={route.coords} icon={customIcon}>
                <Popup>
                  <b>{route.name}</b>
                  <br />
                  {route.difficulty} - {route.distance}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}
