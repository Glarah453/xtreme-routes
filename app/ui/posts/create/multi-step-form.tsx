
"use client";

import { useState } from "react";

const steps = [
  { id: 1, title: "Información del post" },
  { id: 2, title: "Información de sectores" },
  { id: 3, title: "Información de rutas" },
  { id: 4, title: "Revisión" },
];

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    post: { titulo: "", descripcion: "" },
    sectores: { nombre: "", detalles: "" },
    rutas: { nombre: "", distancia: "" },
  });

  const handleChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Título</span>
              <input
                type="text"
                value={formData.post.titulo}
                onChange={(e) =>
                  handleChange("post", "titulo", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Descripción</span>
              <textarea
                value={formData.post.descripcion}
                onChange={(e) =>
                  handleChange("post", "descripcion", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Nombre del sector</span>
              <input
                type="text"
                value={formData.sectores.nombre}
                onChange={(e) =>
                  handleChange("sectores", "nombre", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Detalles</span>
              <textarea
                value={formData.sectores.detalles}
                onChange={(e) =>
                  handleChange("sectores", "detalles", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">Nombre de la ruta</span>
              <input
                type="text"
                value={formData.rutas.nombre}
                onChange={(e) =>
                  handleChange("rutas", "nombre", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Distancia</span>
              <input
                type="text"
                value={formData.rutas.distancia}
                onChange={(e) =>
                  handleChange("rutas", "distancia", e.target.value)
                }
                className="mt-1 block w-full border rounded p-2"
              />
            </label>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-bold">Revisión final</h3>
            <pre className="bg-gray-100 p-3 rounded">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      {/* Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex-1 cursor-pointer text-center pb-2 border-b-4 ${
              currentStep === step.id
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-gray-300 text-gray-500"
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>

      {/* Form content */}
      {renderForm()}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Volver
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {currentStep === steps.length ? "Finalizar" : "Guardar y continuar"}
        </button>
      </div>
    </div>
  );
}

