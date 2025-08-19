import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

const LoadingSkeleton = () => (
  <Box sx={{ p: { xs: 1, sm: 2 } }}>
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={{ xs: 1, sm: 2 }} 
      sx={{ mb: { xs: 2, sm: 3 } }}
    >
      <Skeleton 
        variant="rectangular" 
        width={{ xs: '100%', sm: 120 }} 
        height={{ xs: 32, sm: 40 }}
        sx={{ borderRadius: 1 }}
      />
      <Skeleton 
        variant="rectangular" 
        width={{ xs: '100%', sm: 120 }} 
        height={{ xs: 32, sm: 40 }}
        sx={{ borderRadius: 1 }}
      />
      <Skeleton 
        variant="rectangular" 
        width={{ xs: '100%', sm: 120 }} 
        height={{ xs: 32, sm: 40 }}
        sx={{ borderRadius: 1 }}
      />
    </Stack>
    <Skeleton 
      variant="rectangular" 
      height={{ xs: 250, sm: 350, md: 400 }}
      sx={{ borderRadius: 2 }}
    />
  </Box>
);

export default LoadingSkeleton;
