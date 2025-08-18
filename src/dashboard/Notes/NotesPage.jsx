import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Collapse,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import NotesTopChart from '../Overview/NotesTopChart';
import { metricsService } from '../../services/metricsService.js';
import useFiltersStore from '../store/filtersStore.js';

// Configurar dayjs para usar español
dayjs.locale('es');

const NotesPage = () => {
  const [notesData, setNotesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zustand store - observar cambios en filtros específicos
  const {
    dateRange,
    timePeriod,
    useCustomDates,
    setTimePeriod,
    setUseCustomDates,
    setDateRange
  } = useFiltersStore();

  // Configuración de períodos de tiempo
  const timePeriods = [
    { value: 'dia', label: 'Hoy', icon: '🌅' },
    { value: 'semana', label: 'Últimos 7 días', icon: '📅' },
    { value: 'mes', label: 'Últimas 4 semanas', icon: '📊' },
    { value: 'año', label: 'Último año', icon: '📈' }
  ];

  // Efecto para recargar datos cuando cambian los filtros
  useEffect(() => {
    // Añadir un pequeño delay para asegurar que los cambios del store se propaguen
    const timeoutId = setTimeout(() => {
      console.log('🔄 NotesPage - Cambio en filtros detectado, recargando datos...');
      console.log('📋 Estados actuales:', { timePeriod, useCustomDates, dateRange });
      
      const loadNotesData = async () => {
        try {
          setLoading(true);
          
          // Usar el mismo patrón que OverviewPage para construir filtros
          const filters = {
            dateRange,
            timePeriod,
            useCustomDates
          };

          console.log('🔍 NotesPage - Enviando filtros para notas:', filters);
          const data = await metricsService.fetchNotesTop(filters);
          console.log('📊 NotesPage - Datos de notas recibidos:', data);
          
          setNotesData(data);
          setError(null);
        } catch (err) {
          console.error('❌ Error cargando datos de notas:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      loadNotesData();
    }, 100); // delay de 100ms

    return () => clearTimeout(timeoutId);
  }, [dateRange, timePeriod, useCustomDates]);

  // Manejadores de eventos
  const handleTimePeriodChange = (newPeriod) => {
    console.log('🔄 NotesPage - Cambiando período de:', timePeriod, 'a:', newPeriod);
    setTimePeriod(newPeriod);
    setUseCustomDates(false);
  };

  const handleCustomDatesToggle = () => {
    setUseCustomDates(!useCustomDates);
  };

  const updateDateRange = (start, end) => {
    setDateRange({ start, end });
  };

  const getPeriodoLabel = () => {
    if (useCustomDates) {
      return 'Período personalizado';
    }
    const period = timePeriods.find(p => p.value === timePeriod);
    return period ? period.label : 'Últimas 4 semanas';
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Top 5 Comentarios por Engagement
      </Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Períodos predefinidos */}
          <Grid item xs={12} sm={8} md={9}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Período de Tiempo
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {timePeriods.map((period) => (
                <Button
                  key={period.value}
                  variant={timePeriod === period.value ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => handleTimePeriodChange(period.value)}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <span>{period.icon}</span>
                    {period.label}
                  </Box>
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Fechas personalizadas */}
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Personalizado
            </Typography>
            <Button
              variant={useCustomDates ? 'contained' : 'outlined'}
              size="small"
              onClick={handleCustomDatesToggle}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Fechas Personalizadas
            </Button>
          </Grid>
        </Grid>

        {/* Selector de fechas personalizadas */}
        <Collapse in={useCustomDates}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de inicio"
                    value={dateRange.start ? dayjs(dateRange.start) : null}
                    onChange={(newValue) => updateDateRange(newValue, dateRange.end)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        variant: 'outlined'
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Fecha de fin"
                    value={dateRange.end ? dayjs(dateRange.end) : null}
                    onChange={(newValue) => updateDateRange(dateRange.start, newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        variant: 'outlined'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </Collapse>
      </Paper>

      {/* Información del período activo */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Mostrando comentarios de:
        </Typography>
        <Chip 
          label={getPeriodoLabel()} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      {/* Gráfico de comentarios top */}
      <NotesTopChart 
        data={notesData} 
        loading={loading} 
        error={error} 
      />
    </Box>
  );
};

export default NotesPage;
