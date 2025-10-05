export interface ColorTheme {
  // Background Colors
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    modal: string;
    overlay: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    placeholder: string;
    inverse: string;
  };
  
  // Status Colors
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  // Accent Colors
  accent: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  
  // Glass Effect Colors
  glass: {
    background: string;
    border: string;
    shadow: string;
  };
  
  // Interactive Colors
  interactive: {
    hover: string;
    pressed: string;
    disabled: string;
    focus: string;
  };
}

export const lightTheme: ColorTheme = {
  background: {
    primary: '#FFFFFF',        // Pure white background
    secondary: '#F8FAFC',      // Very light gray
    tertiary: '#F1F5F9',       // Light gray
    card: '#FFFFFF',           // White cards
    modal: 'rgba(255, 255, 255, 0.95)', // Semi-transparent white
    overlay: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  
  text: {
    primary: '#1E293B',        // Dark slate
    secondary: '#64748B',      // Medium slate
    tertiary: '#94A3B8',       // Light slate
    placeholder: '#CBD5E1',    // Very light slate
    inverse: '#FFFFFF',        // White text
  },
  
  status: {
    success: '#10B981',        // Emerald
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',           // Blue
  },
  
  accent: {
    primary: '#3B82F6',        // Blue
    secondary: '#8B5CF6',      // Violet
    tertiary: '#EC4899',       // Pink
  },
  
  glass: {
    background: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(203, 213, 225, 0.3)',
    shadow: '#000000',
  },
  
  interactive: {
    hover: 'rgba(59, 130, 246, 0.1)',
    pressed: 'rgba(59, 130, 246, 0.2)',
    disabled: 'rgba(148, 163, 184, 0.5)',
    focus: 'rgba(59, 130, 246, 0.3)',
  },
};

export const darkTheme: ColorTheme = {
  background: {
    primary: '#1A1D29',        // Dark blue-gray
    secondary: '#242938',      // Slightly lighter
    tertiary: '#2D3142',       // Medium dark
    card: '#242938',           // Dark cards
    modal: 'rgba(26, 29, 41, 0.95)', // Semi-transparent dark
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark overlay
  },
  
  text: {
    primary: '#FFFFFF',        // White
    secondary: '#B8BCC8',      // Light gray
    tertiary: '#8B8F9A',       // Medium gray
    placeholder: '#5A5D68',    // Dark gray
    inverse: '#1E293B',        // Dark text
  },
  
  status: {
    success: '#10B981',        // Emerald
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',           // Blue
  },
  
  accent: {
    primary: '#60A5FA',        // Light blue
    secondary: '#A78BFA',      // Light violet
    tertiary: '#F472B6',       // Light pink
  },
  
  glass: {
    background: 'rgba(44, 49, 68, 0.95)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '#000000',
  },
  
  interactive: {
    hover: 'rgba(96, 165, 250, 0.1)',
    pressed: 'rgba(96, 165, 250, 0.2)',
    disabled: 'rgba(139, 143, 154, 0.5)',
    focus: 'rgba(96, 165, 250, 0.3)',
  },
};

export const getThemeColors = (theme: 'light' | 'dark'): ColorTheme => {
  return theme === 'light' ? lightTheme : darkTheme;
};
