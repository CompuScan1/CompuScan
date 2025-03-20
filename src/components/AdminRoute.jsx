import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser, loading, userRole } = useAuth();
  
  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39A900]"></div>
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
        <div className="bg-orange-100 border border-[#FF6600] text-[#FF6600] px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">Acceso denegado</span>
        </div>
        <p className="text-gray-600 mb-4">
          No tienes permisos de administrador para acceder a esta página.
        </p>
        <a 
          href="/" 
          className="bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded"
        >
          Volver al inicio
        </a>
      </div>
    );
  }
  
  // Si el usuario es administrador, mostrar el componente hijo
  return children;
} 