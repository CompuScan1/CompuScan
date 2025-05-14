import { useState, useRef } from 'react';

export default function Profile() {
  // Datos simulados de usuario
  const [userData, setUserData] = useState({
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@correo.com',
    carnetRfid: '1234567890',
    photoURL: ''
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: userData.nombre,
    apellido: userData.apellido,
    email: userData.email,
    carnetRfid: userData.carnetRfid
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(userData.photoURL);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTimeout(() => {
      setUserData({
        ...userData,
        nombre: formData.nombre,
        apellido: formData.apellido,
        carnetRfid: formData.carnetRfid
      });
      setSuccess('Perfil actualizado con éxito (Simulado, solo frontend)');
      setEditing(false);
    }, 1000);
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

  // Simular subida de foto de perfil
  const handleUploadPhoto = () => {
    if (!selectedFile) return;
    setUploadingPhoto(true);
    setTimeout(() => {
      setUserData({
        ...userData,
        photoURL: previewUrl
      });
      setSuccess('Foto de perfil actualizada con éxito (Simulado, solo frontend)');
      setSelectedFile(null);
      setUploadingPhoto(false);
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 mt-8">
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <img
            src={previewUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.nombre + ' ' + userData.apellido)}
            alt="Foto de perfil"
            className="h-24 w-24 rounded-full object-cover border-4 border-[#39A900]"
          />
          <button
            onClick={handleSelectPhotoClick}
            className="absolute bottom-0 right-0 bg-[#39A900] text-white rounded-full p-2 shadow hover:bg-[#2D8C00] focus:outline-none"
            title="Cambiar foto"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
            </svg>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        {selectedFile && (
          <button
            onClick={handleUploadPhoto}
            className="mt-2 bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-1 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? 'Actualizando...' : 'Actualizar foto'}
          </button>
        )}
      </div>
      {error && (
        <div className="bg-orange-100 border border-[#FF6600] text-[#FF6600] px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-[#39A900] text-[#39A900] px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            disabled={!editing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            disabled={!editing}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Carnet RFID</label>
          <input
            type="text"
            name="carnetRfid"
            value={formData.carnetRfid}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#39A900]"
            disabled={!editing}
          />
        </div>
        <div className="flex justify-end space-x-2">
          {editing ? (
            <>
              <button
                type="button"
                onClick={toggleEdit}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleEdit}
              className="bg-[#39A900] hover:bg-[#2D8C00] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Editar perfil
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 