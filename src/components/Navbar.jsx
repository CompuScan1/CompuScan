import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-gradient">
                CompuScan
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/')
                    ? 'border-primary-main text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-neutral-300'
                }`}
              >
                Inicio
              </Link>
              <Link
                to="/asistencia"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/asistencia')
                    ? 'border-primary-main text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-neutral-300'
                }`}
              >
                Asistencia
              </Link>
              <Link
                to="/equipos"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/equipos')
                    ? 'border-primary-main text-text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-neutral-300'
                }`}
              >
                Equipos
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Link
              to="/perfil"
              className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/perfil')
                  ? 'bg-primary-light/10 text-primary-main'
                  : 'text-text-secondary hover:text-text-primary hover:bg-neutral-100'
              }`}
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 