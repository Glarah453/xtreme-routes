"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";



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

const MapViews = dynamic(() => import("@/app/ui/maps/map-view"), {
  ssr: false, // 👈 esto evita que intente renderizar en el servidor
});

export default function Page() {
  const [positionUser, setPositionUser] = useState<[number, number] | null>(null);

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
        setPositionUser([pos.coords.latitude, pos.coords.longitude]);
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
        <MapViews routesAll={routes} positionUser={positionUser} />

      </div>
    </div>
  );
}
