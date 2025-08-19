import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const EmptyState = ({ 
  title = "No hay datos suficientes para este segmento",
  description,
  threshold,
  action
}) => (
  <Box sx={{ 
    textAlign: 'center', 
    py: { xs: 6, sm: 8, md: 10 },
    px: { xs: 2, sm: 3 }
  }}>
    <Typography 
      variant="h6" 
      gutterBottom 
      sx={{ 
        fontSize: { xs: '1.1rem', sm: '1.25rem' },
        mb: { xs: 1, sm: 2 }
      }}
    >
      {title}
    </Typography>
    
    {description && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          mb: { xs: 1, sm: 2 }
        }}
      >
        {description}
      </Typography>
    )}
    
    {threshold !== undefined && (
      <Typography 
        variant="body2" 
        color="text.secondary" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '0.8rem', sm: '0.875rem' },
          mb: { xs: 1, sm: 2 }
        }}
      >
        Umbral k-anon: {threshold}
      </Typography>
    )}
    
    {action ? (
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        {action}
      </Box>
    ) : (
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        justifyContent="center" 
        sx={{ mt: { xs: 2, sm: 3 } }}
      >
        <Button 
          variant="contained"
          size={{ xs: 'small', sm: 'medium' }}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          Ampliar fechas
        </Button>
        <Button
          size={{ xs: 'small', sm: 'medium' }}
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          Quitar filtros
        </Button>
      </Stack>
    )}
  </Box>
);

export default EmptyState;
