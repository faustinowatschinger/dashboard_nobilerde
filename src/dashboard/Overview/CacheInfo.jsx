// src/dashboard/Overview/CacheInfo.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert
} from '@mui/material';
import { 
  Info, 
  Refresh, 
  Storage,
  AccessTime,
  Clear 
} from '@mui/icons-material';
import metricsService from '../../services/metricsService.js';

const CacheInfo = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Determinar el color del chip según el estado del cache
  const getChipColor = () => {
    if (!data?._meta) return 'default';
    
    switch (data._meta.source) {
      case 'cache':
        return 'success';
      case 'calculated':
        return 'primary';
      case 'cache-fallback':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Obtener el texto del chip
  const getChipText = () => {
    if (!data?._meta) return 'Datos';
    
    switch (data._meta.source) {
      case 'cache':
        return 'Desde cache';
      case 'calculated':
        return 'Calculado';
      case 'cache-fallback':
        return 'Cache (fallback)';
      default:
        return 'Datos';
    }
  };

  // Formatear timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'No disponible';
    return new Date(timestamp).toLocaleString('es-AR');
  };

  // Formatear duración
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return 'No disponible';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Cargar estadísticas del cache
  const loadCacheStats = async () => {
    setLoading(true);
    try {
      const stats = await metricsService.fetchCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar cache
  const handleClearCache = async () => {
    try {
      await metricsService.clearCache();
      await loadCacheStats(); // Recargar estadísticas
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  // Cargar estadísticas cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      loadCacheStats();
    }
  }, [open]);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          size="small"
          color={getChipColor()}
          label={getChipText()}
          icon={<Storage />}
        />
        
        {data?._meta?.lastUpdate && (
          <Tooltip title={`Última actualización: ${formatTimestamp(data._meta.lastUpdate)}`}>
            <Chip
              size="small"
              variant="outlined"
              label={formatDuration(Date.now() - data._meta.lastUpdate)}
              icon={<AccessTime />}
            />
          </Tooltip>
        )}

        <Tooltip title="Ver estadísticas del cache">
          <IconButton 
            size="small" 
            onClick={() => setOpen(true)}
          >
            <Info />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Cache de Métricas
            <Box>
              <IconButton onClick={loadCacheStats} disabled={loading}>
                <Refresh />
              </IconButton>
              <Button
                startIcon={<Clear />}
                onClick={handleClearCache}
                color="warning"
                variant="outlined"
                size="small"
                sx={{ ml: 1 }}
              >
                Limpiar Cache
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {data?._meta?.warning && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {data._meta.warning}
            </Alert>
          )}

          <Box mb={3}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Estado Actual
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Fuente de datos"
                  secondary={data?._meta?.source || 'No disponible'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Desde cache"
                  secondary={data?._meta?.cached ? 'Sí' : 'No'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Última actualización"
                  secondary={formatTimestamp(data?._meta?.lastUpdate)}
                />
              </ListItem>
            </List>
          </Box>

          {cacheStats && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                Estadísticas del Cache
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Entradas en cache"
                    secondary={cacheStats.size}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Intervalo de actualización"
                    secondary={formatDuration(cacheStats.updateInterval)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Actualizando"
                    secondary={cacheStats.isUpdating ? 'Sí' : 'No'}
                  />
                </ListItem>
              </List>

              {cacheStats.lastUpdateTimes && Object.keys(cacheStats.lastUpdateTimes).length > 0 && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Última actualización por filtro:
                  </Typography>
                  <List dense>
                    {Object.entries(cacheStats.lastUpdateTimes).map(([key, info]) => (
                      <ListItem key={key}>
                        <ListItemText
                          primary={key.replace(/\|/g, ' → ')}
                          secondary={`${formatTimestamp(info.timestamp)} (hace ${formatDuration(info.age)})`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CacheInfo;
