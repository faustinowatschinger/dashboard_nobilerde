// src/dashboard/Overview/TopMoversTable.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Remove,
  Star,
  StarBorder
} from '@mui/icons-material';

const TopMoversTable = ({ topMovers = [] }) => {
  const theme = useTheme();

  // Limitar a máximo 5 elementos
  const limitedTopMovers = topMovers.slice(0, 5);

  // Debug: mostrar datos recibidos
  console.log('📊 TopMoversTable - Datos recibidos:', topMovers);
  console.log('📊 TopMoversTable - Datos limitados:', limitedTopMovers);
  console.log('📊 TopMoversTable - Primer elemento:', limitedTopMovers[0]);

  if (!limitedTopMovers || limitedTopMovers.length === 0) {
    return (
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'text.secondary',
          gap: 2,
          p: 3
        }}
      >
        <TrendingUp sx={{ fontSize: 48, opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary">
          No hay movimientos disponibles
        </Typography>
        <Typography variant="body2" color="text.disabled" textAlign="center">
          No se encontraron cambios en la popularidad
          <br />
          para el período seleccionado
        </Typography>
      </Box>
    );
  }

  // Funciones simplificadas para extraer datos del backend
  const getYerbaName = (item) => {
    return item.label || item.yerbaName || 'Yerba desconocida';
  };

  const getYerbaType = (item) => {
    return item.yerbaType || item.marca || '';
  };

  const getCurrentScore = (item) => {
    return item.currentScore || 0;
  };

  const getChangeType = (item) => {
    return item.changeType || 'stable';
  };

  const getChangeValue = (item) => {
    return item.deltaPct || 0;
  };
  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'increasing':
        return <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 16 }} />;
      case 'decreasing':
        return <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 16 }} />;
      case 'new':
        return <Star sx={{ color: theme.palette.warning.main, fontSize: 16 }} />;
      case 'inactive':
        return <Remove sx={{ color: theme.palette.grey[500], fontSize: 16 }} />;
      case 'stable':
        return <Remove sx={{ color: theme.palette.info.main, fontSize: 16 }} />;
      default:
        return <StarBorder sx={{ color: theme.palette.grey[500], fontSize: 16 }} />;
    }
  };

  // Función para obtener el color del cambio
  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increasing':
        return 'success';
      case 'decreasing':
        return 'error';
      case 'new':
        return 'warning';
      case 'inactive':
        return 'default';
      case 'stable':
        return 'info';
      default:
        return 'default';
    }
  };

  // Función para obtener el texto del cambio
  const getChangeText = (changeType, changeValue) => {
    if (changeType === 'new') return 'Nueva';
    if (changeType === 'inactive') return 'Inactiva';
    if (changeType === 'stable') return 'Estable';
    
    const sign = changeValue > 0 ? '+' : '';
    return `${sign}${changeValue}%`;
  };

  // Función para formatear el score
  const formatScore = (score) => {
    if (typeof score === 'number') {
      return score.toFixed(1);
    }
    return score || 'N/A';
  };

  return (
    <Box sx={{ width: '100%', overflow: 'auto' }}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          height: { xs: 'auto', md: 'calc(100% - 60px)' },
          bgcolor: 'transparent',
          boxShadow: 'none',
          borderRadius: 2,
          overflow: 'auto',
          maxHeight: { xs: 400, sm: 450, md: 'none' }
        }}
      >
         <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                Pos.
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                Yerba
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                Score
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                Cambio
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.12)}`,
                  fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                  py: { xs: 0.5, sm: 1 }
                }}
              >
                Tipo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {limitedTopMovers.map((item, index) => (
              <TableRow 
                key={item.yerbaId || item.id || item.name || index}
                sx={{ 
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.03) 
                  },
                  '&:nth-of-type(odd)': { 
                    bgcolor: alpha(theme.palette.background.paper, 0.5) 
                  },
                  td: { borderBottom: 'none' },
                  '& td': { py: { xs: 0.8, md: 1.2 } }
                }}
              >
                <TableCell 
                  sx={{ 
                    fontWeight: 700,
                    color: index < 3 ? 'primary.main' : 'text.secondary',
                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: index < 3 ? '1.05rem' : 'inherit' },
                    py: { xs: 0.5, sm: 0.8, md: 1.2 }
                  }}
                >
                  #{index + 1}
                </TableCell>
                
                <TableCell sx={{ py: { xs: 0.5, sm: 0.8, md: 1.2 } }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: 'text.primary',
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                      }}
                    >
                      {getYerbaName(item)}
                    </Typography>
                    {getYerbaType(item) && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' } }}
                      >
                        {getYerbaType(item)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ py: { xs: 0.5, sm: 0.8, md: 1.2 } }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 700,
                      color: getCurrentScore(item) > 7 ? 'success.main' : 
                             getCurrentScore(item) > 5 ? 'warning.main' : 'text.secondary',
                      fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
                    }}
                  >
                    {formatScore(getCurrentScore(item))}
                  </Typography>
                </TableCell>
                
                <TableCell align="center" sx={{ py: { xs: 0.5, sm: 0.8, md: 1.2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {getChangeIcon(getChangeType(item))}
                    <Chip
                      label={getChangeText(getChangeType(item), getChangeValue(item))}
                      size="small"
                      color={getChangeColor(getChangeType(item))}
                      variant="outlined"
                      sx={{
                        height: { xs: 20, sm: 24, md: 28 },
                        fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                        fontWeight: 700,
                        borderRadius: 1.5,
                        '& .MuiChip-label': {
                          px: { xs: 0.5, sm: 1 }
                        }
                      }}
                    />
                  </Box>
                </TableCell>
                
                <TableCell align="center" sx={{ py: { xs: 0.5, sm: 0.8, md: 1.2 } }}>
                  <Chip
                    label={getYerbaType(item) || 'Sin tipo'}
                    size="small"
                    variant="filled"
                    color="default"
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.75rem' },
                      height: { xs: 20, sm: 24, md: 28 },
                      fontWeight: 600,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.grey[500], 0.12),
                      color: 'text.secondary',
                      '& .MuiChip-label': {
                        px: { xs: 0.5, sm: 1 }
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       </TableContainer>
     </Box>
   );
 };
 
 export default TopMoversTable;
