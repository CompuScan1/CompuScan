import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Asistencia from './pages/Asistencia';
import Equipos from './pages/Equipos';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-gray-50">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rutas protegidas */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/asistencia" element={
                <ProtectedRoute>
                  <Asistencia />
                </ProtectedRoute>
              } />
              
              <Route path="/equipos" element={
                <ProtectedRoute>
                  <Equipos />
                </ProtectedRoute>
              } />
              
              <Route path="/perfil" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Rutas de administrador */}
              <Route path="/admin" element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              } />
              
              {/* Ruta por defecto - redirigir a home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
