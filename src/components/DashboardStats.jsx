import React from 'react';

export default function DashboardStats({ stats, userRole }) {
  if (!stats) return null;
  
  const { usuarios, equipos, asistencias } = stats;
  
  // Si es un administrador, mostrar todas las estadísticas
  if (userRole === 'admin') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Usuarios</p>
              <p className="text-3xl font-bold text-gray-700">{usuarios.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Aprendices: {usuarios.aprendices || 0}</span>
              <span>Instructores: {usuarios.instructores || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Asistencias</p>
              <p className="text-3xl font-bold text-gray-700">{asistencias.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Entradas: {asistencias.entradas || 0}</span>
              <span>Salidas: {asistencias.salidas || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Equipos</p>
              <p className="text-3xl font-bold text-gray-700">{equipos.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Activos: {equipos.activos || 0}</span>
              <span>Inactivos: {equipos.inactivos || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Si es un instructor, mostrar estadísticas de asistencia y equipos
  if (userRole === 'Instructor') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Asistencias de Hoy</p>
              <p className="text-3xl font-bold text-gray-700">{asistencias.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Aprendices Presentes: {asistencias.entradas - asistencias.salidas || 0}</span>
              <span>Total Aprendices: {usuarios.aprendices || 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Equipos</p>
              <p className="text-3xl font-bold text-gray-700">{equipos.total || 0}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>En Uso: {equipos.activos || 0}</span>
              <span>Disponibles: {equipos.inactivos || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Si es un aprendiz, mostrar solo estadísticas personales
  if (userRole === 'Aprendiz') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Mis Asistencias</p>
              <p className="text-3xl font-bold text-gray-700">
                {stats.misAsistencias ? stats.misAsistencias.total || 0 : 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Este Mes: {stats.misAsistencias ? stats.misAsistencias.mes || 0 : 0}</span>
              <span>Esta Semana: {stats.misAsistencias ? stats.misAsistencias.semana || 0 : 0}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Mi Equipo</p>
              <p className="text-3xl font-bold text-gray-700">
                {stats.miEquipo ? 'Asignado' : 'No Asignado'}
              </p>
            </div>
          </div>
          {stats.miEquipo && (
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                <p>Tipo: {stats.miEquipo.tipo || 'N/A'}</p>
                <p>Estado: {stats.miEquipo.estado || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Por defecto, mostrar un mensaje de bienvenida genérico
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500 mb-8">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Bienvenido a CompuScan</h2>
      <p className="text-gray-600">
        Este es tu panel de control personalizado. Contacta con el administrador si necesitas más información.
      </p>
    </div>
  );
} 