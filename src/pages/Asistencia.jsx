import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RegistroAsistencia from '../components/RegistroAsistencia';
import { obtenerAsistenciasPorUsuario } from '../services/asistenciaService';

export default function Asistencia() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(true);
  const { currentUser } = useAuth();

  // Formatear fecha para mostrar
  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      } else if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      } else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      return 'N/A';
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'N/A';
    }
  };

  // Cargar asistencias del usuario al iniciar
  const fetchAsistencias = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      setError('');
      const data = await obtenerAsistenciasPorUsuario(currentUser.uid);
      setAsistencias(data);
    } catch (error) {
      console.error("Error al obtener asistencias:", error);
      setError(error.message || 'Error al cargar las asistencias. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsistencias();
  }, [currentUser]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Control de Asistencia</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {showForm ? 'Ver Historial de Asistencia' : 'Registrar Asistencia'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={fetchAsistencias}
            className="mt-2 bg-red-700 hover:bg-red-800 text-white font-medium py-1 px-3 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}

      {showForm ? (
        <RegistroAsistencia onRegistroExitoso={fetchAsistencias} />
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
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
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