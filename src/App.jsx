import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import palette from './theme/palette.js';
import DashboardRoutes from './routes/DashboardRoutes.jsx';
import './landing/LandingPage.css';

// Crear tema de Material-UI con nuestra paleta
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: palette.primary,
    secondary: palette.accent,
    background: palette.background,
    text: palette.text,
    divider: palette.divider,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    info: palette.info,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <DashboardRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
