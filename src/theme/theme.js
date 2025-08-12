// src/theme/theme.js
import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

// A custom theme for this app
const theme = createTheme({
  palette: palette,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: palette.text.primary,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      color: palette.text.primary,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: palette.text.primary,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: palette.text.primary,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: palette.text.primary,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: palette.text.primary,
    },
    body1: {
      fontSize: '1rem',
      color: palette.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      color: palette.text.secondary,
    },
    caption: {
      fontSize: '0.75rem',
      color: palette.text.disabled,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          backgroundColor: palette.background.paper,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
        containedPrimary: {
          boxShadow: `0px 4px 12px ${palette.primary.light}50`,
          '&:hover': {
            boxShadow: `0px 6px 16px ${palette.primary.light}70`,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
          color: palette.text.primary,
        },
      },
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                backgroundColor: palette.background.default,
                borderRight: 'none',
            }
        }
    }
  },
});

export default theme;
