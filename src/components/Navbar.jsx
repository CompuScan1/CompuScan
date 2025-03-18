import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/logo.png';

export default function Navbar() {
  const { currentUser, logout, userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Obtener foto del usuario
  useEffect(() => {
    if (currentUser && currentUser.photoURL) {
      setUserPhoto(currentUser.photoURL);
    } else {
      setUserPhoto(null);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={logo} alt="CompuScan Logo" />
              <span className="ml-2 text-white font-bold text-lg">CompuScan</span>
            </Link>
          </div>
          
          {currentUser && (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Inicio
              </Link>
              <Link to="/asistencia" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Asistencia
              </Link>
              <Link to="/equipos" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Equipos
              </Link>
              {userRole === 'Administrativo' && (
                <Link to="/admin" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                  Administración
                </Link>
              )}
            </div>
          )}
          
          <div className="flex items-center">
            {currentUser ? (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                  >
                    {userPhoto ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover border-2 border-white"
                        src={userPhoto}
                        alt="Foto de perfil"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-800 flex items-center justify-center text-white">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 
                         currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </button>
                </div>
                
                {isOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{currentUser.displayName || 'Usuario'}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Mi Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
            
            <div className="md:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
              >
                <svg
                  className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menú móvil */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-blue-700`}>
        {currentUser ? (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Inicio
            </Link>
            <Link to="/asistencia" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Asistencia
            </Link>
            <Link to="/equipos" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Equipos
            </Link>
            {userRole === 'Administrativo' && (
              <Link to="/admin" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
                Administración
              </Link>
            )}
            <Link to="/profile" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Mi Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/login" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 