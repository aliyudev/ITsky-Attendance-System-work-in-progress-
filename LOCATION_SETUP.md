# Location-Based Attendance System Setup

This guide explains how to configure the location verification system for your attendance app.

## Features Implemented

✅ **WiFi Network Detection** - Primary location verification method  
✅ **IP Geolocation** - Backup location verification method  
✅ **QR Code Access** - Wall-mounted QR code for easy access  
✅ **Location Verification** - Prevents remote attendance  

## Configuration Steps

### 1. Update Office Location Coordinates

Edit `server.js` and update the `OFFICE_LOCATION` object with your actual office coordinates:

```javascript
const OFFICE_LOCATION = {
  lat: 40.7128, // Replace with your office latitude
  lng: -74.0060, // Replace with your office longitude
  radius: 200 // meters - maximum distance from office
};
```

**How to get your office coordinates:**
1. Go to [Google Maps](https://maps.google.com)
2. Right-click on your office location
3. Copy the coordinates from the popup
4. Replace the lat/lng values in the code

### 2. Configure Allowed WiFi Networks

Update the `ALLOWED_WIFI_NETWORKS` array in `server.js` with your office WiFi network names:

```javascript
const ALLOWED_WIFI_NETWORKS = [
  'Company_WiFi',        // Replace with your actual WiFi name
  'Office_Network',      // Add multiple WiFi networks if needed
  'ITSky_Office',        // Example: 'Reception_WiFi'
  'Reception_WiFi',
  'Corporate_Network'
];
```

**To find your WiFi network name:**
1. Connect to your office WiFi
2. Check your device's WiFi settings
3. Copy the exact network name (SSID)

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

## How It Works

### Location Verification Process

1. **QR Code Scan** → Employee scans wall-mounted QR code
2. **WiFi Detection** → System checks if connected to office WiFi
3. **IP Geolocation** → If WiFi not detected, checks IP location
4. **Access Decision** → Grants/denies access based on location
5. **Login Process** → Employee logs in to clock in

### Security Features

- **WiFi Network Verification** - Must be on company WiFi
- **IP Geolocation Backup** - Must be within office radius
- **Real-time Verification** - Checks location on every clock-in
- **Network Detection** - Identifies local vs external networks

## Testing the System

### 1. Generate QR Code

Visit: `http://localhost:3000/qr-generator.html`

This page generates a QR code that points to your attendance system.

### 2. Test Location Verification

Visit: `http://localhost:3000/attendance.html`

The system will:
- Try to detect WiFi network
- Fall back to IP geolocation if WiFi not available
- Show verification status
- Allow/deny access based on location

### 3. Test from Different Locations

- **Office WiFi** → Should work ✅
- **Mobile Data** → Should work if within office radius ✅
- **Home/Remote** → Should be denied ❌

## Troubleshooting

### WiFi Detection Not Working

**Problem:** WiFi network not detected  
**Solution:** 
1. Check if you're connected to office WiFi
2. Verify WiFi name is in `ALLOWED_WIFI_NETWORKS` array
3. System will automatically fall back to IP geolocation

### IP Geolocation Not Working

**Problem:** Location verification fails  
**Solution:**
1. Check internet connection
2. Verify office coordinates are correct
3. Adjust `radius` value if needed (increase for larger office areas)

### Access Denied When It Should Work

**Problem:** Employee at office but access denied  
**Solution:**
1. Check office coordinates accuracy
2. Increase `radius` value
3. Add WiFi network name to allowed list
4. Check if employee is on office WiFi

## Production Deployment

### HTTPS Requirement

For production, you **MUST** use HTTPS because:
- Network Information API requires secure context
- WiFi detection features need HTTPS
- Better security for location verification

### Environment Variables

For production, move configuration to environment variables:

```javascript
const OFFICE_LOCATION = {
  lat: process.env.OFFICE_LAT || 40.7128,
  lng: process.env.OFFICE_LNG || -74.0060,
  radius: process.env.OFFICE_RADIUS || 200
};

const ALLOWED_WIFI_NETWORKS = process.env.ALLOWED_WIFI_NETWORKS?.split(',') || [
  'Company_WiFi',
  'Office_Network'
];
```

### Database Considerations

Consider adding location verification logs to your database:

```sql
CREATE TABLE location_verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  verification_method TEXT,
  wifi_network TEXT,
  ip_address TEXT,
  distance_meters INTEGER,
  allowed BOOLEAN,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
```

## API Endpoints

### Location Verification

- `POST /api/verify-location` - Verify user location
- `GET /api/network-info` - Get network information
- `GET /api/check-local-network` - Check if on local network

### Attendance

- `POST /api/clockin` - Clock in with location verification
- `POST /api/login` - User login
- `GET /api/stats` - Get attendance statistics

## Security Notes

- WiFi network names can be spoofed (rare but possible)
- IP geolocation can be bypassed with VPNs
- Consider implementing additional security measures for high-security environments
- Log all location verification attempts for audit purposes

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all configuration values
3. Test with different devices/networks
4. Review server logs for detailed error messages 