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
    <DashboardLayout>
      <Routes>
        {/* Ruta protegida del dashboard - Overview */}
        <Route 
          path="/dashboard/overview" 
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta protegida del dashboard - Market Trends */}
        <Route
          path="/dashboard/market-trends"
          element={
            <PrivateRoute>
              <TrendsPage />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida del dashboard - Yerbas */}
        <Route
          path="/dashboard/yerbas"
          element={
            <PrivateRoute>
              <YerbasPage />
            </PrivateRoute>
          }
        />

        {/* Ruta protegida del dashboard - Notes */}
        <Route
          path="/dashboard/notes"
          element={
            <PrivateRoute>
              <NotesPage />
            </PrivateRoute>
          }
        />

        {/* Ruta por defecto redirige al dashboard overview */}
        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
