import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  deleteDoc,
  updateDoc,
  serverTimestamp,
  limit,
  setDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  deleteUser
} from 'firebase/auth';

const USUARIOS_COLLECTION = 'usuarios';
const EQUIPOS_COLLECTION = 'equipos';
const ASISTENCIAS_COLLECTION = 'asistencias';
const ADMIN_COLLECTION = 'admins';

// Verificar si el usuario es administrador
export async function esAdministrador(uid) {
  try {
    const adminRef = doc(db, ADMIN_COLLECTION, uid);
    const adminDoc = await getDoc(adminRef);
    return adminDoc.exists();
  } catch (error) {
    console.error("Error al verificar si es administrador:", error);
    return false;
  }
}

// Crear cuenta de administrador (solo otro admin puede hacer esto)
export async function crearAdministrador(email, password, nombre, apellido) {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar el perfil del usuario
    await updateProfile(user, {
      displayName: `${nombre} ${apellido}`
    });
    
    // Guardar en la colección de admins
    const adminRef = doc(db, ADMIN_COLLECTION, user.uid);
    await updateDoc(adminRef, {
      uid: user.uid,
      email,
      nombre,
      apellido,
      fechaCreacion: serverTimestamp(),
      activo: true
    });
    
    return user;
  } catch (error) {
    console.error("Error al crear administrador:", error);
    throw error;
  }
}

// Obtener todos los usuarios (solo admins)
export async function obtenerTodosLosUsuarios() {
  try {
    const usuariosCollection = collection(db, USUARIOS_COLLECTION);
    const snapshot = await getDocs(usuariosCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al obtener todos los usuarios:", error);
    throw error;
  }
}

// Eliminar un usuario (solo admins)
export async function eliminarUsuario(uid) {
  try {
    // Eliminar de Firestore
    const usuarioRef = doc(db, USUARIOS_COLLECTION, uid);
    await deleteDoc(usuarioRef);
    
    // También eliminar de Firebase Auth si es posible
    try {
      await deleteUser(auth.currentUser);
    } catch (authError) {
      console.warn("No se pudo eliminar el usuario de Auth:", authError);
      // Esto puede ocurrir si no es el usuario actual
    }
    
    return uid;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
}

// Obtener estadísticas de asistencia
export async function obtenerEstadisticasAsistencia() {
  try {
    const asistenciasCollection = collection(db, ASISTENCIAS_COLLECTION);
    const q = query(asistenciasCollection, orderBy("fecha", "desc"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return {
        total: 0,
        entradas: 0,
        salidas: 0,
        porUsuario: {}
      };
    }
    
    const asistencias = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        fecha: data.fecha || null 
      };
    });
    
    // Calcular estadísticas
    const total = asistencias.length;
    const entradas = asistencias.filter(a => a.tipo === 'entrada').length;
    const salidas = asistencias.filter(a => a.tipo === 'salida').length;
    
    // Agrupar por usuario
    const usuariosAsistencia = {};
    asistencias.forEach(asistencia => {
      if (!asistencia.usuarioId) return;
      
      if (!usuariosAsistencia[asistencia.usuarioId]) {
        usuariosAsistencia[asistencia.usuarioId] = {
          entradas: 0,
          salidas: 0,
          total: 0
        };
      }
      
      usuariosAsistencia[asistencia.usuarioId].total++;
      if (asistencia.tipo === 'entrada') {
        usuariosAsistencia[asistencia.usuarioId].entradas++;
      } else if (asistencia.tipo === 'salida') {
        usuariosAsistencia[asistencia.usuarioId].salidas++;
      }
    });
    
    return {
      total,
      entradas,
      salidas,
      porUsuario: usuariosAsistencia
    };
  } catch (error) {
    console.error("Error al obtener estadísticas de asistencia:", error);
    throw new Error("Error al obtener estadísticas de asistencia: " + error.message);
  }
}

// Obtener estadísticas de equipos
export async function obtenerEstadisticasEquipos() {
  try {
    const equiposCollection = collection(db, EQUIPOS_COLLECTION);
    const snapshot = await getDocs(equiposCollection);
    const equipos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Calcular estadísticas
    const total = equipos.length;
    
    // Agrupar por tipo
    const porTipo = {};
    equipos.forEach(equipo => {
      const tipo = equipo.tipo || 'otro';
      if (!porTipo[tipo]) {
        porTipo[tipo] = 0;
      }
      porTipo[tipo]++;
    });
    
    // Agrupar por marca
    const porMarca = {};
    equipos.forEach(equipo => {
      const marca = equipo.marca || 'desconocida';
      if (!porMarca[marca]) {
        porMarca[marca] = 0;
      }
      porMarca[marca]++;
    });
    
    // Agrupar por usuario
    const porUsuario = {};
    equipos.forEach(equipo => {
      const usuarioId = equipo.usuarioId || 'desconocido';
      if (!porUsuario[usuarioId]) {
        porUsuario[usuarioId] = 0;
      }
      porUsuario[usuarioId]++;
    });
    
    return {
      total,
      porTipo,
      porMarca,
      porUsuario
    };
  } catch (error) {
    console.error("Error al obtener estadísticas de equipos:", error);
    throw error;
  }
}

