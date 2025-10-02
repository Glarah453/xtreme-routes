'use client';

import { useEffect, useState } from "react";
import { Categorias, Subcategorias } from '@/app/lib/definitions';
import {
  fetchAllCategorias,
  // fetchAllSubcategoriasByCategoriaID,
} from '@/app/lib/data';


export default function SelectCategoriaPost({
  onCategorias,
  onSelectCatChange,
}: {
  onCategorias: number[];
  onSelectCatChange: (values: number[]) => void;
}) {
  const [selectedCategorias, setSelectedCategorias] = useState<number[]>(onCategorias || []);
  const [optionsCategorias, setOptionsCategorias] = useState<Categorias[]>([]);

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

  // Agregar categoría
  const handleAddCategoria = (id: number) => {
    if (!selectedCategorias.includes(id)) {
      const newValues = [...selectedCategorias, id];
      setSelectedCategorias(newValues);
      onSelectCatChange(newValues);
    }
  };

  // Eliminar categoría
  const handleRemoveCategoria = (id: number) => {
    const newValues = selectedCategorias.filter((catId) => catId !== id);
    setSelectedCategorias(newValues);
    onSelectCatChange(newValues);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Categorías de la Publicación</label>

      {/* Tags seleccionados */}
      <div className="flex flex-wrap gap-2">
        {selectedCategorias.map((id) => {
          const cat = optionsCategorias.find((c) => c.id === id);
          if (!cat) return null;
          return (
            <span
              key={id}
              className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
            >
              {cat.nombre}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-900"
                onClick={() => handleRemoveCategoria(id)}
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
          if (value) handleAddCategoria(value);
          e.target.value = ""; // reset
        }}
        className="w-full rounded-md border border-gray-500 bg-white p-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
      >
        <option value="">Selecciona una categoría</option>
        {optionsCategorias
          .filter((cat) => !selectedCategorias.includes(cat.id))
          .map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
      </select>
    </div>
  );
}






