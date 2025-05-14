import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Asistencia from './pages/Asistencia';
import Equipos from './pages/Equipos';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow bg-background-paper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/equipos" element={<Equipos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
