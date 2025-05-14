import { useState } from 'react';

export default function RegistroEquipo() {
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    serial: '',
    tipo: 'laptop',
    color: '',
    observaciones: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const { marca, modelo, serial, tipo, color } = formData;
    
    // Validaciones
    if (!marca || !modelo || !serial || !tipo) {
      return setError('Por favor, completa todos los campos obligatorios');
    }

    try {
      setLoading(true);
      
      // Simular registro exitoso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('¡Equipo registrado exitosamente!');
      
      // Limpiar el formulario
      setFormData({
        marca: '',
        modelo: '',
        serial: '',
        tipo: 'laptop',
        color: '',
        observaciones: ''
      });
      
    } catch (error) {
      console.error("Error al registrar equipo:", error);
      setError('Error al registrar equipo. Por favor, inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Equipo</h2>
        <p className="text-gray-600">Registra tu equipo en CompuScan</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="marca" className="block text-gray-700 text-sm font-bold mb-2">
              Marca *
            </label>
            <input
              id="marca"
              name="marca"
              type="text"
              value={formData.marca}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Marca del equipo"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="modelo" className="block text-gray-700 text-sm font-bold mb-2">
              Modelo *
            </label>
            <input
              id="modelo"
              name="modelo"
              type="text"
              value={formData.modelo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Modelo del equipo"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="serial" className="block text-gray-700 text-sm font-bold mb-2">
            Número de Serial *
          </label>
          <input
            id="serial"
            name="serial"
            type="text"
            value={formData.serial}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Serial del equipo"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Equipo *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="laptop">Laptop</option>
              <option value="desktop">Desktop</option>
              <option value="tablet">Tablet</option>
              <option value="smartphone">Smartphone</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="color" className="block text-gray-700 text-sm font-bold mb-2">
              Color
            </label>
            <input
              id="color"
              name="color"
              type="text"
              value={formData.color}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Color del equipo"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="observaciones" className="block text-gray-700 text-sm font-bold mb-2">
            Observaciones
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="Características adicionales del equipo"
          ></textarea>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-gradient-to-r from-[#39A900] to-[#2563EB] hover:opacity-90 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Equipo'}
          </button>
        </div>
      </form>
    </div>
  );
} 