import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Button, 
  Container,
  Paper,
  Chip,
  useTheme
} from '@mui/material';
import { 
  Refresh, 
  CompareArrows
} from '@mui/icons-material';

import FiltersBar from '../Overview/FiltersBar.jsx';
import MetricSelector from './MetricSelector.jsx';
import EntitiesSelector from './EntitiesSelector.jsx';
import TrendsComparisonChart from './TrendsComparisonChart.jsx';
import EmptyState from './EmptyState.jsx';
import LoadingSkeleton from './LoadingSkeleton.jsx';
import useFiltersStore from '../store/filtersStore.js';
import metricsService from '../../services/metricsService.js';

const TrendsPage = () => {
  const theme = useTheme();
  
  // Estado del componente
  const [metric, setMetric] = useState('volumen');
  const [entityType, setEntityType] = useState('tipo');
  const [entities, setEntities] = useState([]);
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Zustand store - observar cambios en filtros específicos
  const {
    dateRange,
    timePeriod,
    country,
    ageBucket,
    gender,
    tipoYerba
  } = useFiltersStore();

  // Efecto para cargar datos cuando cambien los filtros
  useEffect(() => {
    const doLoad = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('📊 Cargando datos de tendencias comparativas...');
        
        const filters = {
          dateRange,
          timePeriod,
          country,
          ageBucket,
          gender,
          tipoYerba,
          metric,
          entityType,
          entities
        };

        // Cargar tendencias comparativas
        const trendsResponse = await metricsService.fetchTrendsComparison(filters);
        setTrendsData(trendsResponse);
        
        console.log('✅ Datos de tendencias cargados correctamente');
      } catch (err) {
        console.error('❌ Error cargando datos de tendencias:', err);
        setError(err.message || 'Error desconocido al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    doLoad();
  }, [dateRange, timePeriod, country, ageBucket, gender, tipoYerba, metric, entityType, entities]);

  // Función para cargar datos manualmente
  const loadData = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Cargando datos de tendencias comparativas...');
      
      const filters = {
        dateRange,
        timePeriod,
        country,
        ageBucket,
        gender,
        tipoYerba,
        metric,
        entityType,
        entities
      };

      // Cargar tendencias comparativas
      const trendsResponse = await metricsService.fetchTrendsComparison(filters);
      console.log('📊 TrendsPage - Respuesta de tendencias comparativas:', trendsResponse);
      console.log('📊 TrendsPage - Trends recibidas:', trendsResponse?.trends);
      setTrendsData(trendsResponse);
      
      console.log('✅ Datos de tendencias cargados correctamente');
    } catch (err) {
      console.error('❌ Error cargando datos de tendencias:', err);
      setError(err.message || 'Error desconocido al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Barra de filtros */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, marginTop: 10, boxShadow: theme.shadows[1] }}>
        <FiltersBar />
      </Paper>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
          <Button size="small" onClick={handleRefresh} sx={{ ml: 2 }}>
            Reintentar
          </Button>
        </Alert>
      )}

      {/* Controles específicos de tendencias */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Título */}
          <Box>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              Tendencias Comparativas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Análisis de cambios porcentuales entre períodos
            </Typography>
          </Box>

          {/* Selectores de métrica y entidades */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <MetricSelector value={metric} onChange={setMetric} />
            <EntitiesSelector 
              entityType={entityType}
              onEntityTypeChange={setEntityType}
              entities={entities}
              onEntitiesChange={setEntities}
            />
          </Box>
        </Box>
      </Paper>

      {/* Loading */}
      {loading && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <LoadingSkeleton />
        </Paper>
      )}

      {/* Gráfico de tendencias comparativas */}
      {trendsData && !loading && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                <CompareArrows sx={{ mr: 1, verticalAlign: 'middle' }} />
                Tendencias Comparativas - {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comparación de período actual vs anterior por {entityType}
              </Typography>
            </Box>
            
            <Chip 
              label={`${trendsData.trends?.length || 0} ${entityType}(s)`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          </Box>
          
          <Box sx={{ height: 500, width: '100%' }}>
            {console.log('🎯 TrendsPage - Pasando datos al chart:', { 
              trends: trendsData.trends, 
              trendsLength: trendsData.trends?.length,
              loading 
            })}
            <TrendsComparisonChart 
              trends={trendsData.trends || []} 
              loading={loading}
            />
          </Box>
        </Paper>
      )}

      {/* Estado vacío */}
      {!trendsData && !loading && !error && (
        <EmptyState 
          title="No hay datos de tendencias disponibles"
          description="Configura los filtros y métricas para visualizar las tendencias"
          action={
            <Button variant="contained" onClick={handleRefresh}>
              <Refresh sx={{ mr: 1 }} />
              Cargar Datos
            </Button>
          }
        />
      )}
    </Container>
  );
};

export default TrendsPage;
