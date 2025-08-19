// src/dashboard/Overview/LoadingSkeleton.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Skeleton,
  Paper,
  Typography
} from '@mui/material';
import { 
  TrendingUp, 
  People, 
  Event, 
  Analytics,
  Timeline,
  PieChart
} from '@mui/icons-material';

const LoadingSkeleton = () => {
  // const theme = useTheme(); // Not used currently

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default', 
      py: { xs: 1, sm: 2, md: 3 },
      px: { xs: 1, sm: 2, md: 3 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        {/* Header skeleton */}
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={1} />
        </Box>
        
        {/* Filters skeleton */}
        <Skeleton variant="rectangular" width="100%" height={{ xs: 120, sm: 80 }} sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }} />
        
        {/* KPI Cards skeleton */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          {[1, 2, 3, 4].map((index) => (
            <Grid key={index} item xs={12} sm={6} lg={3}>
              <Skeleton variant="rectangular" width="100%" height={{ xs: 100, sm: 120 }} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
        
        {/* Chart skeleton */}
        <Skeleton variant="rectangular" width="100%" height={{ xs: 280, sm: 320, md: 400 }} sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }} />
        
        {/* Bottom charts skeleton */}
        <Grid container spacing={{ xs: 2, sm: 3 }} direction="column">
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={{ xs: 250, sm: 300, lg: 400 }} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" width="100%" height={{ xs: 200, sm: 250, lg: 350 }} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoadingSkeleton;
