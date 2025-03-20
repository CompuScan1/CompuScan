import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { crearUsuario } from '../services/usuariosService';
import { esAdministrador } from '../services/adminService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('Aprendiz');  // Valor predeterminado es Aprendiz
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // Registrar usuario con email y contraseña
  async function signup(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Obtener el token
      const token = await userCredential.user.getIdToken();
      // Guardar el token en sessionStorage
      sessionStorage.setItem('authToken', token);
      return userCredential;
    } catch (error) {
      console.error("Error en signup:", error);
      throw error;
    }
  }

  // Iniciar sesión con email y contraseña
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Obtener el token
      const token = await userCredential.user.getIdToken();
      // Guardar el token en sessionStorage
      sessionStorage.setItem('authToken', token);
      return userCredential;
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  // Iniciar sesión con Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Obtener el token
      const token = await user.getIdToken();
      // Guardar el token en sessionStorage
      sessionStorage.setItem('authToken', token);
      
      // Verificar si es un nuevo usuario
      if (result._tokenResponse?.isNewUser) {
        setIsNewUser(true);
        setPendingGoogleUser({
          uid: user.uid,
          nombre: user.displayName?.split(' ')?.[0] || '',
          apellido: user.displayName?.split(' ')?.[1] || '',
          email: user.email,
          photoURL: user.photoURL || null
        });
        
        // No creamos inmediatamente el usuario en Firestore
        // El componente padre deberá observar 'pendingGoogleUser' y mostrar el selector de rol
      } else {
        // Si no es un usuario nuevo, resetear los estados
        setIsNewUser(false);
        setPendingGoogleUser(null);
      }
      
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  }

  // Función para completar el registro de Google con el rol seleccionado
  async function completarRegistroGoogle(tipo) {
    try {
      if (!pendingGoogleUser) {
        throw new Error('No hay usuario pendiente de Google');
      }

      await crearUsuario({
        uid: pendingGoogleUser.uid,
        nombre: pendingGoogleUser.nombre,
        apellido: pendingGoogleUser.apellido,
        email: pendingGoogleUser.email,
        photoURL: pendingGoogleUser.photoURL,
        carnetRfid: null,
        tipo,
        activo: true
      });

      // Actualizar el rol localmente
      setUserRole(tipo);
      
      // Resetear el estado
      setPendingGoogleUser(null);
      setIsNewUser(false);
      
      return true;
    } catch (error) {
      console.error("Error al completar registro con Google:", error);
      throw error;
    }
  }

  // Cerrar sesión
  async function logout() {
    try {
      await signOut(auth);
      // Eliminar el token del sessionStorage
      sessionStorage.removeItem('authToken');
    } catch (error) {
      console.error("Error en logout:", error);
      throw error;
    }
  }

  // Actualizar perfil de usuario
  function updateUserProfile(user, data) {
    return updateProfile(user, data);
  }

  // Verificar si el usuario actual es administrador
  useEffect(() => {
    async function checkAdminStatus() {
      if (currentUser) {
        try {
          const isAdmin = await esAdministrador(currentUser.uid);
          if (isAdmin) {
            setUserRole('admin');
          } else {
            // Obtener el rol del usuario desde Firestore
            const docRef = doc(db, "usuarios", currentUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              setUserRole(docSnap.data().tipo || 'Aprendiz');  // Si no tiene tipo, asignar "Aprendiz"
            } else {
              setUserRole('Aprendiz');  // Si no existe el documento, asignar "Aprendiz"
            }
          }
        } catch (error) {
          console.error("Error al verificar estado de administrador:", error);
          setUserRole('Aprendiz');  // En caso de error, asignar "Aprendiz"
        }
      } else {
        setUserRole('Aprendiz');  // Si no hay usuario, asignar "Aprendiz"
      }
    }
    
    checkAdminStatus();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Actualizar el token cuando cambia el estado de autenticación
        const token = await user.getIdToken();
        sessionStorage.setItem('authToken', token);
      } else {
        // Eliminar el token si no hay usuario
        sessionStorage.removeItem('authToken');
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    pendingGoogleUser,
    isNewUser,
    completarRegistroGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 