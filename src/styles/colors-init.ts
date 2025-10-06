// Colors initialization - ensures Colors is available globally
import { Colors } from './colors';

// Make Colors available globally
(global as any).Colors = Colors;

// Also make it available on window for web compatibility
if (typeof window !== 'undefined') {
  (window as any).Colors = Colors;
}

export { Colors };
