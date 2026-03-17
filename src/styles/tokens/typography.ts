export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Roboto Mono', 'Courier New', monospace"
  },
  
  // Scale based on 1rem = 16px
  scale: {
    h1: {
      fontSize: '3rem',      // 48px
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2.25rem',   // 36px
      lineHeight: 1.25,
      fontWeight: 700,
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '1.75rem',   // 28px
      lineHeight: 1.3,
      fontWeight: 600
    },
    h4: {
      fontSize: '1.5rem',    // 24px
      lineHeight: 1.35,
      fontWeight: 600
    },
    h5: {
      fontSize: '1.25rem',   // 20px
      lineHeight: 1.4,
      fontWeight: 600
    },
    h6: {
      fontSize: '1rem',      // 16px
      lineHeight: 1.5,
      fontWeight: 600
    },
    body: {
      large: {
        fontSize: '1.125rem', // 18px
        lineHeight: 1.6,
        fontWeight: 400
      },
      regular: {
        fontSize: '1rem',     // 16px
        lineHeight: 1.6,
        fontWeight: 400
      },
      small: {
        fontSize: '0.875rem', // 14px
        lineHeight: 1.57,
        fontWeight: 400
      }
    },
    caption: {
      fontSize: '0.75rem',   // 12px
      lineHeight: 1.5,
      fontWeight: 400,
      letterSpacing: '0.02em'
    },
    button: {
      large: {
        fontSize: '1rem',
        lineHeight: 1.5,
        fontWeight: 600,
        letterSpacing: '0.02em'
      },
      medium: {
        fontSize: '0.875rem',
        lineHeight: 1.43,
        fontWeight: 600,
        letterSpacing: '0.02em'
      },
      small: {
        fontSize: '0.75rem',
        lineHeight: 1.33,
        fontWeight: 600,
        letterSpacing: '0.02em'
      }
    },
    label: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      fontWeight: 500,
      letterSpacing: '0.02em'
    }
  }
};

export type Typography = typeof typography;