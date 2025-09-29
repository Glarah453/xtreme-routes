

import { useEffect, useState } from "react";

import { 
  fetchAllRegiones, 
  fetchAllComunasByRegionID,
} from '@/app/lib/data';


export default function SelectRegionComuna({
  onMapCenterChange, 
  onSelectChange,
}: {
  onMapCenterChange: number[], 
  onSelectChange: number,
}){
  // const [options1, setOptions1] = useState([]);
  // const [options2, setOptions2] = useState([]);

  // const [mapCenter, setMapCenter] = useState([]); // Coordenadas de Santiago, Chile  
  
  // const [id_region, setID_region] = useState();
  // const [id_comuna, setID_comuna] = useState();

  const [region, setRegion] = useState("");
  const [regiones, setRegiones] = useState("");
  const [comuna, setComuna] = useState("");

  const [optionsRegiones, setOptionsRegiones] = useState([]);
  const [optionsComunas, setOptionsComunas] = useState([]);

  useEffect(() => {
    fetchAllRegiones()
      .then((data) => {
        // const arrayRg = data.response;
        // const arrayRg = data[0];
        const mappedOptions = data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nombre} 
          </option>
        ));

        setOptionsRegiones(mappedOptions);
        setRegiones(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del primer select:', error);
      });

  }, []);

  useEffect(() => {
    if(!region) return;

    fetchAllComunasByRegionID(region)
      .then((data) => {
        // const arrayCm = data.response;
        // const arrayCm = data[0];
        const mappedOptions = data.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nombre}
          </option>
        ));

        setOptionsComunas(mappedOptions);
      })
      .catch((error) => {
        console.error('Error al obtener los datos del segundo select:', error);
      });

  }, [region]);

  // console.log("regiones: ", regiones);
  // console.log("region id: ", region);

  useEffect(() => {
    if (region){
      const dataRegion = regiones[region-1]
      // console.log("data Region: ", dataRegion);
    
      // console.log("coordenadas: ", dataRegion.latitud, dataRegion.longitud);
      // setMapCenter([dataRegion.latitud, dataRegion.longitud]);
      // console.log(mapCenter);
      onMapCenterChange([dataRegion.latitud, dataRegion.longitud])
    } else {
      return;
    }
  }, [regiones, region]);

  // console.log("mapCenter: ", mapCenter);

  useEffect(() => {
    if ( region && comuna ) {
      // onSelectChange({ region, comuna })
      onSelectChange(comuna)
    }
  }, [region, comuna]);


  return (
    <>
      <label className="block">
        <span className="text-sm font-medium">Región</span>
        <select
          type="number"
          name="region"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          // defaultValue={prefill.photoURL}
          className="mt-1 block w-full border rounded p-2"
          required
        >
          <option value="">Selecciona una Región</option>
          {optionsRegiones}
        </select>
        {/* <i className="bx bxs-image-alt"></i> */}
        <i className="bx bxs-map-pin"></i>
      </label>
      {/* {errorIdregion && */}
      {/*   <span className="error email-error"> */}
      {/*     <i className="bx bx-error-circle error-icon"></i> */}
      {/*     <p className="error-text">El campo de Region no puede estar vacio</p> */}
      {/*   </span> */}
      {/* } */}
      <label className="block">
        <span className="text-sm font-medium">Comuna</span>
        <select
          type="number"
          name="comuna"
          placeholder="Comuna"
          // defaultValue={prefill.email}
          value={comuna}
          onChange={(e) => setComuna(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          required
        >
          <option value="">Selecciona una Comuna</option>
          {optionsComunas}
        </select>
        <i className="bx bxs-map-pin"></i>
      </label>
      {/* {errorIdcomuna && */}
      {/*   <span className="error email-error"> */}
      {/*     <i className="bx bx-error-circle error-icon"></i> */}
      {/*     <p className="error-text">El campo de Comuna no puede estar vacio</p> */}
      {/*   </span> */}
      {/* } */}
    </>
  );
}
