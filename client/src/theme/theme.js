import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: "'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5', // Indigo 600
      light: '#818CF8',
      dark: '#3730A3',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0EA5E9', // Sky 500
      light: '#38BDF8',
      dark: '#0284C7',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Emerald 500
      light: '#34D399',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F43F5E', // Rose 500
      light: '#FB7185',
      dark: '#E11D48',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Amber 500
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    info: {
      main: '#6366F1', // Indigo 500
      light: '#A5B4FC',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Slate 50
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Slate 900
      secondary: '#475569', // Slate 600
      disabled: '#94A3B8', // Slate 400
    },
    divider: '#E2E8F0', // Slate 200
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
});
