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
  Chip,
  Container,
  useTheme
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import yerbaService from '../../services/yerbaService.js';
import FiltersBar from '../Overview/FiltersBar.jsx';
import useFiltersStore from '../store/filtersStore.js';

// Configurar dayjs para usar español
dayjs.locale('es');

const YerbasPage = () => {
  const theme = useTheme();
  const [yerbas, setYerbas] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el store de Zustand para los filtros de tiempo
  const {
    dateRange,
    timePeriod,
    useCustomDates
  } = useFiltersStore();

  // Configuración de períodos de tiempo para mostrar la etiqueta actual
  const timePeriods = [
    { value: 'dia', label: 'Hoy' },
    { value: 'semana', label: 'Últimos 7 días' },
    { value: 'mes', label: 'Últimas 4 semanas' },
    { value: 'año', label: 'Último año' }
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

  const getPeriodoLabel = () => {
    if (useCustomDates) {
      return 'Período personalizado';
    }
    const period = timePeriods.find(p => p.value === timePeriod);
    return period ? period.label : 'Últimas 4 semanas';
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        mt: { xs: 8, sm: 9, md: 10 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: { xs: 200, sm: 250, md: 300 }
        }}>
          <CircularProgress size={{ xs: 32, sm: 40 }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        mt: { xs: 8, sm: 9, md: 10 }
      }}>
        <Typography 
          color="error" 
          sx={{ 
            p: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: 'center'
          }}
        >
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 1, sm: 2, md: 3 },
        px: { xs: 1, sm: 2, md: 3, lg: 4 },
        width: '100%',
        maxWidth: '100%',
        mt: { xs: 8, sm: 9, md: 10 }
      }}
    >
      {/* Filtros de tiempo usando FiltersBar */}
      <FiltersBar />
      
      {/* Búsqueda específica para yerbas */}
      <Paper sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: { xs: 2, sm: 3 },
        width: '100%',
        boxShadow: theme.shadows[1]
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: { xs: 1, sm: 1.5 }, 
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          Búsqueda
        </Typography>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar yerba por nombre"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: { xs: 18, sm: 20 } }} />
              </InputAdornment>
            ),
            sx: {
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '& input': {
                py: { xs: 1, sm: 1.25 }
              }
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </Paper>

      {loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: { xs: 200, sm: 250, md: 300 }
        }}>
          <CircularProgress size={{ xs: 32, sm: 40 }} />
        </Box>
      )}

      {error && (
        <Typography 
          color="error" 
          sx={{ 
            p: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
            textAlign: 'center'
          }}
        >
          Error: {error}
        </Typography>
      )}

      {!loading && !error && (
        <Paper sx={{ 
          width: '100%',
          overflow: 'hidden',
          boxShadow: theme.shadows[1]
        }}>
          <TableContainer sx={{ 
            maxHeight: { xs: 400, sm: 500, md: 600 },
            overflow: 'auto'
          }}>
            <Table 
              size="small" 
              stickyHeader
              sx={{
                '& .MuiTableCell-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  py: { xs: 1, sm: 1.5 },
                  px: { xs: 1, sm: 2 }
                }
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    fontWeight: 600,
                    backgroundColor: 'background.paper',
                    borderBottom: `2px solid ${theme.palette.divider}`
                  }}>
                    Yerba
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: 'background.paper',
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      minWidth: { xs: 80, sm: 100 }
                    }}
                  >
                    Volumen
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: 'background.paper',
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      minWidth: { xs: 100, sm: 120 }
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      Descubrimiento
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      Desc.
                    </Box>
                  </TableCell>
                  <TableCell 
                    align="right"
                    sx={{ 
                      fontWeight: 600,
                      backgroundColor: 'background.paper',
                      borderBottom: `2px solid ${theme.palette.divider}`,
                      minWidth: { xs: 80, sm: 120 }
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      Puntaje Promedio
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      Puntaje
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yerbas.map((y, index) => (
                  <TableRow 
                    key={y.id || y.yerbaId || y.name || index}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'action.hover'
                      },
                      '&:hover': {
                        backgroundColor: 'action.selected'
                      }
                    }}
                  >
                    <TableCell sx={{ 
                      maxWidth: { xs: 120, sm: 200, md: 300 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Box component="span" title={y.name || y.yerbaName}>
                        {y.name || y.yerbaName}
                      </Box>
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontWeight: 500 }}
                    >
                      {(y.volumen ?? y.volume ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontWeight: 500 }}
                    >
                      {(y.descubrimiento ?? y.discovery ?? y.probadas ?? 0).toLocaleString()}
                    </TableCell>
                    <TableCell 
                      align="right"
                      sx={{ fontWeight: 500 }}
                    >
                      {(y.puntajePromedio ?? y.averageScore ?? y.avgScore ?? 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
                {yerbas.length === 0 && (
                  <TableRow>
                    <TableCell 
                      colSpan={4} 
                      align="center" 
                      sx={{ 
                        py: { xs: 4, sm: 6 },
                        px: { xs: 2, sm: 3 }
                      }}
                    >
                      <Typography 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        No se encontraron yerbas para los filtros seleccionados
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
};

export default YerbasPage;
