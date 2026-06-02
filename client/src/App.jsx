import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home          from './pages/Home.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';
import Dashboard     from './pages/Dashboard.jsx';
import Doctors       from './pages/Doctors.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Appointments  from './pages/Appointments.jsx';
import History       from './pages/History.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/register"  element={<Register />} />

          <Route path="/dashboard"   element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/doctors"     element={<Doctors />} />
          <Route path="/book/:doctorId" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments"   element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/history"        element={<ProtectedRoute><History /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
