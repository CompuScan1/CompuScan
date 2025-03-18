# CompuScan

Sistema de registro y control de equipos y asistencia mediante tecnología RFID.

## Descripción

CompuScan es una aplicación web desarrollada con React y Firebase que permite gestionar el registro de equipos informáticos y el control de asistencia utilizando tecnología RFID. La aplicación está diseñada para ser utilizada en instituciones educativas donde se requiere controlar el acceso e computación y el uso de equipos.

## Características principales

- **Autenticación de usuarios**: Sistema de registro e inicio de sesión con email/contraseña y con Google.
- **Roles de usuario**: Tres roles diferentes (Aprendiz, Instructor y Administrador) con diferentes niveles de acceso.
- **Gestión de equipos**: Registro y control de equipos informáticos, incluyendo tipo, marca y especificaciones.
- **Control de asistencia**: Registro de entradas y salidas mediante tecnología RFID.
- **Panel de administración**: Para la gestión de usuarios y visualización de estadísticas.
- **Interfaz responsive**: Diseñada para funcionar en dispositivos móviles y de escritorio.

## Tecnologías utilizadas

- **Frontend**: 

Framework: La aplicación está construida utilizando React, 
Routing: Se utiliza React Router para manejar la navegación entre diferentes páginas de la aplicación, como inicio, login, registro, gestión de equipos y asistencia.
Estilos: Se emplea Tailwind CSS para el diseño y la estilización de la interfaz, lo que permite un diseño responsivo y moderno.
Componentes: La aplicación está estructurada en componentes reutilizables, como formularios de inicio de sesión, registro, y gestión de asistencia y equipos



- **Backend**: Firebase (Authentication, Firestore)
En el proyecto CompuScan, se utilizan varias APIs y servicios para manejar la autenticación, la base de datos y la gestión de usuarios y equipos. A continuación, se detallan las principales APIs y servicios utilizados:
La aplicación utiliza Firebase como su backend, que proporciona servicios de autenticación, base de datos y almacenamiento.

### 1. **Firebase Authentication**
   - **API**: `firebase/auth`
   - **Funciones utilizadas**:
     - `createUserWithEmailAndPassword`: Para registrar usuarios con email y contraseña.
     - `signInWithEmailAndPassword`: Para iniciar sesión con email y contraseña.
     - `signOut`: Para cerrar sesión.
     - `GoogleAuthProvider`: Para la autenticación con Google.
     - `signInWithPopup`: Para iniciar sesión mediante un popup de Google.

### 2. **Firestore (Base de Datos)**
   - **API**: `firebase/firestore`
   - **Funciones utilizadas**:
     - `collection`: Para obtener una referencia a una colección en Firestore.
     - `addDoc`: Para agregar un nuevo documento a una colección.
     - `getDocs`: Para obtener todos los documentos de una colección.
     - `getDoc`: Para obtener un documento específico por su ID.
     - `updateDoc`: Para actualizar un documento existente.
     - `deleteDoc`: Para eliminar un documento.
     - `query`: Para crear consultas a la base de datos.
     - `where`: Para filtrar documentos en una consulta.
     - `orderBy`: Para ordenar los resultados de una consulta.
     - `serverTimestamp`: Para obtener la marca de tiempo del servidor.

### 3. **Servicios Personalizados**
   - **Usuarios**: 
     - `crearUsuario`: Para crear un nuevo usuario en Firestore.
     - `obtenerUsuarios`: Para obtener todos los usuarios registrados.
     - `buscarUsuarioPorRfid`: Para buscar un usuario por su carnet RFID.
     - `eliminarUsuario`: Para eliminar un usuario de la base de datos.
   - **Equipos**:
     - `crearEquipo`: Para registrar un nuevo equipo en Firestore.
     - `obtenerEquipos`: Para obtener todos los equipos registrados.
     - `eliminarEquipo`: Para eliminar un equipo de la base de datos.
   - **Asistencia**:
     - `registrarEntrada`: Para registrar la entrada de un usuario.
     - `registrarSalida`: Para registrar la salida de un usuario.
     - `obtenerAsistenciasPorUsuario`: Para obtener el historial de asistencias de un usuario.

### 4. **Otras APIs**
   - **React Router**: 
     - `react-router-dom`: Para manejar la navegación entre diferentes páginas de la aplicación.
     - Funciones como `BrowserRouter`, `Routes`, `Route`, y `Navigate` son utilizadas para definir las rutas de la aplicación.


- **Base de datos**: Firestore noSql - No relacionales

- **Bundler**: Vite

## Requisitos previos

- Node.js (v16.0.0 o superior)
- npm o yarn
- Una cuenta en Firebase

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tuusuario/compuscan.git
cd compuscan
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en la raíz del proyecto con las credenciales de Firebase:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

4. Iniciar el servidor de desarrollo:
```bash 
npm run dev
```
```npm run build: Para compilar la aplicación para producción.


## Estructura de la aplicación

- **src/components**: Componentes reutilizables de React
- **src/context**: Contextos para manejar el estado de la aplicación
- **src/firebase**: Configuración y servicios de Firebase
- **src/pages**: Páginas/rutas principales de la aplicación
- **src/services**: Servicios para interactuar con la base de datos
- **src/assets**: Imágenes, iconos y otros recursos estáticos

## Roles de usuario

### Aprendiz
- Registrar su asistencia mediante RFID
- Registrar su equipo informático
- Ver su historial de asistencias

### Instructor
- Todas las funcionalidades del Aprendiz
- Ver listado de equipos a su cargo
- Gestionar asistencias de los aprendices

### Administrador
- Acceso al panel de administración
- Gestión de usuarios (visualización y eliminación)
- Ver estadísticas de asistencia y equipos
- Acceso a todas las funcionalidades del sistema

## Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication (Email/Password y Google)
3. Crear una base de datos Firestore
4. Configurar las reglas de seguridad en Firestore:

``` Version de Base de Datos
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usuarios/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.admin == true);
    }
    match /equipos/{equipoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /asistencia/{asistenciaId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /admins/{adminId} {
      allow read: if request.auth != null && request.auth.uid == adminId;
      allow write: if false;
    }
  }
}
```

5. Habilitar el método de inicio de sesión con Google en Firebase Authentication

## Cuenta de administrador

Al iniciar la aplicación por primera vez, se crea automáticamente una cuenta de administrador con las siguientes credenciales:

- Email: admin@compuscan.com
- Contraseña: Admin123!

Es altamente recomendable cambiar esta contraseña después del primer inicio de sesión.

## Funcionalidades principales

### Registro de usuarios
- Registro por email/contraseña
- Registro mediante cuenta de Google (rol "Aprendiz" por defecto)
- Selección de rol (Aprendiz o Instructor) durante el registro manual

### Gestión de equipos
- Registro de equipos con información detallada
- Asociación de equipos a usuarios
- Visualización de listado de equipos

### Control de asistencia
- Registro de entrada y salida mediante RFID
- Historial de asistencias
- Estadísticas de asistencia en el panel de administrador

### Panel de administración
- Gestión de usuarios (visualización y eliminación)
- Estadísticas de asistencia
- Estadísticas de uso de equipos



