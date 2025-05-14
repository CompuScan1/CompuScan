import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardStats from '../components/DashboardStats';

export default function Dashboard() {
  // Datos simulados
  const [stats] = useState({
    usuariosActivos: 45,
    asistenciasHoy: 25,
    equiposDisponibles: 20,
    ultimasAsistencias: 5
  });
  const [loading] = useState(false);
  const [error] = useState('');
  const [userRole] = useState('Aprendiz'); // Simulamos un rol por defecto
  const [ultimasAsistencias] = useState([
    { id: '1', fecha: new Date().toLocaleString(), tipo: 'entrada', estado: 'Completado' },
    { id: '2', fecha: new Date().toLocaleString(), tipo: 'salida', estado: 'Completado' },
    { id: '3', fecha: new Date().toLocaleString(), tipo: 'entrada', estado: 'Pendiente' }
  ]);

  // Mostrar acciones rápidas según el rol
  const renderAccionesRapidas = () => {
    if (userRole === 'admin') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link to="/admin" className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded text-center">
            Panel de Administración
          </Link>
          <Link to="/usuarios" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center">
            Gestionar Usuarios
          </Link>
          <Link to="/asistencia" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center">
            Control de Asistencia
          </Link>
          <Link to="/equipos" className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-center">
            Gestionar Equipos
          </Link>
        </div>
      );
    }
    
    if (userRole === 'Instructor') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/asistencia" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center">
            Registrar Asistencia
          </Link>
          <Link to="/equipos" className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded text-center">
            Gestionar Equipos
          </Link>
          <Link to="/perfil" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center">
            Mi Perfil
          </Link>
        </div>
      );
    }
    
    if (userRole === 'Aprendiz') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/asistencia" className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-center">
            Registrar Asistencia
          </Link>
          <Link to="/perfil" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-center">
            Mi Perfil
          </Link>
        </div>
      );
    }
    
    return null;
  };
  
  // Contenido adicional según el rol
  const renderContenidoAdicional = () => {
    // Para aprendices, mostrar últimas asistencias
    if (userRole === 'Aprendiz' && ultimasAsistencias.length > 0) {
      return (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Mis Últimas Asistencias</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimasAsistencias.map((asistencia) => (
                  <tr key={asistencia.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asistencia.fecha}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        asistencia.tipo === 'entrada' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {asistencia.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asistencia.estado}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link 
              to="/asistencia" 
              className="text-blue-600 hover:text-blue-800"
            >
              Ver todas mis asistencias →
            </Link>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel Principal</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-700 hover:bg-red-800 text-white font-medium py-1 px-3 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Estadísticas según rol */}
          {stats && <DashboardStats stats={stats} userRole={userRole} />}
          
          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
            {renderAccionesRapidas()}
          </div>
          
          {/* Contenido adicional específico del rol */}
          {renderContenidoAdicional()}
        </>
      )}
    </div>
  );
} 