// Obtener los últimos registros de asistencia
export async function obtenerUltimosRegistrosAsistencia(cantidad = 10) {
  try {
    const asistenciasCollection = collection(db, ASISTENCIAS_COLLECTION);
    
    // Crear la consulta ordenada por fecha
    const q = query(
      asistenciasCollection,
      orderBy("fecha", "desc"),
      limit(cantidad)
    );
    
    const snapshot = await getDocs(q);
    
    // Comprobar si hay documentos
    if (snapshot.empty) {
      return [];
    }
    
    // Mapear datos con manejo seguro de fecha
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        fecha: data.fecha || null
      };
    });
  } catch (error) {
    console.error("Error al obtener últimos registros de asistencia:", error);
    throw new Error("Error al obtener últimos registros de asistencia: " + error.message);
  }
}

// Inicializar administrador por defecto (solo se debe llamar una vez al configurar la aplicación)
export async function inicializarAdminPorDefecto(email, password) {
  try {
    // Comprobar si ya existe un admin
    const adminsCollection = collection(db, ADMIN_COLLECTION);
    const snapshot = await getDocs(adminsCollection);
    
    if (!snapshot.empty) {
      console.log("Ya existe al menos un administrador");
      return null;
    }
    
    // Crear el admin por defecto
    return await crearAdministrador(email, password, "Admin", "Principal");
  } catch (error) {
    console.error("Error al inicializar admin por defecto:", error);
    throw error;
  }
}

// Obtener estadísticas para el dashboard del administrador
export async function obtenerEstadisticasDashboard() {
  try {
    // Estadísticas de usuarios
    const usuariosCollection = collection(db, USUARIOS_COLLECTION);
    const usuariosSnapshot = await getDocs(usuariosCollection);
    const usuarios = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const usuariosStats = {
      total: usuarios.length,
      aprendices: usuarios.filter(u => u.tipo === 'Aprendiz').length,
      instructores: usuarios.filter(u => u.tipo === 'Instructor').length,
      admins: usuarios.filter(u => u.tipo === 'admin').length,
      activos: usuarios.filter(u => u.activo).length,
      inactivos: usuarios.filter(u => !u.activo).length
    };

    // Estadísticas de asistencia
    const asistenciasStats = await obtenerEstadisticasAsistencia();

    // Estadísticas de equipos
    const equiposCollection = collection(db, EQUIPOS_COLLECTION);
    const equiposSnapshot = await getDocs(equiposCollection);
    const equipos = equiposSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const equiposStats = {
      total: equipos.length,
      activos: equipos.filter(e => e.estado === 'activo').length,
      inactivos: equipos.filter(e => e.estado !== 'activo').length,
      porTipo: {}
    };

    // Agrupar equipos por tipo
    equipos.forEach(equipo => {
      const tipo = equipo.tipo || 'Otro';
      if (!equiposStats.porTipo[tipo]) {
        equiposStats.porTipo[tipo] = 0;
      }
      equiposStats.porTipo[tipo]++;
    });

    return {
      usuarios: usuariosStats,
      asistencias: asistenciasStats,
      equipos: equiposStats
    };
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error);
    throw error;
  }
}

// Actualizar el rol de un usuario
export async function actualizarRolUsuario(userId, nuevoRol) {
  try {
    // Si el nuevo rol es 'admin', añadir al usuario a la colección de admins
    if (nuevoRol === 'admin') {
      const adminRef = doc(db, ADMIN_COLLECTION, userId);
      const adminDoc = await getDoc(adminRef);
      
      if (!adminDoc.exists()) {
        await setDoc(adminRef, { 
          admin: true,
          fechaAsignacion: serverTimestamp()
        });
      }
    } else {
      // Si el usuario era admin y ahora no lo es, eliminar de la colección de admins
      const adminRef = doc(db, ADMIN_COLLECTION, userId);
      const adminDoc = await getDoc(adminRef);
      
      if (adminDoc.exists()) {
        await deleteDoc(adminRef);
      }
    }
    
    // Actualizar el rol en la colección de usuarios
    const userRef = doc(db, USUARIOS_COLLECTION, userId);
    await updateDoc(userRef, { 
      tipo: nuevoRol,
      fechaActualizacion: serverTimestamp()
    });
    
    return { id: userId, tipo: nuevoRol };
  } catch (error) {
    console.error("Error al actualizar rol de usuario:", error);
    throw error;
  }
}

