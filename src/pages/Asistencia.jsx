import { useState } from 'react';
import RegistroAsistencia from '../components/RegistroAsistencia';

export default function Asistencia() {
  const [asistencias] = useState([
    {
      id: 1,
      fecha: new Date(),
      tipo: 'entrada',
      estado: 'activo',
      carnetRfid: 'RFID123'
    },
    {
      id: 2,
      fecha: new Date(Date.now() - 86400000), // Ayer
      tipo: 'salida',
      estado: 'activo',
      carnetRfid: 'RFID123'
    }
  ]);
  const [loading] = useState(false);
  const [error] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Formatear fecha para mostrar
  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Control de Asistencia</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-[#39A900] to-[#2563EB] hover:opacity-90 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {showForm ? 'Ver Historial de Asistencia' : 'Registrar Asistencia'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            className="mt-2 bg-red-700 hover:bg-red-800 text-white font-medium py-1 px-3 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {showForm ? (
        <RegistroAsistencia onRegistroExitoso={() => {}} />
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : asistencias.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No hay registros de asistencia aún.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-gradient-to-r from-[#39A900] to-[#2563EB] hover:opacity-90 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Registrar mi primera asistencia
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tipo</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Estado</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Carnet RFID</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {asistencias.map((asistencia) => (
                    <tr key={asistencia.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {formatearFecha(asistencia.fecha)}
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          asistencia.tipo === 'entrada' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {asistencia.tipo || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 capitalize">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          asistencia.estado === 'activo' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {asistencia.estado || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">{asistencia.carnetRfid || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 