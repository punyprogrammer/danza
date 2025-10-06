// Global type declarations for runtime hacks
declare global {
  var Colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      overlay: string;
    };
    glass: {
      light: string;
      medium: string;
      dark: string;
      border: string;
      shadow: string;
    };
    blue: {
      primary: string;
      secondary: string;
      light: string;
      dark: string;
      accent: string;
    };
    red: {
      primary: string;
      secondary: string;
      light: string;
      dark: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      placeholder: string;
      error: string;
      success: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    gradients: {
      primary: string[];
      secondary: string[];
      glass: string[];
    };
  };
}

export {};
