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
  Chip,
  Tooltip,
  useMediaQuery,
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
  Analytics,
  Grass,
  Comment
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
    title: 'Listado de Yerbas',
    path: '/dashboard/yerbas',
    icon: <Grass />,
    description: 'Métricas por yerba'
  },
  {
    title: 'Comentarios Top',
    path: '/dashboard/notes',
    icon: <Comment />,
    description: 'Top 5 comentarios por engagement'
  },
];

const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Compact mode: hide labels and reduce drawer width under ~710px
  const isCompact = useMediaQuery('(max-width:710px)');
  const compactWidth = 64;
  const currentDrawerWidth = isCompact ? compactWidth : drawerWidth;

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
          width: `calc(100% - ${currentDrawerWidth}px)`,
          ml: `${currentDrawerWidth}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          zIndex: theme.zIndex.drawer - 1,
          transition: 'width 220ms ease, margin-left 220ms ease'
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
          width: currentDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: `1px solid ${theme.palette.divider}`,
            overflowX: 'hidden',
            transition: 'width 220ms ease'
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* Header del Sidebar */}
        <Box sx={{ p: 3 }}>
            <img src="../../public/imagenes/logo.png" alt="Nobilerde Logo" width={64} height={64} />
        </Box>

        <Divider />

        {/* Navigation List */}
        <List sx={{ px: 2, py: 1 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isComingSoon = !['/dashboard/overview', '/dashboard/market-trends', '/dashboard/yerbas', '/dashboard/notes'].includes(item.path);

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                { /* Render button with tooltip in compact mode */ }
                {(() => {
                  const button = (
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      disabled={isComingSoon}
                      sx={{
                        borderRadius: 2,
                        minHeight: 48,
                        justifyContent: isCompact ? 'center' : 'flex-start',
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
                        px: isCompact ? 1 : 2
                      }}
                    >
                      <ListItemIcon 
                        sx={{ 
                          color: isActive ? 'primary.contrastText' : 'text.secondary',
                          minWidth: isCompact ? 0 : 40,
                          justifyContent: 'center'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCompact && (
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
                      )}
                    </ListItemButton>
                  );

                  return isCompact ? (
                    <Tooltip key={item.path} title={item.title} placement="right">
                      {button}
                    </Tooltip>
                  ) : button;
                })()}
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
              border: `1px solid ${theme.palette.divider}`,
              display: isCompact ? 'none' : 'block'
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
