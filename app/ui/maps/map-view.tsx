'use client';

import RoutesAllInfoByPost from '@/app/lib/definitions';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const customIcon = new L.Icon({
  // iconUrl: LocationIconMap, // puedes usar el de leaflet o uno tuyo
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});


export default function MapViews({ 
  routesAll, 
  positionUser,
}: { 
  routesAll: RoutesAllInfoByPost[];
  positionUser: number[];
}) {

  const positionCenter = [-35.426944000000000,	-71.665556000000000];

  return (
    <>
      <MapContainer
        center={positionCenter}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcador del usuario */}
        {positionUser && (
          <Marker position={positionUser} icon={customIcon}>
            <Popup>Tu ubicación</Popup>
          </Marker>
        )}

        {/* Marcadores de rutas */}
        {routesAll.map((route) => (
          <Marker key={route.id} position={route.coords} icon={customIcon}>
            <Popup>
              <b>{route.name}</b>
              <br />
              {route.difficulty} - {route.distance}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}



