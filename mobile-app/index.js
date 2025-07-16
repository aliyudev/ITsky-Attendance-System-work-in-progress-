// Import registerRootComponent from Expo to register the main app component
import { registerRootComponent } from 'expo';

// Import the main App component
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
