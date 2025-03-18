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
  const [userRole, setUserRole] = useState(null);

  // Registrar usuario con email y contraseña
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  // Iniciar sesión con email y contraseña
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Iniciar sesión con Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar si es un nuevo usuario y guardar en Firestore
      if (result._tokenResponse?.isNewUser) {
        await crearUsuario({
          uid: user.uid,
          nombre: user.displayName?.split(' ')?.[0] || '',
          apellido: user.displayName?.split(' ')?.[1] || '',
          email: user.email,
          carnetRfid: null,
          tipo: 'Aprendiz',
          activo: true
        });
      }
      
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  }

  // Cerrar sesión
  function logout() {
    return signOut(auth);
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
              setUserRole(docSnap.data().tipo || null);
            } else {
              setUserRole(null);
            }
          }
        } catch (error) {
          console.error("Error al verificar estado de administrador:", error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    }
    
    checkAdminStatus();
  }, [currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 