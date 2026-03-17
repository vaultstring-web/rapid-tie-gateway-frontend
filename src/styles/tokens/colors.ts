export const colors = {
  // Primary Brand Colors - Rapid Tie
  primary: {
    green: {
      50: '#f0f9eb',
      100: '#d9f0d0',
      200: '#b8e2a8',
      300: '#8bcf75',
      400: '#5fba4c',
      500: '#448a33', // Rapid Tie Primary Green
      600: '#367028',
      700: '#2c5720',
      800: '#234419',
      900: '#1b3614',
    },
    blue: {
      50: '#f0f5f6',
      100: '#d5e4e7',
      200: '#b3cdd4',
      300: '#8ab1bc',
      400: '#6395a3',
      500: '#3b5a65', // Rapid Tie Secondary Blue
      600: '#314c55',
      700: '#273e45',
      800: '#1e3137',
      900: '#16252a',
    }
  },
  
  // Semantic Colors (WCAG 2.1 AA Compliant)
  semantic: {
    success: {
      light: '#d4edda',
      main: '#28a745',
      dark: '#1e7e34',
      text: '#155724'
    },
    error: {
      light: '#f8d7da',
      main: '#dc3545',
      dark: '#c82333',
      text: '#721c24'
    },
    warning: {
      light: '#fff3cd',
      main: '#ffc107',
      dark: '#e0a800',
      text: '#856404'
    },
    info: {
      light: '#d1ecf1',
      main: '#17a2b8',
      dark: '#138496',
      text: '#0c5460'
    }
  },
  
  // Neutral Grayscale
  neutral: {
    0: '#ffffff',
    50: '#f8f9fa',
    100: '#f1f3f5',
    200: '#e9ecef',
    300: '#dee2e6',
    400: '#ced4da',
    500: '#adb5bd',
    600: '#6c757d',
    700: '#495057',
    800: '#343a40',
    900: '#212529',
    1000: '#000000'
  },
  
  // Dark Mode Variants
  dark: {
    background: '#121212',
    surface: '#1e1e1e',
    primary: '#5baa46', // Adjusted for dark mode
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#666666'
    }
  }
};

export type Colors = typeof colors;