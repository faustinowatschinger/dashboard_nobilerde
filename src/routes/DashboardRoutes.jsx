// src/routes/DashboardRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import del layout y componentes del dashboard
import DashboardLayout from '../components/DashboardLayout.jsx';
import ComingSoonPage from '../components/ComingSoonPage.jsx';
import OverviewPage from '../dashboard/Overview/OverviewPage.jsx';
import TrendsPage from '../dashboard/Trends/TrendsPage.jsx';
import YerbasPage from '../dashboard/Yerbas/YerbasPage.jsx';

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

        {/* Ruta por defecto redirige al dashboard overview */}
        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/overview" replace />} />
        
        {/* Futuras rutas protegidas del dashboard */}
        <Route 
          path="/dashboard/flavors" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Análisis de Sabores"
                description="Análisis detallado de perfiles de sabor y notas sensoriales"
                features={[
                  "Mapeo de perfiles de sabor",
                  "Análisis de notas sensoriales",
                  "Comparación entre marcas",
                  "Tendencias de preferencias"
                ]}
                estimatedDate="Q2 2025"
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/brands" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Comparación de Marcas"
                description="Análisis comparativo del performance de diferentes marcas"
                features={[
                  "Rankings de marcas",
                  "Análisis de market share",
                  "Evolución temporal",
                  "Análisis competitivo"
                ]}
                estimatedDate="Q2 2025"
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/discovery" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Descubrimiento vs Fidelidad"
                description="Análisis de patrones de descubrimiento y fidelidad de usuarios"
                features={[
                  "Métricas de descubrimiento",
                  "Análisis de retención",
                  "Patrones de exploración",
                  "Fidelidad por segmento"
                ]}
                estimatedDate="Q1 2025"
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/geography" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Análisis Geográfico"
                description="Distribución y tendencias por regiones geográficas"
                features={[
                  "Mapas de calor",
                  "Análisis por provincia",
                  "Tendencias regionales",
                  "Distribución demográfica"
                ]}
                estimatedDate="Q3 2025"
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/audience" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Análisis de Audiencia"
                description="Demografía detallada y comportamiento de usuarios"
                features={[
                  "Segmentación demográfica",
                  "Análisis generacional",
                  "Patrones de consumo",
                  "Personalización de audiencias"
                ]}
                estimatedDate="Q2 2025"
              />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dashboard/alerts" 
          element={
            <PrivateRoute>
              <ComingSoonPage 
                title="Alertas y Experimentos"
                description="Sistema de alertas automáticas y gestión de experimentos A/B"
                features={[
                  "Alertas personalizables",
                  "Experimentos A/B",
                  "Monitoreo en tiempo real",
                  "Notificaciones automáticas"
                ]}
                estimatedDate="Q4 2025"
              />
            </PrivateRoute>
          } 
        />
        
        {/* Ruta 404 redirige al dashboard */}
        <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DashboardRoutes;
