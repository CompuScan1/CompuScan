import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  limit
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { obtenerUsuarioPorRfid } from './usuariosService';

const COLLECTION_NAME = 'asistencias';
const asistenciasCollection = collection(db, COLLECTION_NAME);

// Registrar entrada
export async function registrarEntrada(usuarioId, carnetRfid) {
  try {
    if (!usuarioId) {
      throw new Error("ID de usuario no proporcionado");
    }
    
    if (!carnetRfid) {
      throw new Error("Carnet RFID no proporcionado");
    }
    
    // Verificar que el RFID pertenezca al usuario
    const usuarioRfid = await obtenerUsuarioPorRfid(carnetRfid);
    if (!usuarioRfid || usuarioRfid.id !== usuarioId) {
      throw new Error("Este carnet RFID no pertenece a tu usuario. No puedes registrar asistencia con un carnet ajeno.");
    }
    
    const nuevaAsistencia = {
      usuarioId,
      carnetRfid,
      tipo: 'entrada',
      fecha: serverTimestamp(),
      estado: 'activo'
    };
    
    const docRef = await addDoc(asistenciasCollection, nuevaAsistencia);
    return { id: docRef.id, ...nuevaAsistencia };
  } catch (error) {
    console.error("Error al registrar entrada:", error);
    throw new Error("Error al registrar entrada: " + error.message);
  }
}

// Registrar salida
export async function registrarSalida(usuarioId, carnetRfid) {
  try {
    if (!usuarioId) {
      throw new Error("ID de usuario no proporcionado");
    }
    
    if (!carnetRfid) {
      throw new Error("Carnet RFID no proporcionado");
    }
    
    // Verificar que el RFID pertenezca al usuario
    const usuarioRfid = await obtenerUsuarioPorRfid(carnetRfid);
    if (!usuarioRfid || usuarioRfid.id !== usuarioId) {
      throw new Error("Este carnet RFID no pertenece a tu usuario. No puedes registrar asistencia con un carnet ajeno.");
    }
    
    const nuevaAsistencia = {
      usuarioId,
      carnetRfid,
      tipo: 'salida',
      fecha: serverTimestamp(),
      estado: 'inactivo'
    };
    
    const docRef = await addDoc(asistenciasCollection, nuevaAsistencia);
    return { id: docRef.id, ...nuevaAsistencia };
  } catch (error) {
    console.error("Error al registrar salida:", error);
    throw new Error("Error al registrar salida: " + error.message);
  }
}

// Obtener asistencias por usuario
export async function obtenerAsistenciasPorUsuario(usuarioId) {
  try {
    if (!usuarioId) {
      throw new Error("ID de usuario no proporcionado");
    }
    
    // Modificamos la consulta para evitar el error de índice compuesto
    // Opción 1: Usar una consulta simple sin orderBy para evitar necesitar un índice compuesto
    const q = query(
      asistenciasCollection, 
      where("usuarioId", "==", usuarioId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    
    // Obtenemos los resultados y los ordenamos en el cliente
    let resultados = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        // Asegurar que las fechas son manejadas correctamente
        fecha: data.fecha || null
      };
    });
    
    // Ordenar los resultados por fecha descendente en el cliente
    resultados.sort((a, b) => {
      // Si no hay fecha en alguno de los registros, ponerlo al final
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      
      // Comparar timestamps
      if (a.fecha.seconds && b.fecha.seconds) {
        return b.fecha.seconds - a.fecha.seconds;
      }
      
      return 0;
    });
    
    return resultados;
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    throw new Error("Error al cargar las asistencias. Por favor, intenta de nuevo más tarde.");
  }
}

// Obtener asistencia por ID
export async function obtenerAsistenciaPorId(id) {
  try {
    if (!id) {
      throw new Error("ID de asistencia no proporcionado");
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        fecha: data.fecha || null
      };
    } else {
      throw new Error("La asistencia no existe");
    }
  } catch (error) {
    console.error("Error al obtener asistencia:", error);
    throw new Error("Error al obtener asistencia: " + error.message);
  }
}

// Obtener asistencias por fecha
export async function obtenerAsistenciasPorFecha(fechaInicio, fechaFin) {
  try {
    let q;
    
    // Si ambas fechas están definidas, filtrar por rango
    if (fechaInicio && fechaFin) {
      // Convertir fechas a timestamps para Firestore si son objetos Date
      const startDate = fechaInicio instanceof Date ? Timestamp.fromDate(fechaInicio) : fechaInicio;
      const endDate = fechaFin instanceof Date ? Timestamp.fromDate(fechaFin) : fechaFin;
      
      q = query(
        asistenciasCollection,
        where("fecha", ">=", startDate),
        where("fecha", "<=", endDate),
        orderBy("fecha", "desc")
      );
    } else {
      // Si no hay fechas, obtener todos ordenados por fecha
      q = query(
        asistenciasCollection,
        orderBy("fecha", "desc"),
        limit(50) // Limitar para evitar cargas grandes
      );
    }
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return [];
    }
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        fecha: data.fecha || null
      };
    });
  } catch (error) {
    console.error("Error al obtener asistencias por fecha:", error);
    throw new Error("Error al obtener asistencias por fecha: " + error.message);
  }
}

// Verificar última asistencia del usuario
export async function verificarUltimaAsistencia(usuarioId) {
  try {
    if (!usuarioId) {
      throw new Error("ID de usuario no proporcionado");
    }
    
    const q = query(
      asistenciasCollection,
      where("usuarioId", "==", usuarioId),
      orderBy("fecha", "desc"),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    } else {
      const ultimaAsistencia = snapshot.docs[0];
      const data = ultimaAsistencia.data();
      return { 
        id: ultimaAsistencia.id, 
        ...data,
        fecha: data.fecha || null
      };
    }
  } catch (error) {
    console.error("Error al verificar última asistencia:", error);
    throw new Error("Error al verificar última asistencia: " + error.message);
  }
} 