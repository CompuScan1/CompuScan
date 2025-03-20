import React, { useState } from 'react';

export default function RoleSelectionModal({ onSubmit, onCancel }) {
  const [selectedRole, setSelectedRole] = useState('Aprendiz');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(selectedRole);
    } catch (error) {
      console.error("Error al seleccionar rol:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-[#39A900]">Selecciona tu rol</h2>
        
        <p className="text-gray-600 mb-4">
          Para completar tu registro, por favor indica qué tipo de usuario eres:
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <input
                id="role-aprendiz"
                type="radio"
                name="role"
                value="Aprendiz"
                checked={selectedRole === 'Aprendiz'}
                onChange={() => setSelectedRole('Aprendiz')}
                className="w-4 h-4 text-[#39A900] focus:ring-[#39A900]"
              />
              <label htmlFor="role-aprendiz" className="ml-2 text-gray-700">
                Aprendiz
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="role-instructor"
                type="radio"
                name="role"
                value="Instructor"
                checked={selectedRole === 'Instructor'}
                onChange={() => setSelectedRole('Instructor')}
                className="w-4 h-4 text-[#39A900] focus:ring-[#39A900]"
              />
              <label htmlFor="role-instructor" className="ml-2 text-gray-700">
                Instructor
              </label>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className={`bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 