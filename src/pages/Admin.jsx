import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  obtenerTodosLosUsuarios, 
  eliminarUsuario, 
  obtenerEstadisticasAsistencia, 
  obtenerEstadisticasEquipos,
  obtenerUltimosRegistrosAsistencia,
  esAdministrador,
  obtenerEstadisticasDashboard,
  actualizarRolUsuario,
  buscarUsuarios
} from '../services/adminService';
import { actualizarUsuario } from '../services/usuariosService';
import EditUserForm from '../components/EditUserForm';
import UserDetailsCard from '../components/UserDetailsCard';
import DashboardStats from '../components/DashboardStats';

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticasAsistencia, setEstadisticasAsistencia] = useState(null);
  const [estadisticasEquipos, setEstadisticasEquipos] = useState(null);
  const [ultimosRegistros, setUltimosRegistros] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard'); // dashboard, usuarios, asistencia, equipos
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { currentUser } = useAuth();

  useEffect(() => {
    // Verificar si el usuario es administrador
    async function verificarAdmin() {
      if (!currentUser) return;
      
      try {
        const esAdmin = await esAdministrador(currentUser.uid);
        if (!esAdmin) {
          setError('No tienes permisos de administrador');
          setLoading(false);
          return;
        }
        
        cargarDatos();
      } catch (error) {
        console.error("Error al verificar permisos:", error);
        setError('Error al verificar permisos de administrador');
        setLoading(false);
      }
    }
    
    verificarAdmin();
  }, [currentUser]);

  const cargarDatos = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Cargar datos según la pestaña actual
      if (tab === 'dashboard') {
        const stats = await obtenerEstadisticasDashboard();
        setDashboardStats(stats);
      } else if (tab === 'usuarios') {
        let data;
        if (searchTerm.trim()) {
          data = await buscarUsuarios(searchTerm);
        } else {
          data = await obtenerTodosLosUsuarios();
        }
        setUsuarios(data);
      } else if (tab === 'asistencia') {
        try {
          const stats = await obtenerEstadisticasAsistencia();
          setEstadisticasAsistencia(stats);
        } catch (asistenciaError) {
          console.error("Error al obtener estadísticas de asistencia:", asistenciaError);
          setError('Error al cargar estadísticas de asistencia: ' + (asistenciaError.message || 'Error desconocido'));
        }
        
        try {
          const ultimos = await obtenerUltimosRegistrosAsistencia(10);
          setUltimosRegistros(ultimos);
        } catch (ultimosError) {
          console.error("Error al obtener últimos registros:", ultimosError);
          if (!error) {
            setError('Error al cargar últimos registros: ' + (ultimosError.message || 'Error desconocido'));
          }
        }
      } else if (tab === 'equipos') {
        const stats = await obtenerEstadisticasEquipos();
        setEstadisticasEquipos(stats);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setError('Error al cargar datos. Por favor, intenta de nuevo. Detalles: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUsuario = async (uid) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await eliminarUsuario(uid);
        // Actualizar la lista de usuarios
        setUsuarios(usuarios.filter(usuario => usuario.id !== uid));
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setError('Error al eliminar usuario. Por favor, intenta de nuevo.');
      }
    }
  };

  const handleViewUser = (usuario) => {
    setSelectedUser(usuario);
    setViewMode(true);
    setEditMode(false);
  };

  const handleEditUser = (usuario) => {
    setSelectedUser(usuario);
    setEditMode(true);
    setViewMode(false);
  };

  const handleCancelEdit = () => {
    setSelectedUser(null);
    setEditMode(false);
    setViewMode(false);
  };

  const handleSaveUser = async (updatedData) => {
    try {
      if (updatedData.tipo !== selectedUser.tipo) {
        // Si el rol cambió, actualizar el rol primero
        await actualizarRolUsuario(selectedUser.id, updatedData.tipo);
      }
      
      // Actualizar otros datos del usuario
      await actualizarUsuario(selectedUser.id, updatedData);
      
      // Actualizar la lista de usuarios
      setUsuarios(usuarios.map(user => 
        user.id === selectedUser.id ? { ...user, ...updatedData } : user
      ));
      
      setEditMode(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setError('Error al actualizar usuario: ' + error.message);
    }
  };

  // Cambiar pestaña y cargar datos correspondientes
  const cambiarTab = (nuevaTab) => {
    setTab(nuevaTab);
    setSearchTerm('');
    setSelectedUser(null);
    setEditMode(false);
    setViewMode(false);
    cargarDatos();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    cargarDatos();
  };

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

  if (error && error.includes('No tienes permisos')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
        <p className="text-center text-gray-600">
          No tienes acceso a esta página. Por favor, contacta al administrador para solicitar acceso.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Pestañas */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button 
          className={`py-2 px-4 font-medium whitespace-nowrap ${tab === 'dashboard' 
            ? 'text-blue-600 border-b-2 border-blue-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => cambiarTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`py-2 px-4 font-medium whitespace-nowrap ${tab === 'usuarios' 
            ? 'text-blue-600 border-b-2 border-blue-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => cambiarTab('usuarios')}
        >
          Usuarios
        </button>
        <button 
          className={`py-2 px-4 font-medium whitespace-nowrap ${tab === 'asistencia' 
            ? 'text-blue-600 border-b-2 border-blue-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => cambiarTab('asistencia')}
        >
          Asistencia
        </button>
        <button 
          className={`py-2 px-4 font-medium whitespace-nowrap ${tab === 'equipos' 
            ? 'text-blue-600 border-b-2 border-blue-500' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => cambiarTab('equipos')}
        >
          Equipos
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Dashboard */}
          {tab === 'dashboard' && dashboardStats && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
              <DashboardStats stats={dashboardStats} userRole="admin" />
              
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => cambiarTab('usuarios')}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Gestionar Usuarios
                  </button>
                  <button 
                    onClick={() => cambiarTab('asistencia')}
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Ver Asistencias
                  </button>
                  <button 
                    onClick={() => cambiarTab('equipos')}
                    className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
                  >
                    Administrar Equipos
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Gestión de Usuarios */}
          {tab === 'usuarios' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
              
              {/* Buscador de usuarios */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre, email o RFID..."
                    className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                  >
                    Buscar
                  </button>
                </div>
              </form>
              
              {usuarios.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No hay usuarios registrados</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Nombre</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Apellido</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tipo</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Carnet RFID</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{usuario.nombre}</td>
                          <td className="py-3 px-4">{usuario.apellido}</td>
                          <td className="py-3 px-4">{usuario.email}</td>
                          <td className="py-3 px-4 capitalize">{usuario.tipo === 'admin' ? 'Administrador' : usuario.tipo}</td>
                          <td className="py-3 px-4">{usuario.carnetRfid || 'No asignado'}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewUser(usuario)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs"
                              >
                                Ver
                              </button>
                              <button
                                onClick={() => handleEditUser(usuario)}
                                className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleEliminarUsuario(usuario.id)}
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
          
          {/* Resto del contenido existente */}
          {tab === 'asistencia' && estadisticasAsistencia && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Estadísticas de Asistencia</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium text-gray-700 mb-2">Total de Registros</h3>
                  <p className="text-3xl font-bold text-blue-600">{estadisticasAsistencia.total}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium text-gray-700 mb-2">Entradas</h3>
                  <p className="text-3xl font-bold text-green-600">{estadisticasAsistencia.entradas}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="font-medium text-gray-700 mb-2">Salidas</h3>
                  <p className="text-3xl font-bold text-red-600">{estadisticasAsistencia.salidas}</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Últimos Registros</h3>
              {ultimosRegistros.length === 0 ? (
                <p className="text-gray-600">No hay registros de asistencia</p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-800 text-white">
                      <tr>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Usuario ID</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Tipo</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Fecha</th>
                        <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Carnet RFID</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700">
                      {ultimosRegistros.map((registro) => (
                        <tr key={registro.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{registro.usuarioId || 'N/A'}</td>
                          <td className="py-3 px-4 capitalize">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              registro.tipo === 'entrada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {registro.tipo || 'N/A'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {formatearFecha(registro.fecha)}
                          </td>
                          <td className="py-3 px-4">{registro.carnetRfid || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
          {tab === 'equipos' && estadisticasEquipos && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Estadísticas de Equipos</h2>
              
              <div className="bg-white p-4 rounded shadow mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Total de Equipos</h3>
                <p className="text-3xl font-bold text-blue-600">{estadisticasEquipos.total}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Por Tipo</h3>
                  <div className="bg-white p-4 rounded shadow">
                    <ul className="space-y-2">
                      {Object.entries(estadisticasEquipos.porTipo).map(([tipo, cantidad]) => (
                        <li key={tipo} className="flex justify-between">
                          <span className="capitalize">{tipo}</span>
                          <span className="font-semibold">{cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Por Marca</h3>
                  <div className="bg-white p-4 rounded shadow">
                    <ul className="space-y-2">
                      {Object.entries(estadisticasEquipos.porMarca).map(([marca, cantidad]) => (
                        <li key={marca} className="flex justify-between">
                          <span className="capitalize">{marca}</span>
                          <span className="font-semibold">{cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Modales para ver y editar usuarios */}
          {viewMode && selectedUser && (
            <UserDetailsCard 
              user={selectedUser} 
              onEdit={() => {
                setViewMode(false);
                setEditMode(true);
              }} 
              onCancel={handleCancelEdit} 
            />
          )}
          
          {editMode && selectedUser && (
            <EditUserForm 
              user={selectedUser} 
              onSave={handleSaveUser} 
              onCancel={handleCancelEdit} 
            />
          )}
        </div>
      )}
    </div>
  );
} 