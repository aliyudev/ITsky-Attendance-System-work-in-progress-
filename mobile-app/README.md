# ITSky Attendance Mobile App

A React Native mobile application for the ITSky Attendance System, now powered by Supabase for authentication, database, and API.

## 🎨 Design Sync

The mobile app is designed to match the web version's look and feel:

- **Color Scheme**: Red (#dc2626) primary color
- **Typography**: Consistent font weights and sizes
- **Layout**: Card-based design with shadows
- **UI Components**: Matching button styles, input fields, and status indicators

## 🛠️ Backend & Database

- **Supabase**: All authentication, user, and attendance data is managed by Supabase (PostgreSQL)
- **Supabase Auth**: Handles user sign up, login, and password recovery
- **Realtime API**: Attendance and user data is fetched and updated via Supabase client

## 📱 Features

### ✅ Implemented
- **Authentication**: Login/signup with email/password (Supabase Auth)
- **Location Verification**: GPS-based office proximity check
- **Clock In**: Location-verified attendance recording (Supabase)
- **Attendance Calendar**: Monthly view with present days highlighted
- **Stats Display**: Days present vs total days in month
- **Logout**: Secure session termination
- **Admin Dashboard**: Admins can view/search users and attendance
- **User Management**: Admins can delete users
- **Password Recovery**: Email-based password reset

### 🎯 Key Features
- **GPS Location**: Real-time location verification
- **Offline Storage**: AsyncStorage for session persistence
- **Responsive Design**: Works on both iOS and Android
- **Error Handling**: Comprehensive error messages and status indicators

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Supabase project (see below)
- Mobile device or emulator

### Supabase Setup
1. [Create a Supabase project](https://app.supabase.com/)
2. Set up tables: `users`, `attendance`
3. Enable Supabase Auth (email/password)
4. Configure Row Level Security (RLS) as needed
5. Get your Supabase URL and anon/public key
6. Update `config/api.js` with your Supabase credentials

## 📍 Location Configuration

- Set your office coordinates and allowed radius in `config/location.js`:
  - `OFFICE.lat`, `OFFICE.lng`
  - `OFFICE_RADIUS_METERS`
- If `OFFICE` is not set (left as `null`), the app will skip proximity enforcement and only record GPS with the attendance.

### Installation
```bash
cd mobile-app
npm install
```

### Running the App
```bash
# Start Expo development server
npx expo start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (for debugging)
npm run web
```

## 🔗 API Configuration

The app connects to Supabase for all authentication and data operations. Make sure:

1. You have a Supabase project set up
2. `config/api.js` contains your Supabase URL and anon key
3. For physical device testing, use your computer's IP address for any custom endpoints (if needed)

## 🗄️ Database Schema

- **users**: id, email, name, is_admin
- **attendance**: id, user_id, clock_in_time, location_lat, location_lng, accuracy

Notes
- `clock_in_time` uses timestamptz (UTC). The app displays local device time.

## 🧩 UI Components

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

### AdminDashboardScreen
- Admin-only dashboard for viewing/searching users and attendance
- User management (delete users)
- Export (planned)

## 🔒 Security Features

- **Supabase Auth**: Secure session management
- **Location Verification**: GPS-based office proximity check
- **Input Validation**: Client and server-side validation
- **Error Handling**: Graceful error display
- **Domain Validation**: Only @itskysolutions.com emails can be admins

## 🐞 Debugging

### Common Issues
1. **Location Permission**: Ensure GPS is enabled and permission granted
2. **Supabase Connection**: Check Supabase URL and anon key
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
✅ **Database**: Supabase PostgreSQL
✅ **API**: All endpoints via Supabase
✅ **Features**: All core functionality implemented
✅ **Styling**: Consistent color scheme and layout

## 📞 Support

For issues or questions about the mobile app or Supabase sync, refer to the main project documentation or contact the development team. 