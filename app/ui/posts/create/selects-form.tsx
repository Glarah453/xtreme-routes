

import { useEffect, useState } from "react";

import { 
  fetchAllRegiones, 
  fetchAllComunasByRegionID,
} from '@/app/lib/data';


export default function SelectRegionComuna({
  onMapCenterChange, 
  onSelectChange,
}: {
  onMapCenterChange: number, 
    onSelectChange: number
}){
  // const [options1, setOptions1] = useState([]);
  // const [options2, setOptions2] = useState([]);

  const [mapCenter, setMapCenter] = useState([-35.426944, -71.665556]); // Coordenadas de Santiago, Chile  
  
  // const [id_region, setID_region] = useState();
  // const [id_comuna, setID_comuna] = useState();

  const [region, setRegion] = useState("");
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

  useEffect(() => {
    if (mapCenter){
      onMapCenterChange(mapCenter)
    }
  }, [mapCenter]);

  useEffect(() => {
    if ( region && comuna ) {
      onSelectChange({ region, comuna })
    }
  }, [region, comuna]);


  return (
    <>
      <div className="field email-field">
        <div className="input-field">
          <select
            type="number"
            name="region"
            placeholder="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            // defaultValue={prefill.photoURL}
            required
          >
            <option value="">Selecciona una Región</option>
            {optionsRegiones}
          </select>
          {/* <i className="bx bxs-image-alt"></i> */}
          <i className="bx bxs-map-pin"></i>
        </div>
        {/* {errorIdregion && */}
        {/*   <span className="error email-error"> */}
        {/*     <i className="bx bx-error-circle error-icon"></i> */}
        {/*     <p className="error-text">El campo de Region no puede estar vacio</p> */}
        {/*   </span> */}
        {/* } */}
      </div>
      <div className="field email-field">
        <div className="input-field">
          <select
            type="number"
            name="comuna"
            placeholder="Comuna"
            // defaultValue={prefill.email}
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          >
            <option value="">Selecciona una Comuna</option>
            {optionsComunas}
          </select>
          <i className="bx bxs-map-pin"></i>
        </div>
        {/* {errorIdcomuna && */}
        {/*   <span className="error email-error"> */}
        {/*     <i className="bx bx-error-circle error-icon"></i> */}
        {/*     <p className="error-text">El campo de Comuna no puede estar vacio</p> */}
        {/*   </span> */}
        {/* } */}
      </div>
    </>
  );
}
