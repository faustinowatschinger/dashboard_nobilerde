// src/routes/DashboardRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import del layout y componentes del dashboard
import DashboardLayout from '../components/DashboardLayout.jsx';
import ComingSoonPage from '../components/ComingSoonPage.jsx';
import OverviewPage from '../dashboard/Overview/OverviewPage.jsx';
import TrendsPage from '../dashboard/Trends/TrendsPage.jsx';
import YerbasPage from '../dashboard/Yerbas/YerbasPage.jsx';
import NotesPage from '../dashboard/Notes/NotesPage.jsx';
import LandingPage from '../landing/LandingPage.jsx';

// Componente PrivateRoute dummy (placeholder)
const PrivateRoute = ({ children }) => {
  // Por ahora asumimos que el usuario está logueado
  // TODO: Implementar lógica de autenticación real
  const isAuthenticated = true; // Placeholder - siempre true por ahora
  
  if (!isAuthenticated) {
    // Redirigir al login cuando se implemente autenticación
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const DashboardRoutes = () => {
  return (
    <Routes>
      {/* Landing page principal */}
      <Route path="/" element={<LandingPage />} />
      {/* Dashboard envuelto en layout */}
      <Route
        path="/dashboard/*"
        element={
          <DashboardLayout>
            <Routes>
              <Route path="overview" element={<PrivateRoute><OverviewPage /></PrivateRoute>} />
              <Route path="market-trends" element={<PrivateRoute><TrendsPage /></PrivateRoute>} />
              <Route path="yerbas" element={<PrivateRoute><YerbasPage /></PrivateRoute>} />
              <Route path="notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Routes>
          </DashboardLayout>
        }
      />
      {/* Fallback: cualquier otra ruta va a landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
