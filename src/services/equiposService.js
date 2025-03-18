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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'equipos';
const equiposCollection = collection(db, COLLECTION_NAME);

// Crear un nuevo equipo
export async function crearEquipo(datosEquipo) {
  try {
    const nuevoEquipo = {
      ...datosEquipo,
      fechaRegistro: serverTimestamp(),
      fechaActualizacion: serverTimestamp()
    };
    
    const docRef = await addDoc(equiposCollection, nuevoEquipo);
    return { id: docRef.id, ...nuevoEquipo };
  } catch (error) {
    console.error("Error al crear equipo:", error);
    throw error;
  }
}

// Obtener todos los equipos
export async function obtenerEquipos() {
  try {
    const snapshot = await getDocs(equiposCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw error;
  }
}

// Obtener un equipo por ID
export async function obtenerEquipoPorId(id) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("El equipo no existe");
    }
  } catch (error) {
    console.error("Error al obtener equipo:", error);
    throw error;
  }
}

// Actualizar un equipo
export async function actualizarEquipo(id, datosEquipo) {
  try {
    const equipoRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(equipoRef, {
      ...datosEquipo,
      fechaActualizacion: serverTimestamp()
    });
    return { id, ...datosEquipo };
  } catch (error) {
    console.error("Error al actualizar equipo:", error);
    throw error;
  }
}

// Eliminar un equipo
export async function eliminarEquipo(id) {
  try {
    const equipoRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(equipoRef);
    return id;
  } catch (error) {
    console.error("Error al eliminar equipo:", error);
    throw error;
  }
}

// Buscar equipos por usuario
export async function buscarEquiposPorUsuario(userId) {
  try {
    const q = query(equiposCollection, where("usuarioId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al buscar equipos por usuario:", error);
    throw error;
  }
} 