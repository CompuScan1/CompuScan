import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { updateProfile } from 'firebase/auth';
import { crearUsuario, subirFotoPerfil, eliminarFotoPerfilAnterior } from '../services/usuariosService';

export default function Profile() {
  const { currentUser, userRole } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    carnetRfid: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userDocRef = doc(db, 'usuarios', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setFormData({
            nombre: data.nombre || '',
            apellido: data.apellido || '',
            email: data.email || '',
            carnetRfid: data.carnetRfid || ''
          });
          if (data.photoURL) {
            setPreviewUrl(data.photoURL);
          }
        } else {
          setError('No se encontró información del usuario');
        }
      } catch (err) {
        console.error("Error al cargar datos del usuario:", err);
        setError('Error al cargar datos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const handleInputChange = (e) => {
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
    
    try {
      setLoading(true);
      
      // Verificar si el documento del usuario existe
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Actualizar en Firestore si el documento existe
        await updateDoc(userDocRef, {
          nombre: formData.nombre,
          apellido: formData.apellido,
          carnetRfid: formData.carnetRfid
        });
      } else {
        // Crear el documento si no existe
        await crearUsuario({
          uid: currentUser.uid,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          carnetRfid: formData.carnetRfid,
          tipo: userRole || 'Aprendiz',
          activo: true
        });
      }
      
      // Actualizar displayName en Auth
      await updateProfile(currentUser, {
        displayName: `${formData.nombre} ${formData.apellido}`
      });
      
      // Actualizar estado local
      setUserData({
        ...userData,
        nombre: formData.nombre,
        apellido: formData.apellido,
        carnetRfid: formData.carnetRfid
      });
      
      setSuccess('Perfil actualizado con éxito');
      setEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      setError('Error al actualizar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setEditing(!editing);
    setError('');
    setSuccess('');
    
    // Restaurar formData a valores actuales al cancelar
    if (editing && userData) {
      setFormData({
        nombre: userData.nombre || '',
        apellido: userData.apellido || '',
        email: userData.email || '',
        carnetRfid: userData.carnetRfid || ''
      });
    }
  };

  // Manejar la selección de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Crear URL para vista previa
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Abrir el selector de archivos
  const handleSelectPhotoClick = () => {
    fileInputRef.current.click();
  };

  // Subir foto de perfil
  const handleUploadPhoto = async () => {
    if (!selectedFile) return;
    
    try {
      setUploadingPhoto(true);
      setError('');
      
      // Si ya hay una foto de perfil, eliminarla primero
      if (userData && userData.photoURL) {
        await eliminarFotoPerfilAnterior(userData.photoURL);
      }
      
      // Subir la nueva foto
      const photoURL = await subirFotoPerfil(currentUser.uid, selectedFile);
      
      // Actualizar Auth profile
      await updateProfile(currentUser, { photoURL });
      
      // Actualizar estado local
      setUserData({
        ...userData,
        photoURL
      });
      
      setSuccess('Foto de perfil actualizada con éxito');
      setSelectedFile(null);
    } catch (err) {
      console.error("Error al subir foto de perfil:", err);
      setError('Error al subir foto: ' + err.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39A900]"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado de la página */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Mi Perfil</h1>
          <p className="mt-2 text-sm text-gray-600">Gestiona tu información personal y preferencias</p>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="mb-6 bg-orange-100 border-l-4 border-[#FF6600] text-[#FF6600] p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#FF6600]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-100 border-l-4 border-[#39A900] text-[#39A900] p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-[#39A900]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tarjeta principal */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Sección superior con foto de perfil y nombre */}
          <div className="p-8 sm:p-10 bg-gradient-to-r from-[#39A900] to-[#2D8C00] text-white">
            <div className="flex flex-col md:flex-row items-center">
              {/* Foto de perfil */}
              <div className="relative group mb-6 md:mb-0">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-white p-1 shadow-xl">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full text-gray-400">
                      <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Control para seleccionar foto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                
                {/* Botón sobre la imagen */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={handleSelectPhotoClick}
                    className="bg-[#FF6600] bg-opacity-75 hover:bg-opacity-90 text-white rounded-full p-2 shadow-lg"
                    disabled={uploadingPhoto}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Acciones de la foto */}
              {selectedFile && (
                <div className="md:ml-6 text-center md:text-left">
                  <p className="text-sm text-white bg-[#FF6600] bg-opacity-30 px-4 py-2 rounded-lg mb-3">
                    Nueva imagen seleccionada
                  </p>
                  <button
                    onClick={handleUploadPhoto}
                    className="bg-white text-[#39A900] hover:bg-green-50 font-medium py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    disabled={uploadingPhoto}
                  >
                    {uploadingPhoto ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#39A900]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Subiendo...
                      </span>
                    ) : 'Guardar nueva foto'}
                  </button>
                </div>
              )}
              
              {/* Información principal */}
              <div className="md:ml-8 text-center md:text-left">
                <h2 className="text-2xl font-bold">
                  {userData?.nombre} {userData?.apellido || ''}
                </h2>
                <p className="text-green-100">{userData?.email}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-[#FF6600] bg-opacity-25">
                    {userRole || 'Aprendiz'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenido principal */}
          <div className="p-6 sm:p-8">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#39A900] focus:border-[#39A900] sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#39A900] focus:border-[#39A900] sm:text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
                  </div>
                  
                  <div>
                    <label htmlFor="carnetRfid" className="block text-sm font-medium text-gray-700">
                      Carnet RFID
                    </label>
                    <input
                      type="text"
                      id="carnetRfid"
                      name="carnetRfid"
                      value={formData.carnetRfid}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#39A900] focus:border-[#39A900] sm:text-sm"
                      placeholder="Ingresa tu código RFID"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <input
                      type="text"
                      value={userRole || 'Aprendiz'}
                      disabled
                      className="mt-1 block w-full border border-gray-200 rounded-md py-2 px-3 bg-gray-50 text-gray-500 sm:text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Solo un administrador puede cambiar tu rol</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={toggleEdit}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39A900]"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#39A900] hover:bg-[#2D8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39A900]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </span>
                    ) : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Información Personal</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs text-gray-500">Nombre completo</h4>
                        <p className="text-gray-900 font-medium">{userData?.nombre} {userData?.apellido || ''}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-500">Email</h4>
                        <p className="text-gray-900 font-medium">{userData?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Acceso y Seguridad</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs text-gray-500">Carnet RFID</h4>
                        <p className="text-gray-900 font-medium">
                          {userData?.carnetRfid || (
                            <span className="text-gray-500 italic">No asignado</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-500">Rol en el sistema</h4>
                        <p className="text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-[#39A900]">
                            {userRole || 'Aprendiz'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 border-t border-gray-200 pt-5 flex justify-end">
                  <button
                    onClick={toggleEdit}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#39A900] hover:bg-[#2D8C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#39A900]"
                  >
                    Editar información
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 