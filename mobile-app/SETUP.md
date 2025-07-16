# Mobile App Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Configure Supabase
Edit `config/api.js` and update with your Supabase project credentials:

```javascript
// Replace with your Supabase project URL and anon key
export const supabase = createClient(
  'https://YOUR_SUPABASE_URL.supabase.co',
  'YOUR_SUPABASE_ANON_KEY'
);
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Test on Device
- Install **Expo Go** app on your phone
- Scan the QR code from terminal
- Or press `a` for Android or `i` for iOS

## 📦 Building for Production

### Android APK
```bash
npx expo build:android
```

### iOS IPA
```bash
npx expo build:ios
```

### Using EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for platforms
eas build --platform android
eas build --platform ios
```

## ⚙️ Configuration

### Supabase Endpoints
All API calls are made via the Supabase client:

- **Auth**: Supabase Auth API
- **Attendance**: Supabase table `attendance`
- **Users**: Supabase table `users`

### Environment Variables
No environment variables are required for the mobile app. All configuration is in `config/api.js`.

## 📝 Features

### ✅ Implemented
- User registration and login (Supabase Auth)
- GPS location verification
- Clock in/out functionality
- Attendance dashboard
- Admin management interface
- Offline data caching
- Real-time updates

### 🔜 Planned
- Push notifications
- Biometric authentication
- QR code attendance
- Photo verification
- Team management
- Reports and analytics

## 🐞 Troubleshooting

### Common Issues

**1. "Supabase Connection Error"**
- Check your Supabase URL and anon key in `config/api.js`
- Ensure your Supabase project is running and tables are set up
- Make sure your device has internet access

**2. "Location Permission Required"**
- Allow location access in phone settings
- Enable GPS on device
- Grant permission when prompted

**3. "Access Denied: Location"**
- Ensure you're within the allowed distance of the office
- Check GPS accuracy
- Try refreshing location

### Debug Mode
```bash
# Enable debug logging
npx expo start --dev-client
```

## 📞 Support

For issues:
1. Check this setup guide
2. Review error messages in console
3. Verify Supabase configuration
4. Test with Expo Go first

---

**Note**: Make sure your Supabase project is set up and configured before testing the mobile app! 