# ITSky Attendance System - API Documentation

This document provides comprehensive documentation for the ITSky Attendance System API endpoints, including request/response formats, authentication, and error handling.

## 📋 Table of Contents

- [Authentication](#authentication)
- [User Management](#user-management)
- [Attendance Management](#attendance-management)
- [Admin Management](#admin-management)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. All protected endpoints require a valid JWT token in the Authorization header.

### Token Format
```
Authorization: <JWT_TOKEN>
```

### Token Expiration
- **Duration**: 24 hours
- **Refresh**: Requires re-authentication

## 👤 User Management

### Register New User
**POST** `/api/signup`

Creates a new user account with email validation and password hashing.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@itskysolutions.com",
  "password": "securepassword123"
}
```

#### Response (Success - 201)
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john.doe@itskysolutions.com",
  "isAdmin": false
}
```

#### Response (Error - 400)
```json
{
  "message": "Email already registered"
}
```

#### Validation Rules
- **name**: Required, string
- **email**: Required, valid email format
- **password**: Required, minimum 6 characters

### User Login
**POST** `/api/login`

Authenticates user credentials and returns JWT token.

#### Request Body
```json
{
  "email": "john.doe@itskysolutions.com",
  "password": "securepassword123"
}
```

#### Response (Success - 200)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john.doe@itskysolutions.com",
  "isAdmin": false
}
```

#### Response (Error - 401)
```json
{
  "message": "Invalid credentials"
}
```

## 🏢 Admin Management

### Admin Login
**POST** `/api/admin/login`

Authenticates admin users with domain validation.

#### Request Body
```json
{
  "email": "admin@itskysolutions.com",
  "password": "admin123"
}
```

#### Response (Success - 200)
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "admin@itskysolutions.com",
  "isAdmin": true
}
```

#### Response (Error - 403)
```json
{
  "message": "Admin access requires @itskysolutions.com email"
}
```

#### Validation Rules
- **email**: Must end with `@itskysolutions.com`
- **password**: Required

## 📍 Location Verification

### Verify GPS Location
**POST** `/api/verify-location`

Verifies if user's location is within office radius (no authentication required).

#### Request Body
```json
{
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 10
}
```

#### Response (Success - 200)
```json
{
  "allowed": true,
  "distance": 150,
  "accuracy": 10
}
```

#### Response (Error - 400)
```json
{
  "message": "Latitude and longitude are required"
}
```

#### Office Configuration
- **Latitude**: 14.5995 (Manila, Philippines)
- **Longitude**: 120.9842
- **Max Distance**: 10,000 meters (10km)

## ⏰ Attendance Management

### Clock In
**POST** `/api/clockin`

Records user attendance with GPS verification (requires authentication).

#### Headers
```
Authorization: <JWT_TOKEN>
Content-Type: application/json
```

#### Request Body
```json
{
  "latitude": 14.5995,
  "longitude": 120.9842,
  "accuracy": 10
}
```

#### Response (Success - 200)
```json
{
  "message": "Clock-in successful",
  "attendanceId": 123,
  "distance": 150
}
```

#### Response (Error - 400)
```json
{
  "message": "Already clocked in today"
}
```

#### Response (Error - 403)
```json
{
  "message": "Location verification failed",
  "details": {
    "error": "Too far from office",
    "distance": 15000
  }
}
```

#### Business Rules
- **Working Days**: Monday to Thursday only
- **Duplicate Prevention**: One clock-in per day
- **Location Required**: Must be within 10km of office
- **Time Zone**: Server local time

### Get User Statistics
**GET** `/api/stats`

Retrieves user's attendance statistics for current month (requires authentication).

#### Headers
```
Authorization: <JWT_TOKEN>
```

#### Response (Success - 200)
```json
{
  "daysPresent": 15,
  "daysThisMonth": 20,
  "records": [
    "2024-01-01",
    "2024-01-02",
    "2024-01-03"
  ]
}
```

#### Response (Error - 401)
```json
{
  "message": "Access token required"
}
```

## 👨‍💼 Admin Management

### Get All User Statistics
**GET** `/api/admin/stats`

Retrieves attendance statistics for all users (requires admin authentication).

#### Headers
```
Authorization: <JWT_TOKEN>
```

#### Response (Success - 200)
```json
{
  "stats": [
    {
      "id": 1,
      "fullname": "John Doe",
      "email": "john.doe@itskysolutions.com",
      "daysPresent": 15,
      "records": ["2024-01-01", "2024-01-02"]
    },
    {
      "id": 2,
      "fullname": "Jane Smith",
      "email": "jane.smith@itskysolutions.com",
      "daysPresent": 18,
      "records": ["2024-01-01", "2024-01-02", "2024-01-03"]
    }
  ],
  "daysThisMonth": 20
}
```

#### Response (Error - 403)
```json
{
  "message": "Admin access required"
}
```

## ❌ Error Handling

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "message": "Error description",
  "details": {
    "field": "Additional error information"
  }
}
```

### Common Error Messages

#### Authentication Errors
- `"Access token required"` - Missing Authorization header
- `"Invalid token"` - Expired or malformed JWT
- `"Invalid credentials"` - Wrong email/password
- `"Admin access required"` - Non-admin accessing admin endpoint

#### Validation Errors
- `"Name, email, and password are required"` - Missing required fields
- `"Invalid email format"` - Malformed email address
- `"Email already registered"` - Duplicate email
- `"Admin access requires @itskysolutions.com email"` - Invalid admin domain

#### Location Errors
- `"Latitude and longitude are required"` - Missing GPS coordinates
- `"Location verification failed"` - Outside office radius
- `"Too far from office"` - Distance exceeds limit

#### Attendance Errors
- `"Already clocked in today"` - Duplicate clock-in
- `"Attendance can only be taken on Mondays to Thursdays"` - Weekend/off day
- `"Location data required"` - Missing GPS data

## 📊 Data Models

### User Model
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@itskysolutions.com",
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Attendance Model
```json
{
  "id": 1,
  "user_id": 1,
  "clock_in_time": "2024-01-01T09:00:00.000Z",
  "location_lat": 14.5995,
  "location_lng": 120.9842,
  "accuracy": 10
}
```

### Admin User Model
```json
{
  "id": 1,
  "email": "admin@itskysolutions.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Statistics Model
```json
{
  "daysPresent": 15,
  "daysThisMonth": 20,
  "records": ["2024-01-01", "2024-01-02"],
  "attendanceRate": 75
}
```

## 🔧 Testing Examples

### Using cURL

#### User Registration
```bash
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@itskysolutions.com",
    "password": "password123"
  }'
```

#### User Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@itskysolutions.com",
    "password": "password123"
  }'
```

#### Clock In (with token)
```bash
curl -X POST http://localhost:3000/api/clockin \
  -H "Authorization: YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 14.5995,
    "longitude": 120.9842,
    "accuracy": 10
  }'
