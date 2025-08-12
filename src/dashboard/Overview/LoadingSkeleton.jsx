// src/dashboard/Overview/LoadingSkeleton.jsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Skeleton,
  Paper,
  Typography,
  useTheme
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
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        {/* Header del Dashboard */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Skeleton variant="text" width={300} height={48} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={400} height={24} />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 2 }} />
            </Box>
          </Box>
          
          <Skeleton variant="rectangular" width="100%" height={1} />
        </Box>

        {/* Barra de filtros */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1, ml: 'auto' }} />
          </Box>
          
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
          </Grid>
        </Paper>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                <Skeleton variant="text" width="60%" height={20} />
              </Box>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={16} />
            </Paper>
          </Grid>
        </Grid>

        {/* Gráfico de tendencia temporal */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: theme.shadows[1] }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Timeline sx={{ color: 'primary.main' }} />
                <Skeleton variant="text" width={200} height={24} />
              </Box>
              <Skeleton variant="text" width={300} height={20} />
            </Box>
            
            <Skeleton variant="rectangular" width={120} height={24} sx={{ borderRadius: 1 }} />
          </Box>
          
          <Box sx={{ height: 400, width: '100%' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
          </Box>
        </Paper>

        {/* Distribución por tipos y Top movers */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 3, height: 450, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PieChart sx={{ color: 'primary.main' }} />
                <Skeleton variant="text" width={250} height={24} />
              </Box>
              <Box sx={{ height: 'calc(100% - 60px)' }}>
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
              </Box>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper sx={{ p: 3, height: 450, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUp sx={{ color: 'primary.main' }} />
                <Skeleton variant="text" width={200} height={24} />
              </Box>
              <Box sx={{ height: 'calc(100% - 60px)' }}>
                <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Información adicional */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Skeleton variant="text" width="60%" height={48} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <Skeleton variant="text" width={150} height={24} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoadingSkeleton;
