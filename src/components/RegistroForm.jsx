import { useState } from 'react';

export default function RegistroForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    carnetRfid: '',
    tipo: 'Aprendiz'
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
    const { nombre, apellido, email, password, confirmPassword } = formData;
    // Validaciones
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      return setError('Por favor, completa todos los campos obligatorios');
    }
    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }
    setLoading(true);
    setTimeout(() => {
      setSuccess('¡Registro exitoso! (Simulado, solo frontend)');
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        carnetRfid: '',
        tipo: 'Aprendiz'
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#39A900]">Registro de Usuario</h2>
        <p className="text-gray-600">Crea tu cuenta en CompuScan</p>
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="nombre" className="block text-gray-700 text-sm font-bold mb-2">
              Nombre *
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              placeholder="Nombre"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="apellido" className="block text-gray-700 text-sm font-bold mb-2">
              Apellido *
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              placeholder="Apellido"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Correo electrónico *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            placeholder="Correo electrónico"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            placeholder="Contraseña"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Confirmar contraseña *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            placeholder="Confirmar contraseña"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="carnetRfid" className="block text-gray-700 text-sm font-bold mb-2">
            Carnet RFID (opcional)
          </label>
          <input
            id="carnetRfid"
            name="carnetRfid"
            type="text"
            value={formData.carnetRfid}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            placeholder="Carnet RFID"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de usuario
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
          >
            <option value="Aprendiz">Aprendiz</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>
        <button
          type="submit"
          className={`bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
    </div>
  );
} 