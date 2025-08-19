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

  // Use title and description props, ignore unused ones
  const displayTitle = title || "No hay datos";
  const displayDescription = description || "Intenta cambiar los filtros o el rango de fechas.";

  // Configuración según el variant
  const getVariantConfig = () => {
    switch (variant) {
      case "search":
        return {
          icon: <Search sx={{ fontSize: 64, color: theme.palette.info.main }} />,
          color: theme.palette.info.main,
          bgColor: alpha(theme.palette.info.main, 0.04)
        };
      case "filters":
        return {
          icon: <FilterList sx={{ fontSize: 64, color: theme.palette.warning.main }} />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.04)
        };
      case "refresh":
        return {
          icon: <Refresh sx={{ fontSize: 64, color: theme.palette.primary.main }} />,
          color: theme.palette.primary.main,
          bgColor: alpha(theme.palette.primary.main, 0.04)
        };
      case "error":
        return {
          icon: <Error sx={{ fontSize: 64, color: theme.palette.error.main }} />,
          color: theme.palette.error.main,
          bgColor: alpha(theme.palette.error.main, 0.04)
        };
      case "privacy":
        return {
          icon: <PrivacyTip sx={{ fontSize: 64, color: theme.palette.warning.main }} />,
          color: theme.palette.warning.main,
          bgColor: alpha(theme.palette.warning.main, 0.04)
        };
      case "empty":
        return {
          icon: <Inbox sx={{ fontSize: 64, color: theme.palette.grey[500] }} />,
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.04)
        };
      default:
        return {
          icon: <Inbox sx={{ fontSize: 64, color: theme.palette.grey[500] }} />,
          color: theme.palette.grey[500],
          bgColor: alpha(theme.palette.grey[500], 0.04)
        };
    }
  };

  const config = getVariantConfig();

  return (
    <Box sx={{ 
      py: { xs: 4, sm: 5, md: 6 }, 
      px: { xs: 2, sm: 3 },
      textAlign: 'center', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: { xs: 200, sm: 250, md: 300 }
    }}>
      {config.icon}
      <Typography variant="h6" sx={{ 
        mb: 1,
        mt: 2,
        fontSize: { xs: '1.1rem', sm: '1.25rem' }
      }}>
        {displayTitle}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{
        fontSize: { xs: '0.8rem', sm: '0.875rem' },
        maxWidth: { xs: '90%', sm: '70%' }
      }}>
        {displayDescription}
      </Typography>
      {action && (
        <Box sx={{ mt: 3 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

export default EmptyState;
