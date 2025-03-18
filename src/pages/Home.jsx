import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { currentUser, userRole } = useAuth();

  // Contenido personalizado según el rol del usuario
  const renderPersonalizedContent = () => {
    if (!currentUser) {
      // No mostrar nada para usuarios no autenticados, ya que pueden usar el navbar
      return null;
    }

    if (userRole === 'admin') {
      return (
        <div className="bg-purple-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold mb-2 text-purple-800">Panel de Administración</h2>
          <p className="text-gray-600 mb-4">
            Tienes acceso completo al sistema. Administra usuarios, revisa estadísticas y gestiona la aplicación.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/admin" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Panel de Administración
            </a>
            <a 
              href="/equipos" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Gestionar Equipos
            </a>
            <a 
              href="/asistencia" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Control de Asistencia
            </a>
          </div>
        </div>
      );
    }

    if (userRole === 'instructor') {
      return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold mb-2 text-blue-800">Bienvenido, Instructor</h2>
          <p className="text-gray-600 mb-4">
            Puedes registrar tu asistencia y gestionar los equipos a tu cargo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/equipos" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Mis Equipos
            </a>
            <a 
              href="/asistencia" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Registrar Asistencia
            </a>
          </div>
        </div>
      );
    }

    if (userRole === 'aprendiz') {
      return (
        <div className="bg-green-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-2 text-green-800">Bienvenido, Aprendiz</h2>
          <p className="text-gray-600 mb-4">
            Registra tu asistencia y mantén actualizada la información de tu equipo.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/equipos" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Mi Equipo
            </a>
            <a 
              href="/asistencia" 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 text-center"
            >
              Registrar Asistencia
            </a>
          </div>
        </div>
      );
    }

    // Usuario autenticado pero sin rol específico
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-2">Bienvenido a CompuScan</h2>
        <p className="text-gray-600 mb-4">
          Has iniciado sesión correctamente, pero tu perfil aún no tiene asignado un rol específico.
          Por favor, contacta al administrador para obtener acceso completo al sistema.
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderPersonalizedContent()}

      <section className="mb-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-blue-800">
            CompuScan
          </h1>
          <p className="text-xl text-center max-w-3xl mb-8 text-gray-600">
            Sistema de registro y control de equipos y asistencia mediante tecnología RFID.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Seguridad Avanzada</h2>
          <p className="text-gray-600">
            Protegemos la información con autenticación segura mediante RFID y controles de acceso,
            asegurando que solo los usuarios autorizados puedan registrar su asistencia y utilizar los equipos.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Ahorro de Tiempo</h2>
          <p className="text-gray-600">
            Elimina las largas filas y los procesos manuales. Registra tu entrada y salida con solo acercar
            tu carnet RFID, agilizando el proceso y mejorando tu experiencia.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Informes Detallados</h2>
          <p className="text-gray-600">
            Accede a informes personalizados que permiten analizar el uso de las computadoras, facilitando
            la toma de decisiones basadas en datos precisos.
          </p>
        </div>
      </section>

      <section className="bg-blue-50 p-8 rounded-lg shadow-md mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">¿Cómo Funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-800 text-xl font-bold">1</span>
            </div>
            <h3 className="font-bold mb-2">Regístrate</h3>
            <p className="text-gray-600">
              Crea tu cuenta y asocia tu carnet RFID para comenzar a utilizar el sistema.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-800 text-xl font-bold">2</span>
            </div>
            <h3 className="font-bold mb-2">Registra tu Equipo</h3>
            <p className="text-gray-600">
              Ingresa los datos de tu computadora para que quede registrada en el sistema.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-800 text-xl font-bold">3</span>
            </div>
            <h3 className="font-bold mb-2">Controla tu Asistencia</h3>
            <p className="text-gray-600">
              Utiliza tu carnet RFID para registrar entradas y salidas de manera fácil y rápida.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">¿Listo para empezar?</h2>
        <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
          Únete a CompuScan hoy y disfruta de todos los beneficios de un sistema moderno de control de equipos y asistencia.
        </p>
        <a 
          href={currentUser ? "/equipos" : "/registro"} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          {currentUser ? "Ir a mi Panel" : "Registrarme Ahora"}
        </a>
      </section>
    </div>
  );
} 