// src/dashboard/Overview/OverviewPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Alert,
  Button,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Refresh, 
  TrendingUp, 
  People, 
  Event, 
  Analytics,
  Timeline,
  PieChart
} from '@mui/icons-material';

import FiltersBar from './FiltersBar.jsx';
import MetricCard from './MetricCard.jsx';
import TrendLineChart from './TrendLineChart.jsx';
import StackedBarsChart from './StackedBarsChart.jsx';
import TopMoversTable from './TopMoversTable.jsx';
import NotesTopChart from './NotesTopChart.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import CacheInfo from './CacheInfo.jsx';

import useFiltersStore from '../store/filtersStore.js';
import { fetchOverviewWithComparison, fetchNotesTopWithComparison, refreshOverview } from '../../services/metricsService.js';

const OverviewPage = () => {
  const theme = useTheme();
  
  // Estado del componente
  const [data, setData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [notesTopData, setNotesTopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notesTopLoading, setNotesTopLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notesTopError, setNotesTopError] = useState(null);

  // Zustand store - observar cambios en filtros específicos
  const {
    dateRange,
    timePeriod,
    useCustomDates
  } = useFiltersStore();

  // Formatadores
  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-AR').format(value);
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const formatPp = (value) => {
    return `${value.toFixed(1)} pp`;
  };

  // Formatear deltas para mostrar en los KPIs
  const formatDelta = (delta) => {
    if (!delta || typeof delta !== 'object') return { text: null, trend: 'flat' };
    
    const { abs, pct } = delta;
    const sign = abs >= 0 ? '+' : '';
    const trend = abs > 0 ? 'up' : abs < 0 ? 'down' : 'flat';
    
    // Formatear número con miles
    const formattedAbs = formatNumber(Math.abs(abs));
    
    // Si pct es NaN, Infinity o undefined (división por 0), mostrar solo delta absoluto
    if (!isFinite(pct) || isNaN(pct)) {
      return {
        text: `${sign}${formattedAbs}`,
        trend
      };
    }
    
    // Formatear porcentaje sin decimales
    const formattedPct = `${Math.abs(pct).toFixed(0)}%`;
    
    return {
      text: `${sign}${formattedAbs} (${sign}${formattedPct})`,
      trend
    };
  };

  const formatDeltaPp = (deltaPp) => {
    if (typeof deltaPp !== 'number' || !isFinite(deltaPp) || isNaN(deltaPp)) {
      return { text: null, trend: 'flat' };
    }
    
    const sign = deltaPp >= 0 ? '+' : '−';
    const trend = deltaPp > 0 ? 'up' : deltaPp < 0 ? 'down' : 'flat';
    
    // Formatear puntos porcentuales con 1 decimal
    const formattedPp = formatPp(Math.abs(deltaPp));
    
    return {
      text: `${sign}${formattedPp}`,
      trend
    };
  };

  const getTotalEvents = (data) => {
    // Primero intentar usar el total precalculado del backend
    if (data.temporalActivity?._meta?.totalEvents !== undefined) {
      return data.temporalActivity._meta.totalEvents;
    }
    
    // Fallback: calcular desde los datos temporales
    if (data.temporalActivity?.data) {
      return data.temporalActivity.data.reduce((sum, period) => sum + period.events, 0);
    }
    if (data.weeklyActivity) {
      return data.weeklyActivity.reduce((sum, week) => sum + week.events, 0);
    }
    return 0;
  };

  // Efecto para cargar datos cuando cambien los filtros
  useEffect(() => {
    // Añadir un pequeño delay para asegurar que los cambios del store se propaguen
    const timeoutId = setTimeout(() => {
      // Construir objeto de filtros dentro del useEffect
      const filters = {
        dateRange,
        timePeriod,
        useCustomDates
      };

      console.log('🔄 useEffect ejecutándose - Filtros cambiaron:', {
        timePeriod,
        dateRange: {
          start: dateRange.start?.format('YYYY-MM-DD HH:mm:ss'),
          end: dateRange.end?.format('YYYY-MM-DD HH:mm:ss')
        },
        useCustomDates,
        filtersComplete: filters
      });

      // Logging específico para período "dia"
      if (timePeriod === 'dia') {
        console.log('🌅 PERÍODO DIA DETECTADO - Ejecutando carga de datos para HOY');
      }

    const loadData = async () => {
      setLoading(true);
      setNotesTopLoading(true);
      setError(null);
      setNotesTopError(null);

      try {
        console.log('📊 Cargando datos con comparación y filtros:', filters);

        // Cargar ambos tipos de datos en paralelo
        const [overviewData, notesTopResponseData] = await Promise.all([
          fetchOverviewWithComparison(filters),
          fetchNotesTopWithComparison(filters).catch(err => {
            console.warn('Error cargando notas top:', err);
            setNotesTopError(err.message || 'Error cargando notas sensoriales');
            return null;
          })
        ]);

        console.log('✅ Datos de overview cargados exitosamente:', {
          current: {
            temporalActivity: overviewData.current.temporalActivity,
            typeBreakdown: overviewData.current.typeBreakdown?.length,
            topMovers: overviewData.current.topMovers?.length
          },
          deltas: overviewData.deltas
        });

        if (notesTopResponseData) {
          console.log('✅ Datos de notas top cargados exitosamente:', {
            notes: notesTopResponseData.notes?.length,
            sample: notesTopResponseData.sample
          });
          setNotesTopData(notesTopResponseData);
        }

        setData(overviewData.current);
        setComparisonData(overviewData);
      } catch (err) {
        console.error('Error loading overview data:', err);
        setError(err.message || 'Error cargando datos del dashboard');
      } finally {
        setLoading(false);
        setNotesTopLoading(false);
      }
    };

    loadData();
    }, 100); // delay de 100ms

    return () => clearTimeout(timeoutId);
  }, [dateRange, timePeriod, useCustomDates]);

  // Función para refrescar datos
  const handleRefresh = async () => {
    try {
      setLoading(true);
      // Construir filtros para refresh
      const filters = {
        dateRange,
        timePeriod,
        useCustomDates
      };
      const refreshedData = await refreshOverview(filters);
      setData(refreshedData);
    } catch (err) {
      setError(err.message || 'Error refrescando datos');
    } finally {
      setLoading(false);
    }
  };

  // Función para reintentar en caso de error
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // El useEffect se ejecutará automáticamente
  };

  // Renderizar loading skeleton
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Renderizar error
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              startIcon={<Refresh />}
              onClick={handleRetry}
            >
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header del Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                Dashboard Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Análisis completo de métricas y actividad de la plataforma
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip 
                icon={<Analytics />} 
                label={`Período: ${timePeriod || 'mes'}`} 
                color="primary" 
                variant="outlined"
              />
              {loading && (
                <Chip 
                  label="Actualizando datos..." 
                  color="warning" 
                  size="small"
                  variant="outlined"
                />
              )}
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                size="small"
              >
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </Box>
          </Box>
          
          <Divider />
        </Box>

        {/* Barra de filtros */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <FiltersBar />
        </Paper>

        {/* Contenido principal con datos */}
        {data && !loading && (
          <>
            {/* Fila 1: KPI Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title={`Usuarios con cata (${timePeriod || 'período'})`}
                  value={data.usersWithTasting30d}
                  icon={<People />}
                  hint="Usuarios únicos que realizaron al menos una cata"
                  deltaText={comparisonData?.deltas?.usersWithTasting30d ? formatDelta(comparisonData.deltas.usersWithTasting30d)?.text : undefined}
                  trend={comparisonData?.deltas?.usersWithTasting30d ? formatDelta(comparisonData.deltas.usersWithTasting30d)?.trend : 'flat'}
                  loading={false}
                  color="primary"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="% Descubrimiento"
                  value={formatPercentage(data.discoveryRate)}
                  icon={<TrendingUp />}
                  hint="Porcentaje de usuarios que probaron nuevas yerbas"
                  deltaText={comparisonData?.deltas?.discoveryRatePp ? formatDeltaPp(comparisonData.deltas.discoveryRatePp)?.text : undefined}
                  trend={comparisonData?.deltas?.discoveryRatePp ? formatDeltaPp(comparisonData.deltas.discoveryRatePp)?.trend : 'flat'}
                  loading={false}
                  color="success"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title={`Eventos (${timePeriod || 'período'})`}
                  value={formatNumber(getTotalEvents(data))}
                  icon={<Event />}
                  hint="Total de eventos registrados en el período"
                  deltaText={comparisonData?.deltas?.eventsTotal ? formatDelta(comparisonData.deltas.eventsTotal)?.text : undefined}
                  trend={comparisonData?.deltas?.eventsTotal ? formatDelta(comparisonData.deltas.eventsTotal)?.trend : 'flat'}
                  loading={false}
                  color="info"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <MetricCard
                  title="Muestra Activa"
                  value={data.sample?.nUsers || 0}
                  icon={<Analytics />}
                  hint="Usuarios en la muestra analizada"
                  loading={false}
                  color="warning"
                />
              </Grid>
            </Grid>

            {/* Fila 2: Gráfico de tendencia temporal */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Actividad por Período
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {data.temporalActivity?.periodLabel || 'Evolución temporal de la actividad'}
                  </Typography>
                </Box>
                
                {data.temporalActivity?.granularity && (
                  <Chip 
                    label={`Granularidad: ${data.temporalActivity.granularity}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              </Box>
              
              <Box sx={{ height: 400, width: '100%' }}>
                <TrendLineChart 
                  weeklyActivity={data.weeklyActivity || []} 
                  temporalActivity={data.temporalActivity || {}}
                />
              </Box>
            </Paper>

            {/* Fila 3: Distribución por tipos y Top movers */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper sx={{ p: 3, height: 450, borderRadius: 2, boxShadow: theme.shadows[1] }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      <PieChart sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Distribución por Tipo de Yerba
                    </Typography>
                    {data.typeBreakdown?.[0]?.note && (
                      <Chip 
                        label="Datos históricos"
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  <StackedBarsChart typeBreakdown={data.typeBreakdown || []} />
                </Paper>
              </Grid>
              
              <Grid size={{ xs: 12, lg: 6 }}>
                <Paper sx={{ p: 3, height: 450, borderRadius: 2, boxShadow: theme.shadows[1] }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                    <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Principales Movimientos
                  </Typography>
                  <TopMoversTable topMovers={data.topMovers || []} />
                </Paper>
              </Grid>
            </Grid>

            {/* Fila 4: Notas sensoriales top del período */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12 }}>
                <NotesTopChart
                  data={notesTopData}
                  loading={notesTopLoading}
                  error={notesTopError}
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* Estado vacío */}
        {!data && !loading && !error && (
          <EmptyState 
            title="No hay datos disponibles"
            description="Selecciona diferentes filtros o períodos para ver datos"
            action={
              <Button variant="contained" onClick={handleRefresh}>
                Cargar Datos
              </Button>
            }
          />
        )}
      </Container>
    </Box>
  );
};

export default OverviewPage;
