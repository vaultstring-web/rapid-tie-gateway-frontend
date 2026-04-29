export const spacing = {
  // Base unit: 4px
  unit: 4,
  
  // Scale (in pixels, convert to rem/em as needed)
  scale: {
    xs: 4,    // 0.25rem
    sm: 8,    // 0.5rem
    md: 16,   // 1rem
    lg: 24,   // 1.5rem
    xl: 32,   // 2rem
    '2xl': 48, // 3rem
    '3xl': 64, // 4rem
    '4xl': 80  // 5rem
  },
  
  // Layout tokens
  layout: {
    container: {
      maxWidth: '1200px',
      padding: {
        mobile: '1rem',
        desktop: '2rem'
      }
    },
    section: {
      vertical: {
        xs: '2rem',
        sm: '3rem',
        md: '4rem',
        lg: '6rem'
      }
    },
    grid: {
      gap: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem'
      }
    }
  }
};

export type Spacing = typeof spacing;