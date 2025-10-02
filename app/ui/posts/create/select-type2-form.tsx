'use client';

import { useEffect, useState } from "react";
import { Categorias, Subcategorias } from '@/app/lib/definitions';
import {
  fetchAllCategorias,
  fetchAllSubcategoriasByCategoriaID,
} from '@/app/lib/data';



export default function SelectCategoriaSubCategoriaRoutes({
  onSubCategorias,
  onSelectCatChange,
  onSelectSubCatChange,
}: {
  onSubCategorias: number[];
  onSelectCatChange: number;
  onSelectSubCatChange: (values: number[]) => void;
}) {
  const [selectedCategoria, setSelectedCategoria] = useState();
  const [selectedSubCategorias, setSelectedSubCategorias] = useState<number[]>(onSubCategorias || []);
  const [optionsCategorias, setOptionsCategorias] = useState<Categorias[]>([]);
  const [optionsSubCategorias, setOptionsSubCategorias] = useState<Subcategorias[]>([]);

  useEffect(() => {
    fetchAllCategorias()
      .then((data) => {
        const normalized = data.map((d) => ({
          id: Number(d.id),           // importante: asegurarnos number
          nombre: String(d.nombre),
        }));
        setOptionsCategorias(normalized);
      })
      .catch((error) => {
        console.error("Error al obtener las categorías: ", error);
      });
  }, []);

  useEffect(() => {
    if(!selectedCategoria) return;

    fetchAllSubcategoriasByCategoriaID(selectedCategoria)
      .then((data) => {
        const normalized = data.map((d) => ({
          id: Number(d.id),           // importante: asegurarnos number
          nombre: String(d.nombre),
        }));
        setOptionsSubCategorias(normalized);
      })
      .catch((error) => {
        console.error("Error al obtener las subcategorías: ", error);
      });
  }, [selectedCategoria]);

  // Agregar categoría
  const handleAddSubCategoria = (id: number) => {
    if (!selectedSubCategorias.includes(id)) {
      const newValues = [...selectedSubCategorias, id];
      setSelectedSubCategorias(newValues);
      // onSelectCatChange(newValues);
    }
  };

  // Eliminar categoría
  const handleRemoveSubCategoria = (id: number) => {
    const newValues = selectedSubCategorias.filter((subcatId) => subcatId !== id);
    setSelectedSubCategorias(newValues);
    // onSelectCatChange(newValues);
  };

  useEffect(() => {
    if (selectedCategoria && selectedSubCategorias){
      onSelectCatChange(selectedCategoria);
      onSelectSubCatChange(selectedSubCategorias);
    }
  }, [selectedCategoria, selectedSubCategorias])

  // console.log("rutas selects: ", selectedCategoria);


  return (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría de la Ruta
        </label>
        <select
          // multiple
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          className="w-full rounded-md border border-gray-500 bg-white p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          required
        >
          <option value="">Selecciona una Categoría</option>
          {optionsCategorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

      <label className="block text-sm font-medium">SubCategorías de la Ruta</label>

      {/* Tags seleccionados */}
      <div className="flex flex-wrap gap-2">
        {selectedSubCategorias.map((id) => {
          const subcat = optionsSubCategorias.find((sc) => sc.id === id);
          if (!subcat) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {subcat.nombre}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-900"
                onClick={() => handleRemoveSubCategoria(id)}
>
                ✕
              </button>
            </span>
          );
        })}
      </div>

      {/* Selector para agregar */}
      <select
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value) handleAddSubCategoria(value);
          e.target.value = ""; // reset
        }}
        className="w-full rounded-md border border-gray-500 bg-white p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      >
        <option value="">Selecciona una Subcategoría</option>
        {optionsSubCategorias && (
          optionsSubCategorias
            .filter((subcat) => !selectedSubCategorias.includes(subcat.id))
            .map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.nombre}
              </option>
            ))
        )}
      </select>
    </div>
  );
}
