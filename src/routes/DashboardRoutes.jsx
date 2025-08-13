// src/routes/DashboardRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import de componentes del dashboard
import OverviewPage from '../dashboard/Overview/OverviewPage.jsx';
import TrendsPage from '../dashboard/Trends/TrendsPage.jsx';

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
      {/* Ruta protegida del dashboard */}
      <Route 
        path="/dashboard/overview" 
        element={
          <PrivateRoute>
            <OverviewPage />
          </PrivateRoute>
        } 
      />
      
      {/* Ruta por defecto redirige al dashboard overview */}
      <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
      <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
      
      {/* Futuras rutas protegidas del dashboard */}
      <Route 
        path="/dashboard/market-trends" 
        element={
          <PrivateRoute>
            <TrendsPage />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/flavors" 
        element={
          <PrivateRoute>
            <div>Flavor Analysis - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/brands" 
        element={
          <PrivateRoute>
            <div>Brand Comparison - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/discovery" 
        element={
          <PrivateRoute>
            <div>Discovery vs Fidelity - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/geography" 
        element={
          <PrivateRoute>
            <div>Geography Analysis - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/audience" 
        element={
          <PrivateRoute>
            <div>Audience Analysis - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/dashboard/alerts" 
        element={
          <PrivateRoute>
            <div>Alerts & Experiments - Coming Soon</div>
          </PrivateRoute>
        } 
      />
      
      {/* Ruta 404 redirige al dashboard */}
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
