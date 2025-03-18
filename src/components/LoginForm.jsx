import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Por favor, completa todos los campos');
    }

    try {
      setLoading(true);
      await login(email, password);
      // Redirigir después de inicio de sesión exitoso
      // history.push('/dashboard');
    } catch (error) {
      console.error("Error de inicio de sesión:", error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Correo electrónico o contraseña incorrectos');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Demasiados intentos fallidos. Por favor, inténtalo más tarde');
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      // Redirigir después de inicio de sesión exitoso
      // history.push('/dashboard');
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setError('Error al iniciar sesión con Google. Por favor, inténtalo de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
        <p className="text-gray-600">Accede a tu cuenta de CompuScan</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="********"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`flex items-center justify-center bg-white border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full hover:bg-gray-100 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          <svg 
            className="w-4 h-4 mr-2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 48 48"
          >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Iniciar sesión con Google
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a href="/registro" className="text-blue-500 hover:text-blue-800">
              Regístrate aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
} 