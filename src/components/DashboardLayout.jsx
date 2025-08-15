// src/components/DashboardLayout.jsx
import React from 'react';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  useTheme,
  Paper,
  Chip
} from '@mui/material';
import {
  Dashboard,
  TrendingUp,
  LocalDrink,
  BusinessCenter,
  Explore,
  Public,
  Group,
  NotificationsActive,
  Analytics
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const navigationItems = [
  {
    title: 'Resumen General',
    path: '/dashboard/overview',
    icon: <Dashboard />,
    description: 'Vista general del dashboard'
  },
  {
    title: 'Tendencias de Mercado',
    path: '/dashboard/market-trends',
    icon: <TrendingUp />,
    description: 'Análisis de tendencias'
  },
  {
    title: 'Análisis de Sabores',
    path: '/dashboard/flavors',
    icon: <LocalDrink />,
    description: 'Perfiles de sabor'
  },
  {
    title: 'Comparación de Marcas',
    path: '/dashboard/brands',
    icon: <BusinessCenter />,
    description: 'Performance de marcas'
  },
  {
    title: 'Descubrimiento vs Fidelidad',
    path: '/dashboard/discovery',
    icon: <Explore />,
    description: 'Patrones de consumo'
  },
  {
    title: 'Análisis Geográfico',
    path: '/dashboard/geography',
    icon: <Public />,
    description: 'Distribución por regiones'
  },
  {
    title: 'Análisis de Audiencia',
    path: '/dashboard/audience',
    icon: <Group />,
    description: 'Demografía y comportamiento'
  },
  {
    title: 'Alertas y Experimentos',
    path: '/dashboard/alerts',
    icon: <NotificationsActive />,
    description: 'Monitoreo y tests'
  }
];

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.title : 'Dashboard';
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer - 1
        }}
      >
        <Toolbar>
          <Analytics sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getCurrentPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Header del Sidebar */}
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <LocalDrink />
            Nobilerde
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Dashboard de Analytics
          </Typography>
        </Box>

        <Divider />

        {/* Navigation List */}
        <List sx={{ px: 2, py: 1 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isComingSoon = item.path !== '/dashboard/overview' && item.path !== '/dashboard/market-trends';
            
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  disabled={isComingSoon}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    '&.Mui-disabled': {
                      opacity: 0.6,
                      '& .MuiListItemIcon-root': {
                        opacity: 0.6,
                      },
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isActive ? 'primary.contrastText' : 'text.secondary',
                      minWidth: 40 
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.title}
                    secondary={isComingSoon ? 'Próximamente' : item.description}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.75rem',
                      color: isActive ? 'primary.contrastText' : 'text.secondary',
                      sx: { opacity: isActive ? 0.8 : 0.6 }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer del Sidebar */}
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Paper 
            sx={{ 
              p: 2, 
              bgcolor: 'background.default',
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Dashboard v1.0.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Datos actualizados en tiempo real
            </Typography>
          </Paper>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          pt: 8, // App bar height
          px: 3,
          py: 2
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
