import React from 'react';

export default function UserDetailsCard({ user, onEdit, onCancel }) {
  if (!user) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return timestamp.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detalles del Usuario</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Nombre:</div>
            <div className="w-2/3">{user.nombre} {user.apellido}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Email:</div>
            <div className="w-2/3">{user.email}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Rol:</div>
            <div className="w-2/3 capitalize">
              {user.tipo === 'admin' ? 'Administrador' : user.tipo}
            </div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Carnet RFID:</div>
            <div className="w-2/3">{user.carnetRfid || 'No asignado'}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Fecha de Registro:</div>
            <div className="w-2/3">{formatDate(user.fechaRegistro)}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/3 font-bold text-gray-700">Última Actualización:</div>
            <div className="w-2/3">{formatDate(user.fechaActualizacion)}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button 
            onClick={onEdit} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Editar Usuario
          </button>
          <button 
            onClick={onCancel} 
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 