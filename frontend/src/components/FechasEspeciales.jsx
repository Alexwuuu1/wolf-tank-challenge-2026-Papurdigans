import React, { useState } from 'react';

const FechasEspeciales = () => {
  const [selectedCampana, setSelectedCampana] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const campanas = [
    { id: 1, fecha: '27 de Mayo', titulo: 'Día de la Madre', desc: 'Asegura los mejores ramos de rosas y canastas personalizadas para mamá antes de que se agoten.', icono: '🌹', estado: 'Alta Demanda' },
    { id: 2, fecha: '21 de Septiembre', titulo: 'Flores Amarillas', desc: 'La tendencia más grande del año. Detalles vivos, girasoles y arreglos con tonos luminosos.', icono: '🌻', estado: 'Próximamente' },
    { id: 3, fecha: '14 de Febrero', titulo: 'San Valentín', desc: 'El día del amor. Rosas importadas, cajas premium, dedicatorias especiales y entregas programadas.', icono: '💝', estado: 'Campaña Cerrada' },
    { id: 4, fecha: '25 de Diciembre', titulo: 'Navidad y Fin de Año', desc: 'Arreglos navideños para el hogar, centros de mesa y regalos de temporada.', icono: '🎄', estado: 'Próximamente' }
  ];

  const handleOpenModal = (campana) => {
    setSelectedCampana(campana);
    setShowModal(true);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8 border-b pb-4">
        <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Módulo Said
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-2 tracking-tight">
          Reserva antes de los días de alta demanda
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Florería Alesli organiza campañas estratégicas para optimizar la gestión comercial y asegurar tus pedidos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {campanas.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl p-3 bg-pink-50 rounded-xl">{c.icono}</div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  c.estado === 'Alta Demanda' ? 'bg-red-100 text-red-700' : c.estado === 'Próximamente' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {c.estado}
                </span>
              </div>
              <span className="text-xs font-bold uppercase text-pink-600 tracking-wide">{c.fecha}</span>
              <h3 className="text-xl font-bold text-gray-800 my-2">{c.titulo}</h3>
              <p className="text-sm text-gray-500 mb-6">{c.desc}</p>
            </div>
            <button 
              onClick={() => handleOpenModal(c)} 
              className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-xl text-sm hover:bg-gray-800 transition"
            >
              Planificar Reserva
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedCampana && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Pre-reserva: {selectedCampana.titulo}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">&times;</button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Agente Inteligente Alesli: Configura tu pedido automático para evitar subidas de precio.
            </p>
            <button 
              onClick={() => setShowModal(false)} 
              className="w-full py-3 bg-pink-600 text-white font-semibold rounded-xl text-sm"
            >
              Confirmar en Calendario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FechasEspeciales;