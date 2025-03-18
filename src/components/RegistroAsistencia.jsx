import { useState, useEffect } from 'react';
import { registrarEntrada, registrarSalida, verificarUltimaAsistencia } from '../services/asistenciaService';
import { buscarUsuarioPorRfid } from '../services/usuariosService';
import { useAuth } from '../context/AuthContext';

export default function RegistroAsistencia({ onRegistroExitoso }) {
  const [carnetRfid, setCarnetRfid] = useState('');
  const [tipoRegistro, setTipoRegistro] = useState('entrada');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ultimoRegistro, setUltimoRegistro] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const { currentUser } = useAuth();

  // Simulación de la lectura RFID - En un caso real, esto se conectaría a un lector RFID
  const handleRfidInput = (e) => {
    setCarnetRfid(e.target.value);
    // Limpiar mensajes al cambiar el RFID
    if (error) setError('');
    if (success) setSuccess('');
  };

  // Formatear fecha para mostrar
  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      } else if (timestamp.toDate) {
        return timestamp.toDate().toLocaleString();
      } else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      return 'N/A';
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return 'N/A';
    }
  };

  const buscarUsuario = async () => {
    if (!carnetRfid || carnetRfid.trim() === '') return;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Buscar usuario por RFID
      const usuarioEncontrado = await buscarUsuarioPorRfid(carnetRfid);
      
      if (!usuarioEncontrado) {
        setError('No se encontró ningún usuario con este carnet RFID');
        setUsuario(null);
        return;
      }
      
      // Validar que el usuario encontrado sea el mismo que está autenticado
      if (usuarioEncontrado.id !== currentUser.uid) {
        setError('Este carnet RFID no te pertenece. No puedes registrar asistencia con un carnet ajeno.');
        setUsuario(null);
        return;
      }
      
      setUsuario(usuarioEncontrado);
      
      // Verificar la última asistencia del usuario
      const ultimaAsistencia = await verificarUltimaAsistencia(usuarioEncontrado.id);
      setUltimoRegistro(ultimaAsistencia);
      
      // Sugerir el tipo de registro (entrada o salida) basado en la última asistencia
      if (ultimaAsistencia && ultimaAsistencia.tipo === 'entrada') {
        setTipoRegistro('salida');
      } else {
        setTipoRegistro('entrada');
      }
      
    } catch (error) {
      console.error("Error al buscar usuario:", error);
      setError('Error al buscar información del usuario: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // Efecto para buscar el usuario cuando cambia el RFID
  useEffect(() => {
    if (carnetRfid && carnetRfid.trim() !== '') {
      const timer = setTimeout(() => {
        buscarUsuario();
      }, 800); // Esperar 800ms después de la última entrada para evitar múltiples búsquedas
      
      return () => clearTimeout(timer);
    }
  }, [carnetRfid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!carnetRfid || carnetRfid.trim() === '') {
      return setError('Por favor, ingresa el ID del carnet RFID');
    }
    
    if (!usuario) {
      return setError('No se ha encontrado ningún usuario con este carnet RFID');
    }
    
    // Validar nuevamente que el usuario sea el autenticado
    if (usuario.id !== currentUser.uid) {
      return setError('Este carnet RFID no te pertenece. No puedes registrar asistencia con un carnet ajeno.');
    }

    try {
      setLoading(true);
      
      // Registrar entrada o salida según el tipo
      if (tipoRegistro === 'entrada') {
        await registrarEntrada(usuario.id, carnetRfid);
        setSuccess(`Entrada registrada para ${usuario.nombre} ${usuario.apellido}`);
      } else {
        await registrarSalida(usuario.id, carnetRfid);
        setSuccess(`Salida registrada para ${usuario.nombre} ${usuario.apellido}`);
      }
      
      // Actualizar último registro
      await buscarUsuario();
      
      // Notificar al componente padre que se ha registrado correctamente
      if (onRegistroExitoso && typeof onRegistroExitoso === 'function') {
        onRegistroExitoso();
      }
      
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      setError('Error al registrar asistencia: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Registro de Asistencia</h2>
        <p className="text-gray-600">Registra tu entrada o salida con tu carnet RFID</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {/* Información del usuario */}
      {usuario && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative mb-4">
          <h3 className="font-bold">Usuario encontrado:</h3>
          <p>Nombre: {usuario.nombre} {usuario.apellido}</p>
          <p>Email: {usuario.email}</p>
          <p>Tipo: {usuario.tipo}</p>
          {ultimoRegistro && (
            <p className="mt-2">
              Último registro: {ultimoRegistro.tipo} - {formatearFecha(ultimoRegistro.fecha)}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="carnetRfid" className="block text-gray-700 text-sm font-bold mb-2">
            Carnet RFID *
          </label>
          <input
            id="carnetRfid"
            type="text"
            value={carnetRfid}
            onChange={handleRfidInput}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Escanea tu carnet RFID"
            required
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Acerca tu carnet al lector RFID o ingresa el código manualmente
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Registro
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoRegistro"
                value="entrada"
                checked={tipoRegistro === 'entrada'}
                onChange={() => setTipoRegistro('entrada')}
                className="form-radio h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700">Entrada</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoRegistro"
                value="salida"
                checked={tipoRegistro === 'salida'}
                onChange={() => setTipoRegistro('salida')}
                className="form-radio h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-gray-700">Salida</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Asistencia'}
          </button>
        </div>
      </form>
    </div>
  );
} 