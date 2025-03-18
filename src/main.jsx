import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { inicializarAdminPorDefecto } from './services/adminService';

// Inicializar el administrador por defecto
// Utilizamos un email y contraseña predeterminados
// Estas credenciales deberían ser almacenadas de forma segura en variables de entorno en un entorno de producción
const ADMIN_EMAIL = 'admin@compuscan.com';
const ADMIN_PASSWORD = 'Admin123!';

// Inicializar admin en segundo plano
inicializarAdminPorDefecto(ADMIN_EMAIL, ADMIN_PASSWORD)
  .then(() => console.log('Verificación de admin por defecto completada'))
  .catch(error => console.error('Error al inicializar admin:', error));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
