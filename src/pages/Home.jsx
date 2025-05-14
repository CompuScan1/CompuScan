import { useState } from 'react';

export default function Home() {
  const [userRole] = useState('Aprendiz'); // Simulamos un rol por defecto

  // Contenido personalizado según el rol del usuario
  const renderPersonalizedContent = () => {
    return (
      <>
        {/* Panel de Administración */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2D8C00] text-white p-8 rounded-xl shadow-lg mb-12 transform hover:scale-[1.02] transition-transform">
          <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
          <p className="text-green-100 mb-6">
            Bienvenido al panel de control. Gestiona el sistema de manera eficiente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/admin" 
              className="bg-white text-[#39A900] hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Panel de Control
            </a>
            <a 
              href="/equipos" 
              className="bg-white text-[#39A900] hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Gestionar Equipos
            </a>
            <a 
              href="/asistencia" 
              className="bg-white text-[#39A900] hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Control de Asistencia
            </a>
          </div>
        </div>

        {/* Panel de Instructor */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white p-8 rounded-xl shadow-lg mb-12 transform hover:scale-[1.02] transition-transform">
          <h2 className="text-2xl font-bold mb-4">Bienvenido, Instructor</h2>
          <p className="text-blue-100 mb-6">
            Gestiona tus equipos y registra tu asistencia de manera eficiente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/equipos" 
              className="bg-white text-[#2563EB] hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Mis Equipos
            </a>
            <a 
              href="/asistencia" 
              className="bg-white text-[#2563EB] hover:bg-blue-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Registrar Asistencia
            </a>
          </div>
        </div>

        {/* Panel de Aprendiz */}
        <div className="bg-gradient-to-r from-[#39A900] to-[#2D8C00] text-white p-8 rounded-xl shadow-lg mb-12 transform hover:scale-[1.02] transition-transform">
          <h2 className="text-2xl font-bold mb-4">Bienvenido, Aprendiz</h2>
          <p className="text-green-100 mb-6">
            Gestiona tu equipo y mantén tu asistencia al día de forma sencilla.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/equipos" 
              className="bg-white text-[#39A900] hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Mi Equipo
            </a>
            <a 
              href="/asistencia" 
              className="bg-white text-[#39A900] hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition duration-300 text-center shadow-md hover:shadow-xl"
            >
              Registrar Asistencia
            </a>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#39A900] to-[#2D8C00] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <a href="/" className="text-5xl md:text-7xl font-extrabold mb-6 animate-fade-in inline-block">
              CompuScan
            </a>
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Sistema inteligente de control de equipos y asistencia con tecnología RFID
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="/registro" 
                className="inline-block bg-white text-[#39A900] font-bold py-4 px-8 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Registrarse
              </a>
              <a 
                href="/login" 
                className="inline-block bg-[#2563EB] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#1D4ED8] transition-all duration-300 shadow-lg transform hover:scale-105"
              >
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {renderPersonalizedContent()}

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#39A900]">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="text-[#39A900] mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-[#39A900]">Seguridad Avanzada</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Sistema de autenticación RFID seguro y control de acceso avanzado para proteger tus equipos.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="text-[#2563EB] mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-[#2563EB]">Eficiencia Total</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Registro rápido de entrada y salida con un simple toque de tu tarjeta RFID.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="text-[#39A900] mb-6 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center text-[#39A900]">Gestión Inteligente</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Informes detallados y análisis en tiempo real para una mejor toma de decisiones.
              </p>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 p-12 rounded-2xl shadow-lg mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#39A900]">
            Proceso Simple
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-[#39A900]">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#39A900]">Regístrate</h3>
              <p className="text-gray-600 leading-relaxed">
                Crea tu cuenta y vincula tu tarjeta RFID en minutos.
              </p>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-[#2563EB]">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#2563EB]">Configura</h3>
              <p className="text-gray-600 leading-relaxed">
                Registra tu equipo con todos sus detalles.
              </p>
            </div>
            
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="bg-white h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-[#39A900]">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#39A900]">¡Listo!</h3>
              <p className="text-gray-600 leading-relaxed">
                Comienza a registrar tu asistencia de forma automática.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto bg-white p-12 rounded-2xl shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#39A900]">
            Únete a CompuScan
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Moderniza tu gestión de equipos y asistencia con nuestra plataforma inteligente.
          </p>
          <a 
            href="/equipos"
            className="inline-block bg-gradient-to-r from-[#39A900] to-[#2563EB] text-white font-bold py-4 px-8 rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Comenzar Ahora
          </a>
        </section>
      </div>
    </div>
  );
} 