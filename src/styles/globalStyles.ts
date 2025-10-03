import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from './colors';

const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  
  // Glass morphism styles
  glassCard: {
    backgroundColor: Colors.glass.medium,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  glassInput: {
    backgroundColor: Colors.glass.light,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  glassButton: {
    backgroundColor: Colors.glass.medium,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: Colors.blue.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.blue.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  socialButton: {
    backgroundColor: Colors.glass.light,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Text styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  
  bodyText: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  
  placeholder: {
    fontSize: 16,
    color: Colors.text.placeholder,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blue.primary,
    textAlign: 'center',
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  marginTop: {
    marginTop: 16,
  },
  
  // Card styles
  card: {
    backgroundColor: Colors.glass.medium,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    padding: 20,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  
  // Tag/Chip styles
  tag: {
    backgroundColor: Colors.glass.light,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  selectedTag: {
    backgroundColor: Colors.blue.primary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.blue.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  
  selectedTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  
  // Progress indicator
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  progressStepInactive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  progressStepText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  
  progressStepTextInactive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text.secondary,
  },
  
  progressLine: {
    width: 48,
    height: 2,
    backgroundColor: Colors.glass.border,
    marginHorizontal: 8,
  },
  
  progressLineActive: {
    width: 48,
    height: 2,
    backgroundColor: Colors.blue.primary,
    marginHorizontal: 8,
  },
  
  // Form styles
  formContainer: {
    paddingHorizontal: 24,
  },
  
  inputGroup: {
    marginBottom: 16,
  },
  
  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.glass.border,
  },
  
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  
  // Icon styles
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: 24,
    margin: 24,
    maxHeight: height * 0.8,
    width: width - 48,
    shadowColor: Colors.glass.shadow,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});

