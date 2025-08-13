import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

const LoadingSkeleton = () => (
  <Box>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
      <Skeleton variant="rectangular" width={120} height={40} />
    </Stack>
    <Skeleton variant="rectangular" height={400} />
  </Box>
);

export default LoadingSkeleton;
