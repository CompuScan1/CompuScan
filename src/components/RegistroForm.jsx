import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { crearUsuario } from '../services/usuariosService';

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
  
  const { signup, updateUserProfile, loginWithGoogle } = useAuth();

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
    
    const { nombre, apellido, email, password, confirmPassword, carnetRfid, tipo } = formData;
    
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

    try {
      setLoading(true);
      
      // Registrar el usuario en Firebase Auth
      const userCredential = await signup(email, password);
      const user = userCredential.user;
      
      // Actualizar el perfil del usuario
      await updateUserProfile(user, {
        displayName: `${nombre} ${apellido}`
      });
      
      // Guardar información adicional en Firestore
      await crearUsuario({
        uid: user.uid,
        nombre,
        apellido,
        email,
        carnetRfid: carnetRfid || null,
        tipo,
        activo: true
      });
      
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión');
      
      // Limpiar el formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        confirmPassword: '',
        carnetRfid: '',
        tipo: 'Aprendiz'
      });
      
      // Redirigir después de registro exitoso
      // history.push('/login');
    } catch (error) {
      console.error("Error de registro:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError('El correo electrónico ya está en uso');
      } else if (error.message?.includes("carnet RFID")) {
        setError(error.message);
      } else {
        setError('Error al registrar usuario. Por favor, inténtalo de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await loginWithGoogle();
      setSuccess('¡Registro con Google exitoso!');
      
      // Redirigir después de registro exitoso
      // history.push('/dashboard');
    } catch (error) {
      console.error("Error al registrarse con Google:", error);
      setError('Error al registrarse con Google. Por favor, inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
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

      <div className="mb-2">
        <button
          type="button"
          onClick={handleGoogleRegister}
          className={`flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full hover:bg-gray-100 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          <svg 
            className="w-5 h-5 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 48 48"
          >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Registrarse con Google
        </button>
      </div>
      
      <div className="mb-4 text-center text-sm text-gray-600">
        <p>Al registrarte con Google, se te pedirá seleccionar si eres Aprendiz o Instructor.</p>
      </div>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">o</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

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
            Correo Electrónico *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="********"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Contraseña *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
              placeholder="********"
              required
            />
          </div>
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
            placeholder="ID del carnet RFID"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Usuario *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            required
          >
            <option value="Aprendiz">Aprendiz</option>
            <option value="Instructor">Instructor</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-[#FF6600] hover:text-[#E65C00]">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
} 