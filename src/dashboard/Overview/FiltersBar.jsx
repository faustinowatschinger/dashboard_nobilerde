// src/dashboard/Overview/FiltersBar.jsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
  Divider,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  ExpandLess,
  Clear,
  DateRange,
  People,
  Category,
  LocationOn
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

import useFiltersStore from '../store/filtersStore.js';

// Configurar dayjs para usar español
dayjs.locale('es');

const FiltersBar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(!isMobile);

  // Zustand store
  const {
    dateRange,
    timePeriod,
    useCustomDates,
    setDateRange,
    setTimePeriod,
    setUseCustomDates,
    resetFilters
  } = useFiltersStore();

  // Configuración de períodos de tiempo
  const timePeriods = useMemo(() => [
    { value: 'dia', label: 'Hoy', icon: '🌅' },
    { value: 'semana', label: 'Últimos 7 días', icon: '📅' },
    { value: 'mes', label: 'Últimas 4 semanas', icon: '📊' },
    { value: 'año', label: 'Último año', icon: '📈' }
  ], []);

  // Cargar opciones de filtros
  // Función para actualizar el rango de fechas
  const updateDateRange = (start, end) => {
    setDateRange({ start, end });
  };

  // Función para cambiar el período de tiempo
  const handleTimePeriodChange = (newPeriod) => {
    console.log('🔄 handleTimePeriodChange llamado con:', newPeriod);
    console.log('📅 Estado actual antes del cambio:', {
      timePeriod,
      dateRange: {
        start: dateRange.start?.format('YYYY-MM-DD'),
        end: dateRange.end?.format('YYYY-MM-DD')
      },
      useCustomDates
    });
    
    setTimePeriod(newPeriod);
    setUseCustomDates(false);
    
    console.log('✅ setTimePeriod y setUseCustomDates ejecutados');
  };

  // Función para limpiar todos los filtros
  const handleClearFilters = () => {
    resetFilters();
  };

  // Función para obtener el número de filtros activos
  const getActiveFiltersCount = () => {
    let count = 0;
    if (useCustomDates && (dateRange.start || dateRange.end)) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[2], marginTop: 10, marginBottom: 5 }}>
      {/* Header de filtros */}
      <Box 
        sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList sx={{ fontSize: { xs: 20, sm: 24 } }} />
          <Typography variant="h6" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}>
            Filtros
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              color="secondary" 
              sx={{ ml: 1, fontWeight: 700 }}
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeFiltersCount > 0 && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={(e) => {
                e.stopPropagation();
                handleClearFilters();
              }}
              startIcon={<Clear />}
              sx={{ 
                color: 'inherit', 
                borderColor: 'rgba(255,255,255,0.5)',
                '&:hover': { borderColor: 'inherit' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                px: { xs: 1, sm: 2 }
              }}
            >
              Limpiar
            </Button>
          )}
          
          <IconButton 
            color="inherit" 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            sx={{ bgcolor: 'transparent' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Contenido de filtros */}
      <Collapse in={expanded}>
        <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 }, bgcolor: 'background.paper', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Filtros de tiempo */}
            <Grid item xs={12}>
              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1.5, sm: 2 }, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}>
                  <DateRange color="primary" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  Período de Tiempo
                </Typography>
                
                <Grid container spacing={{ xs: 1, sm: 2 }} alignItems="center">
                  <Grid item xs={12} sm={8} md={8}>
                    {/* Period buttons: always show labels; stacked as column on xs */}
                    <Grid container spacing={{ xs: 0.5, sm: 1 }}>
                      {timePeriods.map((period) => (
                        <Grid key={period.value} item xs={6} sm={6} md={3}>
                          <Button
                            variant={timePeriod === period.value ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => handleTimePeriodChange(period.value)}
                            fullWidth
                            sx={{ 
                              px: { xs: 1, sm: 2 },
                              py: { xs: 0.5, sm: 1 },
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: { xs: 0.5, sm: 1 },
                              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                            }}
                          >
                            <Box component="span">{period.label}</Box>
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>

                  {/* Fechas personalizadas */}
                  <Grid item xs={12} sm={4} md={4}>
                    <Button
                      variant={useCustomDates ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setUseCustomDates(!useCustomDates)}
                      fullWidth
                      sx={{ 
                        borderRadius: 2, 
                        textTransform: 'none', 
                        fontWeight: 700,
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                        py: { xs: 0.5, sm: 1 }
                      }}
                    >
                      Fecha Personalizada
                    </Button>
                  </Grid>
                </Grid>

                {/* Selector de fechas personalizadas */}
                {useCustomDates && (
                  <Box sx={{ mt: { xs: 1.5, sm: 2 }, p: { xs: 1.5, sm: 2 }, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={{ xs: 1, sm: 2 }}>
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
                )}
              </Box>
              
              <Divider sx={{ my: { xs: 1, sm: 2 } }} />
            </Grid>
            </Grid>
         </Box>
       </Collapse>
     </Paper>
   );
 };
 
 export default FiltersBar;
