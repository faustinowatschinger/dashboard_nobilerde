// src/dashboard/Overview/EmptyState.jsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Inbox,
  Search,
  FilterList,
  Refresh,
  Error,
  PrivacyTip
} from '@mui/icons-material';

const EmptyState = ({ 
  title = "No hay datos disponibles",
  description = "No se encontraron resultados para los filtros aplicados",
  action = null,
  variant = "default"
}) => {
  const theme = useTheme();

  // Configuración según el variant
  const getVariantConfig = () => {
    switch (variant) {
      case "search":
        return {
          icon: <Search sx={{ fontSize: 64, color: theme.palette.info.main }} />,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.05)
        };
      case "filters":
        return {
          icon: <FilterList sx={{ fontSize: 64, color: theme.palette.warning.main }} />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.05)
        };
      case "refresh":
        return {
          icon: <Refresh sx={{ fontSize: 64, color: theme.palette.primary.main }} />,
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.05)
        };
      case "error":
        return {
          icon: <Error sx={{ fontSize: 64, color: theme.palette.error.main }} />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.05)
        };
      case "privacy":
        return {
          icon: <PrivacyTip sx={{ fontSize: 64, color: theme.palette.warning.main }} />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.05)
        };
      case "empty":
        return {
          icon: <Inbox sx={{ fontSize: 64, color: theme.palette.grey[500] }} />,
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.05)
        };
      default:
        return {
          icon: <Inbox sx={{ fontSize: 64, color: theme.palette.grey[500] }} />,
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.05)
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8
      }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto',
          borderRadius: 3,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(config.color, 0.1)}`,
          bgcolor: config.bgColor
        }}
      >
        {/* Icono */}
        <Box sx={{ mb: 3 }}>
          {config.icon}
        </Box>

        {/* Título */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 2,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        {/* Descripción */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 4,
            lineHeight: 1.6,
            maxWidth: 400,
            mx: 'auto'
          }}
        >
          {description}
        </Typography>

        {/* Acción */}
        {action && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {action}
          </Box>
        )}

        {/* Información adicional */}
        <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.background.paper, 0.7), borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            💡 Consejos para obtener datos:
          </Typography>
          <Box sx={{ textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Verifica que los filtros de fecha estén configurados correctamente
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Intenta con períodos de tiempo más amplios
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Asegúrate de que haya actividad en la plataforma
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Contacta al administrador si el problema persiste
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default EmptyState;
