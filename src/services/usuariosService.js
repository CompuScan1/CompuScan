import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const USUARIOS_COLLECTION = 'usuarios';
const usuariosCollection = collection(db, USUARIOS_COLLECTION);

// Crear un nuevo usuario en la base de datos
export const crearUsuario = async (userData) => {
  try {
    const { uid } = userData;
    
    if (!uid) {
      throw new Error('Se requiere el ID de usuario (uid)');
    }
    
    const userRef = doc(db, USUARIOS_COLLECTION, uid);
    
    await setDoc(userRef, {
      ...userData,
      fechaRegistro: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
      activo: true
    });
    
    return { id: uid, ...userData };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Verificar si un correo electrónico ya existe
async function verificarCorreoExistente(email) {
  try {
    const q = query(usuariosCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error al verificar correo electrónico:", error);
    throw error;
  }
}

// Verificar si un carnet RFID ya existe
async function verificarRfidExistente(carnetRfid) {
  try {
    const q = query(usuariosCollection, where("carnetRfid", "==", carnetRfid));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error al verificar RFID:", error);
    throw error;
  }
}

// Obtener todos los usuarios
export async function obtenerUsuarios() {
  try {
    const snapshot = await getDocs(usuariosCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
}

// Obtener un usuario por su ID
export const obtenerUsuarioPorId = async (uid) => {
  try {
    const userRef = doc(db, USUARIOS_COLLECTION, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    return { id: uid, ...userDoc.data() };
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    throw error;
  }
};

// Obtener usuario por RFID
export const obtenerUsuarioPorRfid = async (rfid) => {
  try {
    if (!rfid) {
      throw new Error('Se requiere el ID de RFID');
    }
    
    const q = query(
      collection(db, USUARIOS_COLLECTION),
      where("carnetRfid", "==", rfid)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('No se encontró ningún usuario con ese RFID');
    }
    
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error("Error al obtener usuario por RFID:", error);
    throw error;
  }
};

// Actualizar datos de un usuario
export const actualizarUsuario = async (uid, userData) => {
  try {
    const userRef = doc(db, USUARIOS_COLLECTION, uid);
    
    // Verificar si el usuario existe
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
    
    // Actualizar los datos
    await updateDoc(userRef, {
      ...userData,
      fechaActualizacion: serverTimestamp()
    });
    
    return { id: uid, ...userData };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Buscar usuarios por nombre, apellido o email
export const buscarUsuarios = async (termino) => {
  try {
    // Traer todos los usuarios (esto no es eficiente, pero Firestore no soporta
    // búsquedas de texto completo ni consultas OR con diferentes campos fácilmente)
    const usuariosCollection = collection(db, USUARIOS_COLLECTION);
    const querySnapshot = await getDocs(usuariosCollection);
    
    if (querySnapshot.empty) {
      return [];
    }
    
    // Filtrar en el cliente
    const terminoLower = termino.toLowerCase();
    const resultados = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(user => 
        (user.nombre && user.nombre.toLowerCase().includes(terminoLower)) ||
        (user.apellido && user.apellido.toLowerCase().includes(terminoLower)) ||
        (user.email && user.email.toLowerCase().includes(terminoLower)) ||
        (user.carnetRfid && user.carnetRfid.includes(termino))
      );
    
    return resultados;
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
};

// Obtener todos los usuarios
export const obtenerTodosLosUsuarios = async () => {
  try {
    const usuariosCollection = collection(db, USUARIOS_COLLECTION);
    const querySnapshot = await getDocs(usuariosCollection);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
};

// Obtener datos del perfil del usuario actual y sus estadísticas
export const obtenerPerfilCompleto = async (uid) => {
  try {
    const userData = await obtenerUsuarioPorId(uid);
    
    // Aquí podrías agregar estadísticas adicionales del usuario
    // como número de asistencias, equipos asignados, etc.
    
    return userData;
  } catch (error) {
    console.error("Error al obtener perfil completo:", error);
    throw error;
  }
};

// Eliminar un usuario
export async function eliminarUsuario(id) {
  try {
    const usuarioRef = doc(db, USUARIOS_COLLECTION, id);
    await deleteDoc(usuarioRef);
    return id;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

// Alias para mantener compatibilidad con componentes existentes
export const buscarUsuarioPorRfid = obtenerUsuarioPorRfid;

// Subir foto de perfil
export const subirFotoPerfil = async (uid, file) => {
  try {
    if (!uid) {
      throw new Error('Se requiere el ID de usuario (uid)');
    }
    
    if (!file) {
      throw new Error('Se requiere un archivo para subir');
    }
    
    // Verificar que sea una imagen válida
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }
    
    // Obtener extensión y estandarizarla
    let fileExt = file.name.split('.').pop().toLowerCase();
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      fileExt = 'jpg';
    } else if (file.type === 'image/png') {
      fileExt = 'png';
    } else if (file.type === 'image/gif') {
      fileExt = 'gif';
    } else if (file.type === 'image/webp') {
      fileExt = 'webp';
    }
    
    // Crear referencia con un nombre único para la imagen
    const fileName = `perfiles/${uid}/foto_${Date.now()}.${fileExt}`;
    const storageRef = ref(storage, fileName);
    
    // Configurar metadata
    const metadata = {
      contentType: file.type
    };
    
    // Subir la imagen
    await uploadBytes(storageRef, file, metadata);
    
    // Obtener la URL de la imagen
    const photoURL = await getDownloadURL(storageRef);
    
    // Actualizar el perfil del usuario con la URL de la foto
    const userRef = doc(db, USUARIOS_COLLECTION, uid);
    await updateDoc(userRef, {
      photoURL,
      fechaActualizacion: serverTimestamp()
    });
    
    return photoURL;
  } catch (error) {
    console.error("Error al subir foto de perfil:", error);
    throw error;
  }
};

// Eliminar foto de perfil anterior
export const eliminarFotoPerfilAnterior = async (photoURL) => {
  if (!photoURL || !photoURL.includes('firebasestorage')) return;
  
  try {
    // Extraer la ruta de la URL
    const path = photoURL.match(/o\/(.+?)\?/);
    if (path && path[1]) {
      const decodedPath = decodeURIComponent(path[1]);
      const storageRef = ref(storage, decodedPath);
      await deleteObject(storageRef);
    }
  } catch (error) {
    console.error("Error al eliminar la foto anterior:", error);
    // No lanzamos el error para no interrumpir el flujo principal
  }
}; 