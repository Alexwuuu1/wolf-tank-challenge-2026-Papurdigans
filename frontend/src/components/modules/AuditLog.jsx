import React from 'react';

const AuditLog = () => {
  // Datos de prueba (mock data) para ver cómo luce el diseño
  const logsPrueba = [
    { id: 1, usuario: 'Alex Quispe', accion: 'Inicio de sesión', modulo: 'Auth', fecha: '2026-05-16 20:30' },
    { id: 2, usuario: 'Alejandro', accion: 'Actualización de producto', modulo: 'Catalog', fecha: '2026-05-16 19:15' },
    { id: 3, usuario: 'Alex Quispe', accion: 'Creación de orden #104', modulo: 'Orders', fecha: '2026-05-16 18:45' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bitácora de Auditoría</h1>
        <p className="text-sm text-gray-500 mt-1">
          Historial detallado de las actividades, modificaciones y cambios realizados en la plataforma.
        </p>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-600 tracking-wider">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Usuario</th>
              <th className="px-6 py-3">Acción Realizada</th>
              <th className="px-6 py-3">Módulo</th>
              <th className="px-6 py-3">Fecha y Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-700">
            {logsPrueba.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">#{log.id}</td>
                <td className="px-6 py-4">{log.usuario}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {log.accion}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.modulo}</td>
                <td className="px-6 py-4 text-gray-500">{log.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLog;