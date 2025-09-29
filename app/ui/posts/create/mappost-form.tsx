'use client';

import { useState, useEffect } from 'react';
import LocationIconMap from '@/public/icons/location.png';
// import LocationIcon from '../assets/img/location.png'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import L  from 'leaflet';
// import { MapContainer, TileLayer, Marker, Popup,  FeatureGroup } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";
// import 'leaflet-draw/dist/leaflet.draw.css';
// import { EditControl } from 'react-leaflet-draw';

import "leaflet/dist/leaflet.css";


const customIcon = new L.Icon({
    // iconUrl: LocationIconMap,  // Ruta a tu imagen de ícono personalizado
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [20, 25],  // Tamaño del ícono
    iconAnchor: [16, 32],  // Punto de anclaje del ícono
    popupAnchor: [0, -32],  // Punto de anclaje del popup
  });



// export default async function MapForm() {
// export default function MapFormPost() {
export default function MapFormPost({
  mapCenter,
  coords,
}: {
  mapCenter: number[];
  coords: number;
}) {

  // const [clickedPosition, setClickedPosition] = useState(null);
  const [coordsPosition, setCoordsPosition] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);


   const MapClickHandler = ({ onClick }) => {
    const map = useMapEvents({
      click: (e) => {
        onClick(e);
        map.locate();
      },
    });

    return null;
  };


  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    coords({ lat, lng })
    setCoordsPosition({ lat, lng });
  };

  // console.log(coordenates)
  
  return (
    <div>      
      <MapContainer 
        // key={`${mapCenter[0]}-${mapCenter[1]}`}
        center={mapCenter} 
        zoom={12} 
        style={{ height: '400px', width: '680px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <FeatureGroup> */}
        {/*    <EditControl */}
        {/*     position='topright' */}
        {/*     // onCreated={handleCreated} */}
        {/*     draw={{ */}
        {/*       marker: { */}
        {/*         icon: customIcon, // Use the default marker icon */}
        {/*       }, */}
        {/*       rectangle: false, */}
        {/*       circle: false, */}
        {/*       circlemarker: false, */}
        {/*       polyline: false, */}
        {/*     }} */}
        {/*   /> */}
        {/* </FeatureGroup> */}
         
        
        <MapClickHandler onClick={handleMapClick} />
        {coordsPosition && (
          <Marker position={coordsPosition} icon={customIcon}>
            {/* <Popup>Coordenadas: {clickedPosition.lat}, {clickedPosition.lng}</Popup> */}
            <Popup>Tu punto seleccionado</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );

}
