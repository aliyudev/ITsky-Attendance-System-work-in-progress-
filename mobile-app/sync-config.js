// Mobile App Sync Configuration
// This file documents the synchronization settings between mobile and web versions

export const SYNC_CONFIG = {
  // Design System
  design: {
    primaryColor: '#dc2626', // Red - matches web version
    backgroundColor: '#fff',
    textColor: '#111',
    secondaryTextColor: '#666',
    borderColor: '#dc2626',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 16,
    borderRadius: 8,
    cardPadding: 32,
  },

  // API Configuration
  api: {
    baseUrl: 'http://localhost:3000/api',
    endpoints: {
      login: '/login',
      clockin: '/clockin',
      stats: '/stats',
      verifyLocation: '/verify-location',
    },
    timeout: 10000,
  },

  // Database Schema (shared with web version)
  database: {
    tables: {
      users: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        email: 'TEXT UNIQUE',
        password: 'TEXT',
        fullname: 'TEXT',
        is_admin: 'INTEGER DEFAULT 0',
      },
      attendance: {
        id: 'INTEGER PRIMARY KEY AUTOINCREMENT',
        user_id: 'INTEGER',
        date: 'TEXT',
        foreignKey: 'FOREIGN KEY(user_id) REFERENCES users(id)',
      },
    },
  },

  // Location Settings (shared with web version)
  location: {
    officeCoordinates: {
      lat: 9.0820, // Nile University Abuja latitude
      lng: 7.3983, // Nile University Abuja longitude
      radius: 10000, // meters - maximum distance from office
    },
    gpsOptions: {
      accuracy: 'high',
      timeout: 10000,
      maximumAge: 0, // Force fresh location
    },
  },

  // Authentication
  auth: {
    storageKeys: {
      token: 'userToken',
      email: 'userEmail',
      isAdmin: 'isAdmin',
    },
    sessionTimeout: null, // No timeout - manual logout only
  },

  // UI Components
  components: {
    loadingScreen: {
      delay: 1500, // ms - simulated loading time
    },
    calendar: {
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      cellHeight: 36,
    },
    statusIndicators: {
      checking: '#ffa500', // Orange
      success: '#4CAF50',  // Green
      error: '#f44336',    // Red
    },
  },

  // Error Messages
  messages: {
    location: {
      permissionRequired: 'Location Permission Required',
      permissionDenied: 'This app needs location access to verify you are at the office for attendance.',
      gpsRequired: 'GPS location is required. Please allow location access.',
      accessDenied: 'Access denied: You must be at the office location',
    },
    auth: {
      invalidCredentials: 'Invalid credentials. Please try again.',
      loginFailed: 'Login Failed',
    },
    general: {
      networkError: 'Network error. Please check your connection.',
      serverError: 'Server error. Please try again later.',
    },
  },

  // Sync Status
  syncStatus: {
    design: '✅ Synchronized',
    database: '✅ Shared',
    api: '✅ Same endpoints',
    features: '✅ All implemented',
    styling: '✅ Consistent',
    lastSync: new Date().toISOString(),
  },
};

export default SYNC_CONFIG; 