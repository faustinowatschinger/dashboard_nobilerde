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
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      {/* Header de filtros */}
      <Box 
        sx={{ 
          p: 2, 
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
          <FilterList />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip 
              label={activeFiltersCount} 
              size="small" 
              color="secondary" 
              sx={{ ml: 1 }}
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
                '&:hover': { borderColor: 'inherit' }
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
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>

      {/* Contenido de filtros */}
      <Collapse in={expanded}>
        <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
          <Grid container spacing={3}>
            {/* Filtros de tiempo */}
            <Grid xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateRange color="primary" />
                  Período de Tiempo
                </Typography>
                
                <Grid container spacing={2}>
                  {/* Períodos predefinidos */}
                  <Grid xs={12} sm={6} md={8}>
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
                            {!isSmallMobile && period.label}
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  </Grid>

                  {/* Fechas personalizadas */}
                  <Grid xs={12} sm={6} md={4}>
                    <Button
                      variant={useCustomDates ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setUseCustomDates(!useCustomDates)}
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      Fechas Personalizadas
                    </Button>
                  </Grid>
                </Grid>

                {/* Selector de fechas personalizadas */}
                {useCustomDates && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
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
                        <Grid xs={12} sm={6}>
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
              
              <Divider sx={{ my: 2 }} />
            </Grid>
            </Grid>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FiltersBar;
