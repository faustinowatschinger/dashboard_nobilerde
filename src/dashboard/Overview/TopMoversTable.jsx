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
    <Box sx={{ height: '100%', width: '100%' }}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          height: 'calc(100% - 60px)',
          bgcolor: 'transparent',
          boxShadow: 'none'
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`
                }}
              >
                Posición
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`
                }}
              >
                Yerba
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`
                }}
              >
                Score
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`
                }}
              >
                Cambio
              </TableCell>
              <TableCell 
                align="center"
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `2px solid ${theme.palette.primary.main}`
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
                    bgcolor: alpha(theme.palette.primary.main, 0.02) 
                  },
                  '&:nth-of-type(odd)': { 
                    bgcolor: alpha(theme.palette.background.paper, 0.5) 
                  }
                }}
              >
                <TableCell 
                  sx={{ 
                    fontWeight: 600,
                    color: index < 3 ? 'primary.main' : 'text.secondary',
                    fontSize: index < 3 ? '1.1rem' : 'inherit'
                  }}
                >
                  #{index + 1}
                </TableCell>
                
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {getYerbaName(item)}
                    </Typography>
                    {getYerbaType(item) && (
                      <Typography variant="caption" color="text.secondary">
                        {getYerbaType(item)}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      color: getCurrentScore(item) > 7 ? 'success.main' : 
                             getCurrentScore(item) > 5 ? 'warning.main' : 'text.secondary'
                    }}
                  >
                    {formatScore(getCurrentScore(item))}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {getChangeIcon(getChangeType(item))}
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: getChangeColor(getChangeType(item)) === 'success' ? 'success.main' :
                               getChangeColor(getChangeType(item)) === 'error' ? 'error.main' :
                               getChangeColor(getChangeType(item)) === 'warning' ? 'warning.main' : 'text.secondary'
                      }}
                    >
                      {getChangeText(getChangeType(item), getChangeValue(item))}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Chip
                    label={getChangeType(item) || 'unknown'}
                    size="small"
                    color={getChangeColor(getChangeType(item))}
                    variant="outlined"
                    sx={{ 
                      textTransform: 'capitalize',
                      fontSize: '0.7rem',
                      fontWeight: 600
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
