import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RegistroEquipo from '../components/RegistroEquipo';
import { obtenerEquipos, buscarEquiposPorUsuario, eliminarEquipo } from '../services/equiposService';

export default function Equipos() {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();

  // Cargar equipos al iniciar
  useEffect(() => {
    async function fetchEquipos() {
      try {
        setLoading(true);
        
        // Si hay un usuario logueado, obtener solo sus equipos
        // Si es administrador, obtener todos los equipos
        const data = currentUser && currentUser.uid 
          ? await buscarEquiposPorUsuario(currentUser.uid)
          : await obtenerEquipos();
        
        setEquipos(data);
      } catch (error) {
        console.error("Error al obtener equipos:", error);
        setError('Error al cargar los equipos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchEquipos();
  }, [currentUser]);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este equipo?')) {
      try {
        await eliminarEquipo(id);
        setEquipos(equipos.filter(equipo => equipo.id !== id));
      } catch (error) {
        console.error("Error al eliminar equipo:", error);
        setError('Error al eliminar el equipo. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestión de Equipos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          {showForm ? 'Ver Lista de Equipos' : 'Registrar Nuevo Equipo'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {showForm ? (
        <RegistroEquipo />
      ) : (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : equipos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">No hay equipos registrados aún.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              >
                Registrar mi primer equipo
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Marca</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Modelo</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Serial</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tipo</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha Registro</th>
                    <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {equipos.map((equipo) => (
                    <tr key={equipo.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{equipo.marca}</td>
                      <td className="py-3 px-4">{equipo.modelo}</td>
                      <td className="py-3 px-4">{equipo.serial}</td>
                      <td className="py-3 px-4 capitalize">{equipo.tipo}</td>
                      <td className="py-3 px-4">
                        {equipo.fechaRegistro?.seconds 
                          ? new Date(equipo.fechaRegistro.seconds * 1000).toLocaleDateString() 
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => console.log('Ver detalles', equipo.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => console.log('Editar', equipo.id)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-2 rounded text-xs"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleEliminar(equipo.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
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