# ITSky Attendance Mobile App

A React Native mobile application for the ITSky Attendance System, synchronized with the web version.

## 🎨 Design Sync

The mobile app has been synchronized with the web version to ensure consistent:

- **Color Scheme**: Red (#dc2626) primary color matching web version
- **Typography**: Consistent font weights and sizes
- **Layout**: Similar card-based design with shadows
- **UI Components**: Matching button styles, input fields, and status indicators

## 🔧 Database Sync

The mobile app uses the same database and API endpoints as the web version:

- **SQLite Database**: Shared `attendance.db` file
- **API Endpoints**: Same REST API (`/api/login`, `/api/clockin`, `/api/stats`, etc.)
- **Authentication**: Token-based auth with AsyncStorage
- **Location Verification**: GPS-based location checking with same office coordinates

## 📱 Features

### ✅ Implemented
- **Authentication**: Login with email/password
- **Location Verification**: GPS-based office proximity check
- **Clock In**: Location-verified attendance recording
- **Attendance Calendar**: Monthly view with present days highlighted
- **Stats Display**: Days present vs total days in month
- **Logout**: Secure session termination

### 🎯 Key Features
- **GPS Location**: Real-time location verification
- **Offline Storage**: AsyncStorage for session persistence
- **Responsive Design**: Works on both iOS and Android
- **Error Handling**: Comprehensive error messages and status indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Mobile device or emulator

### Installation
```bash
cd mobile-app
npm install
```

### Running the App
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (for debugging)
npm run web
```

## 🔗 API Configuration

The app connects to the web server at `http://localhost:3000/api`. Make sure:

1. The web server is running (`node server.js`)
2. Update `API_BASE_URL` in screens if using different server
3. For physical device testing, use your computer's IP address instead of localhost

## 📊 Database Schema

Same as web version:
- **users**: id, email, password, fullname, is_admin
- **attendance**: id, user_id, date

## 🎨 UI Components

### LoginScreen
- Clean login form with red accent color
- Email and password validation
- Loading states and error handling

### DashboardScreen
- Welcome header with user email
- Clock In button with location verification
- Real-time status indicators
- Monthly attendance calendar
- Logout functionality

### LoadingScreen
- App initialization and auth check
- Consistent branding with web version

## 🔒 Security Features

- **Location Verification**: GPS-based office proximity check
- **Token Authentication**: Secure session management
- **Input Validation**: Client and server-side validation
- **Error Handling**: Graceful error display

## 🐛 Debugging

### Common Issues
1. **Location Permission**: Ensure GPS is enabled and permission granted
2. **Network Connection**: Check API server is running
3. **Expo Development**: Use Expo Go app for testing

### Debug Tools
- Expo DevTools for real-time debugging
- React Native Debugger for advanced debugging
- Console logs for API and location debugging

## 📱 Platform Support

- **iOS**: 13.0 and later
- **Android**: API level 21 and later
- **Web**: Modern browsers (for development)

## 🔄 Sync Status

✅ **Design**: Fully synchronized with web version
✅ **Database**: Shared SQLite database
✅ **API**: Same endpoints and authentication
✅ **Features**: All core functionality implemented
✅ **Styling**: Consistent color scheme and layout

## 📞 Support

For issues or questions about the mobile app sync, refer to the main project documentation or contact the development team. 