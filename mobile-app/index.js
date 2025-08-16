// Global polyfills and app bootstrap
// Ensure required web APIs exist in React Native environment before anything else loads

// URL and related APIs (required by many SDKs including Supabase)
import 'react-native-url-polyfill/auto';
// crypto.getRandomValues for UUIDs/keys
import 'react-native-get-random-values';

// structuredClone polyfill (Hermes may not provide it in some environments)
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (value) => {
    // Note: This is a simple JSON-based clone; it won't handle functions, Dates, Maps, Sets, etc.
    return JSON.parse(JSON.stringify(value));
  };
}

// Import registerRootComponent from Expo to register the main app component
import { registerRootComponent } from 'expo';

// Import the main App component
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
