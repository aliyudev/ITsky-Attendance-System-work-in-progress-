# Mobile App Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Configure API URL
Edit `config/api.js` and update the IP address:

**For Development (Expo Go):**
```javascript
// Change this to your computer's IP address
return 'http://YOUR_IP_ADDRESS:3000/api';
```

**For Production:**
```javascript
// Replace with your actual server URL
return 'https://your-production-server.com/api';
```

### 3. Start Development Server
```bash
npx expo start
```

### 4. Test on Device
- Install **Expo Go** app on your phone
- Scan the QR code from terminal
- Or press `a` for Android or `i` for iOS

## 📱 Building for Production

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

## 🔧 Configuration

### API Endpoints
All API calls are centralized in `config/api.js`:

- `/register` - User registration
- `/login` - User authentication  
- `/clockin` - Clock in with GPS
- `/stats` - User attendance stats
- `/admin/stats` - Admin dashboard stats
- `/verify-location` - GPS location verification

### Environment Variables
The app automatically detects development vs production:

- **Development**: Uses local IP address
- **Production**: Uses production server URL

## 📋 Features

### ✅ Implemented
- User registration and login
- GPS location verification
- Clock in/out functionality
- Attendance dashboard
- Admin management interface
- Offline data caching
- Real-time updates

### 🔄 Planned
- Push notifications
- Biometric authentication
- QR code attendance
- Photo verification
- Team management
- Reports and analytics

## 🐛 Troubleshooting

### Common Issues

**1. "Network Error"**
- Check if server is running on port 3000
- Verify IP address in `config/api.js`
- Ensure phone and computer are on same network

**2. "Location Permission Required"**
- Allow location access in phone settings
- Enable GPS on device
- Grant permission when prompted

**3. "Access Denied: Location"**
- Ensure you're within 10km of office
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
3. Verify API configuration
4. Test with Expo Go first

---

**Note**: Make sure your server is running before testing the mobile app! 