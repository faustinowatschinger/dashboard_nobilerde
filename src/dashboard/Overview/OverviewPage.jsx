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
import EmptyState from './EmptyState.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import CacheInfo from './CacheInfo.jsx';

import useFiltersStore from '../store/filtersStore.js';
import metricsService from '../../services/metricsService.js';

const OverviewPage = () => {
  const theme = useTheme();
  
  // Estado del componente
  const [data, setData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(null);

      try {
        console.log('📊 Cargando datos con comparación y filtros:', filters);

        // Cargar datos de overview
        const overviewData = await metricsService.fetchOverviewWithComparison(filters);

        console.log('✅ Datos de overview cargados exitosamente:', {
          current: {
            temporalActivity: overviewData.current.temporalActivity,
            typeBreakdown: overviewData.current.typeBreakdown?.length,
            topMovers: overviewData.current.topMovers?.length
          },
          deltas: overviewData.deltas
        });

        setData(overviewData.current);
        setComparisonData(overviewData);
      } catch (err) {
        console.error('Error loading overview data:', err);
        setError(err.message || 'Error cargando datos del dashboard');
      } finally {
        setLoading(false);
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
      const refreshedData = await metricsService.refreshOverview(filters);
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      py: { xs: 0.5, sm: 1, md: 2, lg: 3 }, 
      overflowX: 'hidden',
      width: '100%'
    }}>
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          width: '100%',
          maxWidth: '100%'
        }}
      >

        {/* Barra de filtros */}
        <Paper sx={{ 
          p: { xs: 1, sm: 2, md: 3 }, 
          mb: { xs: 1, sm: 2, md: 3 }, 
          borderRadius: 2, 
          boxShadow: theme.shadows[1],
          width: '100%'
        }}>
          <FiltersBar />
        </Paper>

        {/* Contenido principal con datos */}
        {data && !loading && (
          <>
            {/* Fila 1: KPI Cards - make cards stretch and share available space */}
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 1, sm: 2, md: 3 } }} alignItems="stretch">
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <MetricCard
                  title={`Usuarios con cata (${timePeriod || 'período'})`}
                  value={data.usersWithTasting30d}
                  icon={<People />}
                  hint="Usuarios únicos que realizaron al menos una cata"
                  deltaText={comparisonData?.deltas?.usersWithTasting30d ? formatDelta(comparisonData.deltas.usersWithTasting30d)?.text : undefined}
                  trend={comparisonData?.deltas?.usersWithTasting30d ? formatDelta(comparisonData.deltas.usersWithTasting30d)?.trend : 'flat'}
                  loading={false}
                  color="primary"
                  sx={{ flex: 1, width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <MetricCard
                  title={`% Descubrimiento (${timePeriod || 'período'})`}
                  value={formatPercentage(data.discoveryRate)}
                  icon={<TrendingUp />}
                  hint="Porcentaje de usuarios que probaron nuevas yerbas"
                  deltaText={comparisonData?.deltas?.discoveryRatePp ? formatDeltaPp(comparisonData.deltas.discoveryRatePp)?.text : undefined}
                  trend={comparisonData?.deltas?.discoveryRatePp ? formatDeltaPp(comparisonData.deltas.discoveryRatePp)?.trend : 'flat'}
                  loading={false}
                  color="success"
                  sx={{ flex: 1, width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <MetricCard
                  title={`Eventos (${timePeriod || 'período'})`}
                  value={formatNumber(getTotalEvents(data))}
                  icon={<Event />}
                  hint="Total de eventos registrados en el período"
                  deltaText={comparisonData?.deltas?.eventsTotal ? formatDelta(comparisonData.deltas.eventsTotal)?.text : undefined}
                  trend={comparisonData?.deltas?.eventsTotal ? formatDelta(comparisonData.deltas.eventsTotal)?.trend : 'flat'}
                  loading={false}
                  color="info"
                  sx={{ flex: 1, width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex' }}>
                <MetricCard
                  title={`Usuarios Activos (${timePeriod || 'período'})`}
                  value={data.sample?.activeUsers || data.activeUsers || 0}
                  icon={<Analytics />}
                  hint={`Usuarios con actividad en el ${timePeriod || 'período'}`}
                  deltaText={comparisonData?.deltas?.activeUsers ? formatDelta(comparisonData.deltas.activeUsers)?.text : undefined}
                  trend={comparisonData?.deltas?.activeUsers ? formatDelta(comparisonData.deltas.activeUsers)?.trend : 'flat'}
                  loading={false}
                  color="warning"
                  sx={{ flex: 1, width: '100%' }}
                />
              </Grid>
            </Grid>

            {/* Fila 2: Gráfico de tendencia temporal */}
            <Paper sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              mb: { xs: 1, sm: 2, md: 3 }, 
              borderRadius: 2, 
              boxShadow: theme.shadows[1],
              width: '100%'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: { xs: 1, sm: 2 }, 
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0.5, sm: 0 }
              }}>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                  }}>
                    <Timeline sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: 18, sm: 20, md: 24 } }} />
                    Actividad por Período
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                  }}>
                    {data.temporalActivity?.periodLabel || 'Evolución temporal de la actividad'}
                  </Typography>
                </Box>
                
                {data.temporalActivity?.granularity && (
                  <Chip 
                    label={`Granularidad: ${data.temporalActivity.granularity}`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                  />
                )}
              </Box>
              
              <Box sx={{ 
                height: { xs: 200, sm: 250, md: 300, lg: 400 }, 
                width: '100%',
                overflow: 'hidden'
              }}>
                <TrendLineChart 
                  weeklyActivity={data.weeklyActivity || []} 
                  temporalActivity={data.temporalActivity || {}}
                />
              </Box>
            </Paper>

            {/* Fila 3: Distribución por tipos y Top movers */}
            {/* Forzar siempre apilamiento vertical y ancho completo */}
            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ mb: { xs: 1, sm: 2, md: 3 } }} direction="column">
               {/* Hacer que cada elemento ocupe todo el ancho */}
              <Grid item xs={12} sm={12} md={12}>
                <Paper sx={{ 
                  p: { xs: 1, sm: 2, md: 3 }, 
                  height: { xs: 'auto', sm: 'auto', md: 400, lg: 450 }, 
                  borderRadius: 2, 
                  boxShadow: theme.shadows[1], 
                  width: '100%', 
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' }, 
                    mb: { xs: 1, sm: 2 }, 
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 0.5, sm: 0 }
                  }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: 'text.primary',
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                    }}>
                      <PieChart sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: 18, sm: 20, md: 24 } }} />
                      Distribución por Tipo de Yerba
                    </Typography>
                    {data.typeBreakdown?.[0]?.note && (
                      <Chip 
                        label="Datos históricos"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
                      />
                    )}
                  </Box>
                  <Box sx={{ 
                    width: '100%',
                    height: { xs: 180, sm: 220, md: 300, lg: 350 },
                    overflow: 'hidden'
                  }}>
                    <StackedBarsChart typeBreakdown={data.typeBreakdown || []} />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={12} md={12}>
                <Paper sx={{ 
                  p: { xs: 1, sm: 2, md: 3 }, 
                  height: { xs: 'auto', sm: 'auto', md: 400, lg: 450 }, 
                  borderRadius: 2, 
                  boxShadow: theme.shadows[1], 
                  width: '100%', 
                  overflowX: 'auto'
                }}>
                   <Typography variant="h6" sx={{ 
                     fontWeight: 600, 
                     color: 'text.primary', 
                     mb: { xs: 1, sm: 2 },
                     fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                   }}>
                     <TrendingUp sx={{ mr: 1, verticalAlign: 'middle', fontSize: { xs: 18, sm: 20, md: 24 } }} />
                     Principales Movimientos
                   </Typography>
                   <Box sx={{ 
                     width: '100%',
                     overflow: 'auto'
                   }}>
                     <TopMoversTable topMovers={data.topMovers || []} />
                   </Box>
                 </Paper>
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
