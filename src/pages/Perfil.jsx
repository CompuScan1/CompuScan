import { useState } from 'react';
import { formatearFecha } from '../utils/helpers';

const Perfil = () => {
  // Datos de ejemplo del usuario
  const [usuario, setUsuario] = useState({
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    tipo: 'Aprendiz',
    carnetRfid: 'ABC12345',
    createdAt: new Date('2024-01-01'),
    ultimoAcceso: new Date(),
    equipos: [
      { id: '1', tipo: 'laptop', marca: 'Dell', modelo: 'XPS 13', serial: 'DELL123' },
      { id: '2', tipo: 'tablet', marca: 'Samsung', modelo: 'Tab S7', serial: 'SAM456' }
    ],
    asistencias: [
      { id: '1', tipo: 'entrada', fecha: new Date('2024-03-15 08:00:00'), estado: 'activo' },
      { id: '2', tipo: 'salida', fecha: new Date('2024-03-15 16:00:00'), estado: 'activo' }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    setUsuario(prev => ({
      ...prev,
      ...formData
    }));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background-paper py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Información del perfil */}
          <div className="lg:col-span-1">
            <div className="card bg-white">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-primary-main to-primary-dark flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {usuario.nombre[0]}{usuario.apellido[0]}
                </div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">
                  {usuario.nombre} {usuario.apellido}
                </h2>
                <p className="text-text-secondary mb-4">{usuario.email}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-light/10 text-primary-main mb-6">
                  {usuario.tipo}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Información de contacto</h3>
                  <div className="space-y-2">
                    <p className="flex items-center text-text-primary">
                      <span className="w-24 text-text-secondary">Email:</span>
                      {usuario.email}
                    </p>
                    <p className="flex items-center text-text-primary">
                      <span className="w-24 text-text-secondary">RFID:</span>
                      {usuario.carnetRfid}
                    </p>
                    <p className="flex items-center text-text-primary">
                      <span className="w-24 text-text-secondary">Miembro desde:</span>
                      {formatearFecha(usuario.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-primary w-full"
                  >
                    {isEditing ? 'Cancelar' : 'Editar Perfil'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Formulario de edición y estadísticas */}
          <div className="lg:col-span-2 space-y-8">
            {isEditing ? (
              <div className="card">
                <h3 className="text-xl font-semibold mb-6">Editar Perfil</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="nombre" className="label">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="apellido" className="label">Apellido</label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input"
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button type="submit" className="btn-primary w-full">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Estadísticas */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-6">Estadísticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-light/10 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-primary-main">{usuario.equipos.length}</p>
                      <p className="text-text-secondary">Equipos</p>
                    </div>
                    <div className="bg-secondary-light/10 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-secondary-main">
                        {usuario.asistencias.filter(a => a.tipo === 'entrada').length}
                      </p>
                      <p className="text-text-secondary">Entradas</p>
                    </div>
                    <div className="bg-accent-light/10 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-accent-main">
                        {usuario.asistencias.filter(a => a.tipo === 'salida').length}
                      </p>
                      <p className="text-text-secondary">Salidas</p>
                    </div>
                  </div>
                </div>

                {/* Equipos */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-6">Mis Equipos</h3>
                  <div className="space-y-4">
                    {usuario.equipos.map(equipo => (
                      <div key={equipo.id} className="flex items-center justify-between p-4 bg-background-paper rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">{equipo.marca} {equipo.modelo}</p>
                          <p className="text-sm text-text-secondary">Serial: {equipo.serial}</p>
                        </div>
                        <span className="badge bg-primary-light/10 text-primary-main">
                          {equipo.tipo}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Últimas asistencias */}
                <div className="card">
                  <h3 className="text-xl font-semibold mb-6">Últimas Asistencias</h3>
                  <div className="space-y-4">
                    {usuario.asistencias.map(asistencia => (
                      <div key={asistencia.id} className="flex items-center justify-between p-4 bg-background-paper rounded-lg">
                        <div>
                          <p className="font-medium text-text-primary">
                            {asistencia.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {formatearFecha(asistencia.fecha)}
                          </p>
                        </div>
                        <span className={`badge ${
                          asistencia.tipo === 'entrada' 
                            ? 'bg-success-light text-success-dark'
                            : 'bg-warning-light text-warning-dark'
                        }`}>
                          {asistencia.estado}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil; 