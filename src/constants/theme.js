/**
 * Constantes de tema y diseño
 */

export const COLORS = {
  // Colores principales
  primary: {
    main: '#2563EB', // Azul principal
    light: '#3B82F6',
    dark: '#1D4ED8',
    gradient: 'from-[#2563EB] to-[#1D4ED8]'
  },
  secondary: {
    main: '#39A900', // Verde principal
    light: '#4CAF50',
    dark: '#2D8C00',
    gradient: 'from-[#39A900] to-[#2D8C00]'
  },
  accent: {
    main: '#6366F1', // Índigo para acentos
    light: '#818CF8',
    dark: '#4F46E5'
  },
  // Colores de estado
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669'
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706'
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626'
  },
  // Colores neutros
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  },
  // Colores de texto
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF'
  },
  // Colores de fondo
  background: {
    default: '#FFFFFF',
    paper: '#F9FAFB',
    dark: '#1F2937'
  }
};

export const BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const ANIMATIONS = {
  transition: {
    default: 'transition-all duration-300 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out'
  },
  hover: {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-lg hover:shadow-primary/20'
  }
};

export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  inner: 'shadow-inner',
  none: 'shadow-none',
  custom: {
    card: 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]',
    button: 'shadow-[0_4px_14px_0_rgba(0,118,255,0.39)]',
    modal: 'shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
  }
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

export const SPACING = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem'
};

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px'
};

export const Z_INDEX = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modal: '1040',
  popover: '1050',
  tooltip: '1060'
}; 