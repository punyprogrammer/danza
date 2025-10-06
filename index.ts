// CRITICAL: Initialize Colors FIRST before anything else
import './src/styles/colors-init';

import { registerRootComponent } from 'expo';
import App from './App';

// HACK: Make Colors globally available to prevent runtime errors
// This is a temporary fix while we migrate all components to use the theme system

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