```

#### Get User Stats
```bash
curl -X GET http://localhost:3000/api/stats \
  -H "Authorization: YOUR_JWT_TOKEN"
```

### Using JavaScript/Fetch

#### User Login
```javascript
const response = await fetch('http://localhost:3000/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@itskysolutions.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

#### Clock In
```javascript
const response = await fetch('http://localhost:3000/api/clockin', {
  method: 'POST',
  headers: {
    'Authorization': 'YOUR_JWT_TOKEN',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    latitude: 14.5995,
    longitude: 120.9842,
    accuracy: 10
  })
});

const data = await response.json();
console.log(data);
```

## 🔒 Security Considerations

### JWT Token Security
- Tokens expire after 24 hours
- Store tokens securely in mobile app
- Never expose tokens in client-side code
- Use HTTPS in production

### Password Security
- Passwords are hashed using bcrypt
- Minimum 6 characters required
- Consider implementing password strength requirements

### Location Security
- GPS coordinates are validated
- Distance calculations use Haversine formula
- Office location is configurable
- Accuracy requirements can be adjusted

### API Security
- CORS protection enabled
- Input validation on all endpoints
- SQL injection prevention
- Rate limiting (planned)

## 📈 Rate Limiting

Currently, the API does not implement rate limiting. For production deployment, consider implementing:

- Request rate limiting per IP
- User-based rate limiting
- Burst protection
- API key management

## 🔄 Versioning

The API currently uses version 1.3.0. Future versions will be documented with:

- Changelog
- Migration guides
- Deprecation notices
- Backward compatibility information

## 📞 Support

For API support and questions:

1. Check this documentation
2. Review error logs
3. Test with provided examples
4. Create issue on GitHub
5. Contact development team

---

**API Version**: 1.3.0  
**Last Updated**: January 2024  
**Maintainer**: ITSky Solutions 