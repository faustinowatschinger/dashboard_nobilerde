// src/dashboard/Overview/MetricCard.jsx
import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Tooltip,
  Skeleton,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import { 
  InfoOutlined,
  ArrowUpward,
  ArrowDownward,
  Remove
} from '@mui/icons-material';

const MetricCard = ({ 
  title, 
  value, 
  hint, 
  loading = false, 
  deltaText,
  trend = 'flat', // "up" | "down" | "flat"
  icon,
  color = 'primary',
  size = 'medium'
}) => {
  const theme = useTheme();

  // Colores del tema
  const colorMap = {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    error: theme.palette.error,
    warning: theme.palette.warning,
    info: theme.palette.info
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  // Tamaños del card
  const sizeMap = {
    small: { height: 120, iconSize: 24, valueSize: 'h5', titleSize: 'body2' },
    medium: { height: 140, iconSize: 32, valueSize: 'h4', titleSize: 'body1' },
    large: { height: 160, iconSize: 40, valueSize: 'h3', titleSize: 'h6' }
  };

  const selectedSize = sizeMap[size] || sizeMap.medium;

  // Funciones para manejar tendencias
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUpward sx={{ fontSize: 14 }} />;
      case 'down':
        return <ArrowDownward sx={{ fontSize: 14 }} />;
      case 'flat':
      default:
        return <Remove sx={{ fontSize: 14 }} />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'error';
      case 'flat':
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Paper 
        sx={{ 
          p: 3, 
          height: selectedSize.height, 
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={selectedSize.iconSize} height={selectedSize.iconSize} />
          <Skeleton variant="text" width="60%" sx={{ ml: 2 }} />
        </Box>
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="80%" />
      </Paper>
    );
  }

  return (
    <Paper 
      sx={{ 
        p: 3, 
        height: selectedSize.height, 
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        bgcolor: 'background.paper',
        border: `1px solid ${alpha(selectedColor.main, 0.1)}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: alpha(selectedColor.main, 0.3)
        }
      }}
    >
      {/* Header con icono y título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: selectedSize.iconSize + 8,
              height: selectedSize.iconSize + 20,
              borderRadius: '50%',
              bgcolor: alpha(selectedColor.main, 0.1),
              color: selectedColor.main,
              mr: 2
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: selectedSize.iconSize } 
            })}
          </Box>
        )}
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant={selectedSize.titleSize} 
            color="text.secondary" 
            sx={{ 
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            {title}
            {hint && (
              <Tooltip title={hint} arrow placement="top">
                <InfoOutlined sx={{ fontSize: 16, opacity: 0.6, cursor: 'help' }} />
              </Tooltip>
            )}
          </Typography>
        </Box>
      </Box>

      {/* Valor principal */}
      <Typography 
        variant={selectedSize.valueSize} 
        sx={{ 
          fontWeight: 700, 
          color: 'text.primary',
          mb: 1,
          lineHeight: 1.2
        }}
      >
        {value}
      </Typography>

      {/* Delta text como Chip si existe */}
      {deltaText && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <Chip
            icon={getTrendIcon(trend)}
            label={deltaText}
            size="small"
            color={getTrendColor(trend)}
            variant="outlined"
            sx={{
              height: 24,
              fontSize: '0.75rem',
              fontWeight: 600,
              '& .MuiChip-icon': {
                fontSize: 14,
                marginLeft: '4px'
              }
            }}
          />
        </Box>
      )}

      {/* Hint adicional si no hay delta */}
      {!deltaText && hint && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            opacity: 0.8,
            lineHeight: 1.4,
            display: 'block',
            mt: 1
          }}
        >
          {hint}
        </Typography>
      )}
    </Paper>
  );
};

export default MetricCard;
