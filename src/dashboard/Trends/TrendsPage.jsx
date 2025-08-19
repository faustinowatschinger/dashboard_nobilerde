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
import TrendsFiltersPanel from './TrendsFiltersPanel.jsx';
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
    tipoMatero,
    tipoMate,
    termosDia,
    tipoYerba,
    marca,
    establecimiento,
    origen,
    paisProd,
    secado,
    leafCut,
    tipoEstacionamiento,
    produccion,
    containsPalo
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
          tipoMatero,
          tipoMate,
          termosDia,
          tipoYerba,
          marca,
          establecimiento,
          origen,
          paisProd,
          secado,
          leafCut,
          tipoEstacionamiento,
          produccion,
          containsPalo,
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
  }, [dateRange, timePeriod, country, ageBucket, gender, tipoMatero, tipoMate, termosDia, tipoYerba, marca, establecimiento, origen, paisProd, secado, leafCut, tipoEstacionamiento, produccion, containsPalo, metric, entityType, entities]);

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
        tipoMatero,
        tipoMate,
        termosDia,
        tipoYerba,
        marca,
        establecimiento,
        origen,
        paisProd,
        secado,
        leafCut,
        tipoEstacionamiento,
        produccion,
        containsPalo,
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
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%'
      }}
    >
        <FiltersBar />

      {/* Panel de filtros de análisis */}
      <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
        <TrendsFiltersPanel />
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography sx={{ flex: 1, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              {error}
            </Typography>
            <Button 
              size="small" 
              onClick={handleRefresh} 
              sx={{ 
                ml: { xs: 0, sm: 2 },
                mt: { xs: 1, sm: 0 },
                minWidth: { xs: 'auto', sm: 'fit-content' }
              }}
            >
              Reintentar
            </Button>
          </Box>
        </Alert>
      )}

      {/* Controles específicos de tendencias */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: { xs: 2, sm: 3, md: 4 }, 
        borderRadius: 2, 
        boxShadow: theme.shadows[1],
        width: '100%'
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {/* Título */}
          <Box>
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}>
              Tendencias Comparativas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{
              fontSize: { xs: '0.8rem', sm: '0.875rem' }
            }}>
              Análisis de cambios porcentuales entre períodos
            </Typography>
          </Box>

          {/* Selectores de métrica y entidades */}
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Box sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { xs: '100%', sm: 200 } }}>
              <MetricSelector value={metric} onChange={setMetric} />
            </Box>
            <Box sx={{ flex: { xs: 1, sm: 'none' }, minWidth: { xs: '100%', sm: 300 } }}>
              <EntitiesSelector 
                entityType={entityType}
                onEntityTypeChange={setEntityType}
                entities={entities}
                onEntitiesChange={setEntities}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Loading */}
      {loading && (
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 2, 
          boxShadow: theme.shadows[1],
          width: '100%'
        }}>
          <LoadingSkeleton />
        </Paper>
      )}

      {/* Gráfico de tendencias comparativas */}
      {trendsData && !loading && (
        <Paper sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 2, 
          boxShadow: theme.shadows[1],
          width: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' }, 
            mb: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}>
                <CompareArrows sx={{ mr: { xs: 0.5, sm: 1 }, verticalAlign: 'middle' }} />
                <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                  Tendencias Comparativas - {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}>
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
          
          <Box sx={{ 
            height: { xs: 300, sm: 400, md: 500 }, 
            width: '100%',
            overflow: 'hidden'
          }}>
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
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: { xs: 200, sm: 250, md: 300 },
          width: '100%'
        }}>
          <EmptyState 
            title="No hay datos de tendencias disponibles"
            description="Configura los filtros y métricas para visualizar las tendencias"
            action={
              <Button 
                variant="contained" 
                onClick={handleRefresh}
                size="medium"
                sx={{ 
                  minWidth: { xs: 'auto', sm: 'fit-content' },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.75, sm: 1 }
                }}
              >
                <Refresh sx={{ mr: 1, fontSize: { xs: 16, sm: 20 } }} />
                Cargar Datos
              </Button>
            }
          />
        </Box>
      )}
    </Container>
  );
};

export default TrendsPage;
