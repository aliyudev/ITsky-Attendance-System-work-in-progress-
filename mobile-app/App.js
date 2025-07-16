// Import React library for building user interfaces
import React from 'react';
// Import NavigationContainer to manage navigation tree
import { NavigationContainer } from '@react-navigation/native';
// Import createStackNavigator to create a stack of screens
import { createStackNavigator } from '@react-navigation/stack';
// Import StatusBar for controlling the app's status bar
import { StatusBar } from 'expo-status-bar';

// Import custom screens for navigation
import LoadingScreen from './screens/LoadingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import PasswordRecoveryScreen from './screens/PasswordRecoveryScreen';
import ManageUsersScreen from './screens/ManageUsersScreen';

// Create a Stack Navigator instance
const Stack = createStackNavigator();

// Main App component
export default function App() {
  // Render the navigation container and stack navigator
  return (
    <NavigationContainer>
      {/* Set the status bar style */}
      <StatusBar style="auto" />
      {/* Define the stack navigator and its screens */}
      <Stack.Navigator
        initialRouteName="Loading" // Set initial screen
        screenOptions={{
          headerShown: false, // Hide header for all screens
          cardStyle: { backgroundColor: '#fff' }, // Set background color
        }}
      >
        {/* Define each screen in the stack */}
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
        <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
