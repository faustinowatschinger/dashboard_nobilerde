import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  Collapse
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import yerbaService from '../../services/yerbaService.js';

// Configurar dayjs para usar español
dayjs.locale('es');

const YerbasPage = () => {
  const [yerbas, setYerbas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState('mes');
  const [useCustomDates, setUseCustomDates] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null
  });

  // Configuración de períodos de tiempo (igual que Overview)
  const timePeriods = [
    { value: 'dia', label: 'Hoy', icon: '🌅' },
    { value: 'semana', label: 'Últimos 7 días', icon: '📅' },
    { value: 'mes', label: 'Últimas 4 semanas', icon: '📊' },
    { value: 'año', label: 'Último año', icon: '📈' }
  ];

  // Efecto para recargar datos cuando cambian los filtros principales
  useEffect(() => {
    console.log('🔄 YerbasPage - Cambio en filtros detectado, recargando datos...');
    console.log('📋 Estados actuales:', { timePeriod, useCustomDates, searchTerm: search });
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Preparar parámetros basados en el sistema de filtros
        let queryParams = {
          search: search.trim()
        };

        // Si usa fechas personalizadas, enviar las fechas específicas
        if (useCustomDates && dateRange.start && dateRange.end) {
          queryParams.startDate = dateRange.start.format('YYYY-MM-DD');
          queryParams.endDate = dateRange.end.format('YYYY-MM-DD');
          queryParams.periodo = 'personalizado';
        } else {
          // Mapear timePeriod a los valores que espera el backend
          const periodMapping = {
            'dia': 'ultimo_dia',
            'semana': 'ultima_semana', 
            'mes': 'ultimo_mes',
            'año': 'ultimo_ano'
          };
          queryParams.periodo = periodMapping[timePeriod] || 'ultimo_mes';
        }

        console.log('🔍 YerbasPage - Enviando parámetros al backend:', queryParams);
        const data = await yerbaService.fetchYerbaStats(queryParams);
        console.log('📊 YerbasPage - Datos recibidos del backend:', data.length, 'yerbas');
        setYerbas(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [timePeriod, useCustomDates, dateRange?.start, dateRange?.end, search]);

  // Debug: Log cuando cambia el timePeriod
  useEffect(() => {
    console.log('🕐 YerbasPage - TimePeriod cambió a:', timePeriod);
  }, [timePeriod]);

  // Manejadores de eventos (similar a Overview)
  const handleTimePeriodChange = (newPeriod) => {
    console.log('🔄 YerbasPage - Cambiando período de:', timePeriod, 'a:', newPeriod);
    setTimePeriod(newPeriod);
    setUseCustomDates(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Todas las Yerbas
      </Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Períodos predefinidos */}
          <Grid item xs={12} sm={8} md={6}>
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
              onClick={() => setUseCustomDates(!useCustomDates)}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Fechas Personalizadas
            </Button>
          </Grid>
          
          {/* Búsqueda */}
          <Grid item xs={12} sm={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Búsqueda
            </Typography>
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar yerba"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
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
          Mostrando datos de:
        </Typography>
        <Chip 
          label={getPeriodoLabel()} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
        <Typography variant="body2" color="text.secondary">
          •
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {yerbas.length} yerbas encontradas
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ p: 2 }}>
          Error: {error}
        </Typography>
      )}

      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Yerba</TableCell>
                <TableCell align="right">Volumen</TableCell>
                <TableCell align="right">Descubrimiento</TableCell>
                <TableCell align="right">Puntaje Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yerbas.map((y) => (
                <TableRow key={y.id || y.yerbaId || y.name}>
                  <TableCell>{y.name || y.yerbaName}</TableCell>
                  <TableCell align="right">{y.volumen ?? y.volume ?? 0}</TableCell>
                  <TableCell align="right">{y.descubrimiento ?? y.discovery ?? y.probadas ?? 0}</TableCell>
                  <TableCell align="right">
                    {(y.puntajePromedio ?? y.averageScore ?? y.avgScore ?? 0).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {yerbas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">
                      No se encontraron yerbas para los filtros seleccionados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default YerbasPage;
