import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const GlobalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Text styles
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  placeholder: {
    fontSize: 16,
  },
  
  // Button styles
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  linkButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Card styles
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  
  // Tag/Chip styles
  tag: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  selectedTag: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  selectedTagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Badge styles
  badge: {
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  
  inactiveBadge: {
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  inactiveBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Divider styles
  divider: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },
  
  activeDivider: {
    width: 48,
    height: 2,
    marginHorizontal: 8,
  },
  
  // Input styles
  input: {
    marginBottom: 16,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxHeight: height * 0.8,
    width: width - 48,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Animation styles
  fadeIn: {
    opacity: 1,
  },
  
  fadeOut: {
    opacity: 0,
  },
  
  // Utility styles
  hidden: {
    display: 'none',
  },
  
  absolute: {
    position: 'absolute',
  },
  
  relative: {
    position: 'relative',
  },
  
  // Spacing utilities
  marginTop: {
    marginTop: 16,
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  marginHorizontal: {
    marginHorizontal: 16,
  },
  
  marginVertical: {
    marginVertical: 16,
  },
  
  paddingTop: {
    paddingTop: 16,
  },
  
  paddingBottom: {
    paddingBottom: 16,
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
});