export const theme = {
  colors: {
    // Background colors
    bgPrimary: '#0a192f',      // Dark navy blue
    bgSecondary: '#112240',    // Slightly lighter navy
    bgCard: 'rgba(17, 34, 64, 0.7)', // Semi-transparent card background
    bgGlass: 'rgba(255, 255, 255, 0.05)', // Subtle glass effect
    
    // Text colors
    textPrimary: '#e6f1ff',    // Bright white
    textSecondary: '#8892b0',  // Muted blue-gray
    textMuted: '#8892b0',      // Muted text
    
    // Accent colors
    accent: '#64ffda',         // Bright cyan
    accentLight: '#88ffea',    // Light cyan
    accentGlow: 'rgba(100, 255, 218, 0.3)',
    highlightTransparent: 'rgba(100, 255, 218, 0.1)',
    
    // Secondary colors
    neonPink: '#ff6b6b',       // Coral pink
    neonPurple: '#bd93f9',     // Soft purple
    neonBlue: '#8be9fd',       // Light blue
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #0a192f 0%, #112240 100%)',
    accent: 'linear-gradient(45deg, #64ffda, #88ffea)',
    glass: 'linear-gradient(45deg, rgba(100, 255, 218, 0.1), rgba(255, 255, 255, 0.05))',
    neon: 'linear-gradient(45deg, #64ffda, #ff6b6b)',
  },
  
  shadows: {
    glow: '0 0 20px rgba(100, 255, 218, 0.2)',
    card: '0 4px 20px rgba(0, 0, 0, 0.2)',
    neonGlow: '0 0 20px rgba(255, 107, 107, 0.2)',
  },
  
  transitions: {
    default: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '20px',
    circle: '50%',
  },
}; 