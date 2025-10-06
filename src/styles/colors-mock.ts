// Temporary mock to bypass runtime errors while we fix all Colors references
export const Colors = {
  // Dark theme colors
  background: {
    primary: '#000000',      // Pure black
    secondary: '#1A1A1A',    // Very dark gray
    tertiary: '#2A2A2A',     // Dark gray
    overlay: 'rgba(0, 0, 0, 0.95)', // Black overlay
  },
  
  // Glass morphism colors
  glass: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    dark: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.2)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Blue accent colors (keep blue for buttons)
  blue: {
    primary: '#4285F4',      // Primary blue
    secondary: '#5A9AFF',    // Secondary blue
    light: '#7BB3FF',        // Light blue
    dark: '#1E40AF',         // Dark blue
    accent: '#60A5FA',       // Accent blue
  },
  
  // Red colors
  red: {
    primary: '#EF4444',      // Primary red
    secondary: '#F87171',    // Secondary red
    light: '#FCA5A5',        // Light red
    dark: '#DC2626',         // Dark red
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',      // Primary white text
    secondary: '#B8BCC8',    // Secondary light gray
    tertiary: '#8B92A7',     // Tertiary gray
    placeholder: '#6B7280',  // Placeholder gray
    error: '#EF4444',        // Error red
    success: '#10B981',      // Success green
  },
  
  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Gradients
  gradients: {
    primary: ['#1E40AF', '#3B82F6', '#60A5FA'],
    secondary: ['#000000', '#1A1A1A', '#2A2A2A'],
    glass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  },
};
