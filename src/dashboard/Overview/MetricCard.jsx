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
  , sx
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
    small: { 
      height: { xs: 100, sm: 120 }, 
      iconSize: { xs: 20, sm: 24 }, 
      valueSize: { xs: 'h6', sm: 'h5' }, 
      titleSize: { xs: 'caption', sm: 'body2' }
    },
    medium: { 
      height: { xs: 110, sm: 140 }, 
      iconSize: { xs: 24, sm: 32 }, 
      valueSize: { xs: 'h5', sm: 'h4' }, 
      titleSize: { xs: 'body2', sm: 'body1' }
    },
    large: { 
      height: { xs: 120, sm: 160 }, 
      iconSize: { xs: 32, sm: 40 }, 
      valueSize: { xs: 'h4', sm: 'h3' }, 
      titleSize: { xs: 'body1', sm: 'h6' }
    }
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
          p: { xs: 1, sm: 2, md: 3 }, 
          minHeight: { xs: 90, sm: 110, md: selectedSize.height }, 
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 2 } }}>
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
      sx={[
        {
          p: { xs: 1, sm: 2, md: 3 }, 
          // Consolidated responsive minHeight to avoid duplicates
          minHeight: { xs: 90, sm: 110, md: selectedSize.height }, 
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(selectedColor.main, 0.08)}`,
          background: `linear-gradient(180deg, ${alpha(selectedColor.light || selectedColor.main, 0.02)} 0%, transparent 60%)`,
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[6],
            borderColor: alpha(selectedColor.main, 0.22)
          },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        },
        sx
      ]}
    >
      {/* Header con icono y título */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 0.5, sm: 1, md: 2 } }}>
        {icon && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: { xs: 28, sm: 36, md: selectedSize.iconSize + 12 },
              height: { xs: 28, sm: 36, md: selectedSize.iconSize + 12 },
              borderRadius: 2,
              bgcolor: alpha(selectedColor.main, 0.12),
              color: selectedColor.main,
              mr: { xs: 1, sm: 2 },
              boxShadow: `inset 0 -2px 0 ${alpha(selectedColor.dark || selectedColor.main, 0.03)}`
            }}
          >
            {React.cloneElement(icon, { 
              sx: { fontSize: { xs: 16, sm: 20, md: selectedSize.iconSize } } 
            })}
          </Box>
        )}
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant={selectedSize.titleSize} 
            color="text.secondary" 
            sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              letterSpacing: '0.2px',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: 'inherit' }
            }}
          >
            {title}
            {hint && (
              <Tooltip title={hint} arrow placement="top">
                <InfoOutlined sx={{ fontSize: { xs: 12, sm: 14, md: 16 }, opacity: 0.7, cursor: 'help' }} />
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
          mb: { xs: 0.5, sm: 1 },
          lineHeight: 1.1,
          fontSize: { xs: '1.1rem', sm: '1.25rem', md: 'inherit' }
        }}
      >
        {value}
      </Typography>

      {/* Delta text como Chip si existe */}
      {deltaText && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: { xs: 0.5, sm: 1 } }}>
          <Chip
            icon={getTrendIcon(trend)}
            label={deltaText}
            size="small"
            color={getTrendColor(trend)}
            variant="outlined"
            sx={{
              height: { xs: 24, sm: 28 },
              fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.78rem' },
              fontWeight: 700,
              borderRadius: 1.5,
              '& .MuiChip-icon': {
                fontSize: { xs: 12, sm: 14 }
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
            opacity: 0.9,
            lineHeight: 1.5,
            display: 'block',
            mt: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.6rem', sm: '0.7rem', md: 'inherit' }
          }}
        >
          {hint}
        </Typography>
      )}
    </Paper>
  );
};

export default MetricCard;
