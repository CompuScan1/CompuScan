import { useState } from 'react';

export default function Admin() {
  // Datos simulados
  const [usuarios, setUsuarios] = useState([
    { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@correo.com', tipo: 'Aprendiz', activo: true },
    { id: '2', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@correo.com', tipo: 'Instructor', activo: true },
    { id: '3', nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos.rodriguez@correo.com', tipo: 'Aprendiz', activo: false }
  ]);
  const [estadisticasAsistencia, setEstadisticasAsistencia] = useState({
    totalAsistencias: 150,
    asistenciasHoy: 25,
    ausenciasHoy: 5
  });
  const [estadisticasEquipos, setEstadisticasEquipos] = useState({
    totalEquipos: 30,
    equiposDisponibles: 20,
    equiposEnUso: 10
  });
  const [ultimosRegistros, setUltimosRegistros] = useState([
    { id: '1', usuario: 'Juan Pérez', fecha: new Date().toLocaleString(), tipo: 'Entrada' },
    { id: '2', usuario: 'María González', fecha: new Date().toLocaleString(), tipo: 'Salida' }
  ]);
  const [dashboardStats, setDashboardStats] = useState({
    usuariosActivos: 45,
    asistenciasHoy: 25,
    equiposDisponibles: 20
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard'); // dashboard, usuarios, asistencia, equipos
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');

  const handleEliminarUsuario = (uid) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      setUsuarios(usuarios.filter(usuario => usuario.id !== uid));
      setError('');
      setSuccess('Usuario eliminado con éxito (Simulado, solo frontend)');
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

  const handleSaveUser = (updatedData) => {
    setUsuarios(usuarios.map(user => 
      user.id === selectedUser.id ? { ...user, ...updatedData } : user
    ));
    setEditMode(false);
    setSelectedUser(null);
    setSuccess('Usuario actualizado con éxito (Simulado, solo frontend)');
  };

  const cambiarTab = (nuevaTab) => {
    setTab(nuevaTab);
    setSearchTerm('');
    setSelectedUser(null);
    setEditMode(false);
    setViewMode(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Simular búsqueda
    const filteredUsers = usuarios.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setUsuarios(filteredUsers);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Panel de Administración</h1>
      <div className="flex justify-center mb-6">
        <button
          onClick={() => cambiarTab('dashboard')}
          className={`px-4 py-2 mx-2 rounded ${tab === 'dashboard' ? 'bg-[#39A900] text-white' : 'bg-gray-200'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => cambiarTab('usuarios')}
          className={`px-4 py-2 mx-2 rounded ${tab === 'usuarios' ? 'bg-[#39A900] text-white' : 'bg-gray-200'}`}
        >
          Usuarios
        </button>
        <button
          onClick={() => cambiarTab('asistencia')}
          className={`px-4 py-2 mx-2 rounded ${tab === 'asistencia' ? 'bg-[#39A900] text-white' : 'bg-gray-200'}`}
        >
          Asistencia
        </button>
        <button
          onClick={() => cambiarTab('equipos')}
          className={`px-4 py-2 mx-2 rounded ${tab === 'equipos' ? 'bg-[#39A900] text-white' : 'bg-gray-200'}`}
        >
          Equipos
        </button>
      </div>
      {error && (
        <div className="bg-orange-100 border border-[#FF6600] text-[#FF6600] px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-[#39A900] text-[#39A900] px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      {tab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Usuarios Activos</h3>
            <p className="text-2xl">{dashboardStats.usuariosActivos}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Asistencias Hoy</h3>
            <p className="text-2xl">{dashboardStats.asistenciasHoy}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Equipos Disponibles</h3>
            <p className="text-2xl">{dashboardStats.equiposDisponibles}</p>
          </div>
        </div>
      )}
      {tab === 'usuarios' && (
        <div>
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuarios..."
              className="border rounded px-4 py-2 w-full"
            />
          </form>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map(usuario => (
              <div key={usuario.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-bold">{usuario.nombre} {usuario.apellido}</h3>
                <p>{usuario.email}</p>
                <p>Tipo: {usuario.tipo}</p>
                <p>Estado: {usuario.activo ? 'Activo' : 'Inactivo'}</p>
                <div className="mt-2">
                  <button
                    onClick={() => handleViewUser(usuario)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEditUser(usuario)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarUsuario(usuario.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'asistencia' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">Total Asistencias</h3>
              <p className="text-2xl">{estadisticasAsistencia.totalAsistencias}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">Asistencias Hoy</h3>
              <p className="text-2xl">{estadisticasAsistencia.asistenciasHoy}</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold">Ausencias Hoy</h3>
              <p className="text-2xl">{estadisticasAsistencia.ausenciasHoy}</p>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">Últimos Registros</h3>
          <div className="bg-white p-4 rounded shadow">
            {ultimosRegistros.map(registro => (
              <div key={registro.id} className="border-b py-2">
                <p><strong>{registro.usuario}</strong> - {registro.fecha} - {registro.tipo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'equipos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Total Equipos</h3>
            <p className="text-2xl">{estadisticasEquipos.totalEquipos}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Equipos Disponibles</h3>
            <p className="text-2xl">{estadisticasEquipos.equiposDisponibles}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">Equipos En Uso</h3>
            <p className="text-2xl">{estadisticasEquipos.equiposEnUso}</p>
          </div>
        </div>
      )}
    </div>
  );
} 