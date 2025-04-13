import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral?: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#fe5000',
      light: '#ff7333',
      dark: '#c23d00',
    },
    secondary: {
      main: '#0c215e',
      light: '#1c3c8c',
      dark: '#060d33',
    },
    neutral: {
      main: '#64748B',
      light: '#94A3B8',
      dark: '#475569',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#0c215e',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#0c215e',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#0c215e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