// Buscar usuarios por término
export async function buscarUsuarios(termino) {
  try {
    const usuariosCollection = collection(db, USUARIOS_COLLECTION);
    const snapshot = await getDocs(usuariosCollection);
    const usuarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filtrar usuarios que coincidan con el término en nombre, apellido o email
    const terminoLower = termino.toLowerCase();
    return usuarios.filter(usuario => 
      usuario.nombre?.toLowerCase().includes(terminoLower) ||
      usuario.apellido?.toLowerCase().includes(terminoLower) ||
      usuario.email?.toLowerCase().includes(terminoLower) ||
      usuario.carnetRfid?.includes(termino)
    );
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    throw error;
  }
}

// Obtener estadísticas personalizadas para el dashboard según el rol
export async function obtenerEstadisticasPersonalizadas(usuarioId, userRole) {
  try {
    let statsData = {};
    
    // Estadísticas básicas comunes
    const dashboard = await obtenerEstadisticasDashboard();
    statsData = { ...dashboard };
    
    // Estadísticas personalizadas para aprendices
    if (userRole === 'Aprendiz' && usuarioId) {
      // Obtener asistencias del usuario
      const asistenciasCollection = collection(db, ASISTENCIAS_COLLECTION);
      
      // Modificamos la consulta para evitar el error de índice compuesto
      const q = query(
        asistenciasCollection,
        where("usuarioId", "==", usuarioId)
      );
      
      const snapshot = await getDocs(q);
      const asistencias = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        fecha: doc.data().fecha || null
      }));
      
      // Ordenar manualmente en el cliente
      asistencias.sort((a, b) => {
        if (!a.fecha) return 1;
        if (!b.fecha) return -1;
        
        if (a.fecha.seconds && b.fecha.seconds) {
          return b.fecha.seconds - a.fecha.seconds;
        }
        
        return 0;
      });
      
      // Calcular estadísticas personales
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const inicioSemana = new Date(ahora);
      inicioSemana.setDate(ahora.getDate() - ahora.getDay());
      
      const totalAsistencias = asistencias.length;
      const asistenciasMes = asistencias.filter(a => {
        if (!a.fecha || !a.fecha.seconds) return false;
        const fechaAsistencia = new Date(a.fecha.seconds * 1000);
        return fechaAsistencia >= inicioMes;
      }).length;
      
      const asistenciasSemana = asistencias.filter(a => {
        if (!a.fecha || !a.fecha.seconds) return false;
        const fechaAsistencia = new Date(a.fecha.seconds * 1000);
        return fechaAsistencia >= inicioSemana;
      }).length;
      
      // Obtener equipo del aprendiz
      const equiposCollection = collection(db, EQUIPOS_COLLECTION);
      const qEquipo = query(
        equiposCollection,
        where("usuarioId", "==", usuarioId)
      );
      
      const snapshotEquipo = await getDocs(qEquipo);
      const miEquipo = snapshotEquipo.empty ? null : {
        id: snapshotEquipo.docs[0].id,
        ...snapshotEquipo.docs[0].data()
      };
      
      // Añadir estadísticas personales
      statsData.misAsistencias = {
        total: totalAsistencias,
        mes: asistenciasMes,
        semana: asistenciasSemana
      };
      
      statsData.miEquipo = miEquipo;
    }
    
    // Estadísticas personalizadas para instructores
    if (userRole === 'Instructor') {
      // Añadir conteo de aprendices presentes hoy
      const asistenciasCollection = collection(db, ASISTENCIAS_COLLECTION);
      
      // Obtener inicio del día actual
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const hoyTimestamp = new Date(hoy).getTime() / 1000;
      
      // Consultar asistencias de hoy
      const qHoy = query(
        asistenciasCollection,
        where("fecha", ">=", hoyTimestamp)
      );
      
      const snapshotHoy = await getDocs(qHoy);
      const asistenciasHoy = snapshotHoy.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // Obtener aprendices presentes actualmente
      const aprendicesPresentes = new Set();
      
      asistenciasHoy.forEach(asistencia => {
        if (asistencia.tipo === 'entrada') {
          aprendicesPresentes.add(asistencia.usuarioId);
        } else if (asistencia.tipo === 'salida') {
          aprendicesPresentes.delete(asistencia.usuarioId);
        }
      });
      
      statsData.aprendicesPresentes = aprendicesPresentes.size;
    }
    
    return statsData;
  } catch (error) {
    console.error("Error al obtener estadísticas personalizadas:", error);
    throw new Error("Error al obtener estadísticas personalizadas: " + error.message);
  }
} 