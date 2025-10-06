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
    backgroundLight: string;
    backgroundHeavy: string;
    border: string;
    borderLight: string;
    shadow: string;
    backdrop: string;
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
    backgroundLight: 'rgba(255, 255, 255, 0.75)',
    backgroundHeavy: 'rgba(255, 255, 255, 0.92)',
    border: 'rgba(203, 213, 225, 0.35)',
    borderLight: 'rgba(203, 213, 225, 0.25)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    backdrop: 'rgba(0, 0, 0, 0.08)',
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
    primary: '#000000',        // Pure black
    secondary: '#1A1A1A',      // Very dark gray
    tertiary: '#2A2A2A',       // Dark gray
    card: '#1A1A1A',           // Dark cards
    modal: 'rgba(0, 0, 0, 0.95)', // Semi-transparent black
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark overlay
  },

  text: {
    primary: '#FFFFFF',        // White
    secondary: '#CCCCCC',      // Light gray
    tertiary: '#999999',       // Medium gray
    placeholder: '#666666',    // Dark gray
    inverse: '#000000',        // Black text
  },

  status: {
    success: '#10B981',        // Emerald
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#6B7280',           // Gray instead of blue
  },

  accent: {
    primary: '#4285F4',        // Blue accent (same as in Colors)
    secondary: '#E5E5E5',      // Light gray
    tertiary: '#CCCCCC',       // Medium gray
  },

  glass: {
    background: 'rgba(0, 0, 0, 0.85)',
    backgroundLight: 'rgba(255, 255, 255, 0.08)', // Lighter glass effect for input fields
    backgroundHeavy: 'rgba(0, 0, 0, 0.92)',
    border: 'rgba(255, 255, 255, 0.15)',
    borderLight: 'rgba(255, 255, 255, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(255, 255, 255, 0.05)',
  },

  interactive: {
    hover: 'rgba(66, 133, 244, 0.1)',
    pressed: 'rgba(66, 133, 244, 0.2)',
    disabled: 'rgba(153, 153, 153, 0.5)',
    focus: 'rgba(66, 133, 244, 0.3)',
  },
};

export const getThemeColors = (theme: 'light' | 'dark'): ColorTheme => {
  return theme === 'light' ? lightTheme : darkTheme;
};
