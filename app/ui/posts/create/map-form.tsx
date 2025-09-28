'use client';

import { useState, useEffect } from 'react';
import LocationIconMap from '@/public/icons/location.png';
// import LocationIcon from '../assets/img/location.png'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// import { MapContainer, TileLayer, Marker, Popup,  FeatureGroup } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";
import L  from 'leaflet';
// import 'leaflet-draw/dist/leaflet.draw.css';
// import { EditControl } from 'react-leaflet-draw';

// import "leaflet/dist/leaflet.css";
const customIcon = new L.Icon({
    iconUrl: LocationIconMap,  // Ruta a tu imagen de ícono personalizado
    iconSize: [20, 25],  // Tamaño del ícono
    iconAnchor: [16, 32],  // Punto de anclaje del ícono
    popupAnchor: [0, -32],  // Punto de anclaje del popup
  });

// function MapView({coordenates}) {
//
//  };
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });
//

// export default async function MapForm() {
export default function MapFormPost() {

  const coordenates = [-35.44, -71.66];
  // const coordenates = {
  //     coords: [-35.44, -71.66],
  // };

  // const [clickedPosition, setClickedPosition] = useState(null);
  const [clickedPosition, setClickedPosition] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState<[number, number] | null>(null);
  // 
  // const handleMapClick = (e) => {
  //   const { lat, lng } = e.latlng;
  //   setClickedPosition({ lat, lng });
  // }; 
  
  // useEffect(() => {
  //   if(!coordenates) return;
  //   setClickedPosition(coordenates);
  //   // setClickedPosition(JSON.stringify({ lat: coordenates[0], lng: coordenates[1]}));
  //   // setClickedPosition(coordenates);
  //   // const { lat, lng } = coordenates;
  //   // setClickedPosition({ lat, lng });
  // }, [coordenates])

  console.log(coordenates)
  
  return (
    <div>      
      <MapContainer 
        center={coordenates} 
        zoom={12} 
        style={{ height: '600px', width: '400px' }}
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
         
        
        {clickedPosition && (
          <Marker position={clickedPosition} icon={customIcon}>
            {/* <Popup>Coordenadas: {clickedPosition.lat}, {clickedPosition.lng}</Popup> */}
            <Popup>Tu punto seleccionado</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );

}
