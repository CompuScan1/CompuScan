import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser, loading, userRole } = useAuth();
  
  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redirigir a login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no es administrador, mostrar acceso denegado
  if (userRole !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Acceso denegado</span>
        </div>
        <p className="text-gray-600 mb-4">
          No tienes permisos de administrador para acceder a esta página.
        </p>
        <a 
          href="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Volver al inicio
        </a>
      </div>
    );
  }
  
  // Si el usuario es administrador, mostrar el componente hijo
  return children;
} 