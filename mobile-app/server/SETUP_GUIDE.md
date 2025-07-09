# ITSky Attendance System - Setup Guide

This guide provides detailed instructions for setting up and running the ITSky Employee Attendance System on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v14.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`
- **npm** (comes with Node.js)
  - Verify installation: `npm --version`
- **Git** (for version control)
  - Download from: https://git-scm.com/
  - Verify installation: `git --version`

### Mobile Development Tools
- **Expo CLI** (for React Native development)
  - Install globally: `npm install -g @expo/cli`
  - Verify installation: `expo --version`
- **Expo Go App** (for testing on physical devices)
  - iOS: App Store
  - Android: Google Play Store

### Optional Tools
- **VS Code** (recommended editor)
  - Download from: https://code.visualstudio.com/
- **Postman** (for API testing)
  - Download from: https://www.postman.com/

## 🚀 Quick Start

### 1. Clone the Repository
   ```bash
git clone <your-repository-url>
cd Test
   ```

### 2. Backend Setup
   ```bash
# Navigate to server directory
cd mobile-app/server

# Install dependencies
   npm install

# Start the server
   npm start
   ```

The server will start on `http://localhost:3000`

### 3. Mobile App Setup
   ```bash
# Navigate to mobile app directory
cd mobile-app

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

### 4. Testing the Setup
- **Web Admin**: Open `http://localhost:3000` in your browser
- **Mobile App**: Scan the QR code with Expo Go app
- **API Testing**: Use Postman to test endpoints

## 🔧 Detailed Setup Instructions

### Backend Server Configuration

#### Database Setup
The application uses SQLite for data storage. The database file is automatically created on first run.

**Database Location**: `mobile-app/server/attendance.db`

**Tables Created**:
- `users` - Employee information
- `attendance` - Clock-in records
- `admin_users` - Admin credentials

#### Environment Configuration
Create a `.env` file in the server directory:

```env
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
OFFICE_LAT=14.5995
OFFICE_LON=120.9842
MAX_DISTANCE=10000
```

#### Default Admin Account
The system creates a default admin account on first run:
- **Email**: admin@itskysolutions.com
- **Password**: admin123

**⚠️ Important**: Change these credentials in production!

### Mobile App Configuration

#### API Configuration
Edit `mobile-app/app/config/api.js` to configure API endpoints:

```javascript
// For local development
const getApiBaseUrl = () => {
  if (__DEV__) {
    return 'http://localhost:3000';
  }
  return 'https://your-production-server.com';
};
```

#### Network Configuration
For testing on physical devices, update the local network IP:

```javascript
LOCAL_NETWORK: {
  BASE_URL: 'http://YOUR_LOCAL_IP:3000',
  TIMEOUT: 10000,
}
```

To find your local IP:
- **Windows**: `ipconfig` in Command Prompt
- **Mac/Linux**: `ifconfig` in Terminal

### Development Workflow

#### 1. Starting Development
```bash
# Terminal 1 - Backend
cd mobile-app/server
npm start

# Terminal 2 - Mobile App
cd mobile-app
npx expo start
```

#### 2. Testing on Devices
- **iOS Simulator**: Press `i` in Expo terminal
- **Android Emulator**: Press `a` in Expo terminal
- **Physical Device**: Scan QR code with Expo Go

#### 3. Debugging
- **Backend**: Check console logs in terminal
- **Mobile App**: Use Expo DevTools or React Native Debugger
- **API**: Use Postman or browser developer tools

## 📱 Mobile App Features

### User Authentication
- Email/password registration and login
- JWT token-based authentication
- Automatic session management
- Role-based access control

### GPS Attendance
- Location permission handling
- GPS coordinate verification
- Distance calculation from office
- Real-time status feedback

### Attendance Calendar
- Monthly attendance visualization
- Color-coded day types:
  - 🟢 Present (red background)
  - 🔴 Absent (red border)
  - ⚪ Weekend (gray)
  - 🟡 Friday (light gray)
- Working days calculation (Monday-Thursday)

### Admin Features
- User management interface
- Attendance statistics
- Search functionality
- Export capabilities (planned)

## 🌐 Web Admin Dashboard

### Access
- **URL**: `http://localhost:3000`
- **Login**: Use admin credentials
- **Features**: User management and statistics

### Admin Functions
- View all employee attendance
- Search and filter users
- Monitor attendance rates
- Export reports (planned)

## 🔒 Security Features

### Authentication Security
- JWT token expiration (24 hours)
- Password hashing with bcrypt
- Secure token storage
- Session management

### Location Security
- GPS accuracy validation
- Distance-based verification
- Configurable office radius
- Location data encryption

### API Security
- CORS protection
- Input validation
- SQL injection prevention
- Rate limiting (planned)

## 🐛 Troubleshooting

### Common Issues

#### 1. Server Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Check Node.js version
node --version
```

#### 2. Mobile App Can't Connect
```bash
# Check server is running
curl http://localhost:3000

# Verify API configuration
# Check network IP address
# Ensure firewall allows connections
```

#### 3. GPS Not Working
- Check location permissions in device settings
- Ensure location services are enabled
- Test with different accuracy settings
- Verify office coordinates are correct

#### 4. Database Issues
   ```bash
# Reset database (WARNING: Deletes all data)
rm mobile-app/server/attendance.db
npm start
```

### Debug Mode
Enable debug logging in server configuration:

```javascript
// In server.js
const DEBUG = true;

if (DEBUG) {
  console.log('Debug mode enabled');
}
```

### Log Files
- **Server logs**: Check terminal output
- **Mobile logs**: Use Expo DevTools
- **Database logs**: SQLite doesn't generate log files

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/admin/login` - Admin login

### Attendance Endpoints
- `POST /api/clockin` - Record attendance
- `GET /api/stats` - Get user statistics
- `POST /api/verify-location` - Verify GPS location

### Admin Endpoints
- `GET /api/admin/stats` - Get all user statistics
- `GET /api/admin/users` - Get user list

### Request/Response Examples

#### User Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Clock In
```bash
curl -X POST http://localhost:3000/api/clockin \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"latitude":14.5995,"longitude":120.9842,"accuracy":10}'
```

## 🚀 Deployment

### Backend Deployment
1. **Railway** (Recommended for free tier)
2. **Render** (Free tier available)
3. **Heroku** (Paid service)
4. **Vercel** (Serverless)

### Mobile App Deployment
1. **Expo Build** (Cloud build service)
2. **EAS Build** (Expo Application Services)
3. **App Store** (iOS deployment)
4. **Google Play** (Android deployment)

### Production Checklist
- [ ] Change default admin credentials
- [ ] Set secure JWT secret
- [ ] Configure production database
- [ ] Update API URLs
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups

## 📞 Support

### Getting Help
1. Check this documentation
2. Review error logs
3. Test with minimal setup
4. Create issue on GitHub
5. Contact development team

### Useful Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Expo CLI version
expo --version

# Clear npm cache
npm cache clean --force

# Reset Expo cache
expo r -c

# Check network connectivity
ping localhost
```

### Development Tips
- Use VS Code with React Native extensions
- Enable auto-save for faster development
- Use Git for version control
- Test on multiple devices
- Keep dependencies updated
- Document code changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Happy Coding! 🚀** 