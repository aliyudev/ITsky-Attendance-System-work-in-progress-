# ITSky Employee Attendance System

A comprehensive employee attendance management system with GPS verification, featuring a React Native mobile app and a Supabase backend.

## 🚀 Features

### Mobile App (React Native)
- **User Authentication**: Secure login/signup with email validation
- **GPS Clock-in**: Location-based attendance verification
- **Attendance Calendar**: Visual monthly attendance tracking
- **Real-time Status**: Live feedback during clock-in process
- **Offline Support**: AsyncStorage for data persistence
- **Admin Dashboard**: Admins can view and manage user attendance
- **User Management**: Admins can delete users
- **Password Recovery**: Email-based password reset
- **Search Functionality**: Filter employees by name or email (admin)

### Backend (Supabase)
- **PostgreSQL Database**: Managed by Supabase
- **Supabase Auth**: Secure authentication and session management
- **Row Level Security**: Fine-grained access control
- **Realtime API**: Live updates for attendance data

## 📁 Project Structure

```
Test/
├── mobile-app/                # React Native mobile application
│   ├── assets/                # Images and static files
│   ├── config/                # Supabase configuration
│   ├── screens/               # App screens/components
│   ├── App.js                 # Main app component
│   ├── app.json               # Expo configuration
│   ├── README.md              # Mobile app documentation
│   └── SETUP.md               # Mobile app setup guide
├── LICENSE                    # MIT License
├── README.md                  # This documentation
└── mcp.json                   # Supabase MCP config
```

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **AsyncStorage**: Local data persistence
- **Supabase JS**: API client for Supabase

### Backend
- **Supabase**: Managed PostgreSQL, Auth, and Realtime API

### Development Tools
- **Expo CLI**: Development and build tools
- **npm**: Package management
- **Git**: Version control

## 📱 Mobile App Features

### Authentication Flow
1. **Loading Screen**: Checks authentication status
2. **Login/Signup**: User credential management
3. **Dashboard**: Main attendance interface
4. **Admin Dashboard**: Administrative functions

### Clock-in Process
1. **Location Permission**: Request GPS access
2. **GPS Verification**: Check proximity to office
3. **Server Validation**: Verify location with Supabase
4. **Attendance Recording**: Store clock-in data
5. **Status Update**: Display success/error messages

### Calendar System
- **Monthly View**: Visual attendance calendar
- **Color Coding**: Present (red), Absent (red border), Weekend (gray)
- **Statistics**: Days present vs. total working days
- **Working Days**: Monday-Thursday only

### Admin Features
- **Admin Authentication**: Only @itskysolutions.com emails can be admins
- **Dashboard Interface**: View all users and their attendance
- **Search Functionality**: Filter by name or email
- **User Management**: Delete users
- **Export Features**: (Planned)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Supabase project (see below)
- Git

### Supabase Setup
1. [Create a Supabase project](https://app.supabase.com/)
2. Set up tables: `users`, `attendance`
3. Enable Supabase Auth (email/password)
4. Configure Row Level Security (RLS) as needed
5. Get your Supabase URL and anon/public key
6. Update `mobile-app/config/api.js` with your Supabase credentials

### Mobile App Setup
1. Navigate to mobile app directory:
```bash
cd mobile-app
```
2. Install dependencies:
```bash
npm install
```
3. Start Expo development server:
```bash
npx expo start
```
4. Scan QR code with Expo Go app or run on simulator

## 🔑 Configuration

### Supabase Configuration
- **Supabase URL** and **anon key**: Set in `mobile-app/config/api.js`
- **Office Location**: Set in app logic (see DashboardScreen.js)
- **Distance Limit**: Configurable in app logic

### Environment Variables
- Not required for mobile app; all config is in `config/api.js`

## 🛡️ Security Features

- **Supabase Auth**: Secure session management
- **Password Hashing**: Managed by Supabase
- **Domain Validation**: Email domain restrictions for admin
- **Token Expiration**: Automatic session timeout
- **GPS Verification**: Distance-based validation
- **Row Level Security**: Enforced in Supabase

## 📊 API Endpoints (via Supabase)

- **Auth**: Supabase Auth API
- **Attendance**: Supabase table `attendance`
- **Users**: Supabase table `users`

All API calls are made via the Supabase client in the app.

## 🐞 Troubleshooting

- **GPS Not Working**: Check location permissions
- **API Connection**: Verify Supabase URL and anon key
- **Build Errors**: Clear cache and reinstall dependencies
- **Expo Issues**: Use Expo Go for testing

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the mobile app documentation 