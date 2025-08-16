import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

const EmptyState = ({ threshold }) => (
  <Box sx={{ textAlign: 'center', py: 10 }}>
    <Typography variant="h6" gutterBottom>
      No hay datos suficientes para este segmento
    </Typography>
    {threshold !== undefined && (
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Umbral k-anon: {threshold}
      </Typography>
    )}
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
      <Button variant="contained">Ampliar fechas</Button>
      <Button>Quitar filtros</Button>
    </Stack>
  </Box>
);

export default EmptyState;
