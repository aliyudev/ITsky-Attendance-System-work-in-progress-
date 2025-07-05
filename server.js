// Imports and Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'attendance.db');

// Office location coordinates (Nile University Abuja area)
const OFFICE_LOCATION = {
  lat: 9.0820, // Nile University Abuja latitude
  lng: 7.3983, // Nile University Abuja longitude
  radius: 10000 // meters - maximum distance from office
};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// --- Location Verification Functions ---

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Verify location using GPS coordinates only
async function verifyLocation(req) {
  // Check if GPS coordinates were provided
  if (req.body.latitude && req.body.longitude) {
    console.log('Checking location via GPS coordinates...');
    const distance = calculateDistance(
      req.body.latitude, req.body.longitude,
      OFFICE_LOCATION.lat, OFFICE_LOCATION.lng
    );
    
    console.log(`GPS Location Check: ${distance}m from office`);
    return {
      allowed: distance <= OFFICE_LOCATION.radius,
      method: 'gps',
      distance: Math.round(distance),
      accuracy: req.body.accuracy
    };
  }
  
  // No GPS coordinates provided
  console.log('No GPS coordinates provided');
  return {
    allowed: false,
    method: 'gps',
    error: 'GPS location required. Please allow location access.'
  };
}

// --- SQLite Database Initialization ---
// Creates tables if they don't exist and ensures a default admin user
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    fullname TEXT,
    is_admin INTEGER DEFAULT 0
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  // Ensure at least one admin exists
  db.get('SELECT * FROM users WHERE is_admin=1', (err, row) => {
    if (!row) {
      db.run('INSERT INTO users (email, password, is_admin) VALUES (?, ?, 1)', ['admin@itskysolutions.com', 'admin']);
    }
  });
});

// --- Session Management (in-memory for demo) ---
let sessions = {};

// --- API Endpoints ---

// Register a new user (employee)
app.post('/api/register', (req, res) => {
  const { fullname, email, password } = req.body;
  if (!email.endsWith('@itskysolutions.com')) {
    return res.status(400).json({ message: 'Email must be @itskysolutions.com' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (user) return res.status(400).json({ message: 'User already exists' });
    db.run('INSERT INTO users (email, password, fullname) VALUES (?, ?, ?)', [email, password, fullname], function(err) {
      if (err) return res.status(500).json({ message: 'Registration failed' });
      res.json({ message: 'User registered' });
    });
  });
});

// Login as user or admin
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = Math.random().toString(36).substr(2);
    sessions[token] = { email: user.email, is_admin: !!user.is_admin, user_id: user.id };
    res.json({ token, email: user.email, is_admin: !!user.is_admin });
  });
});

// --- Middleware ---
// Auth: Checks for valid session token
function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token || !sessions[token]) return res.status(401).json({ message: 'Unauthorized' });
  req.session = sessions[token];
  next();
}
// AdminOnly: Checks if user is admin
function adminOnly(req, res, next) {
  if (!req.session.is_admin) return res.status(403).json({ message: 'Admin only' });
  next();
}

// Location verification endpoint (can be called before login)
app.post('/api/verify-location', async (req, res) => {
  try {
    const locationCheck = await verifyLocation(req);
    res.json(locationCheck);
  } catch (error) {
    console.error('Location verification error:', error);
    res.status(500).json({ 
      allowed: false, 
      error: 'Location verification failed' 
    });
  }
});

// Network information endpoint (simplified)
app.get('/api/network-info', (req, res) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
  
  res.json({
    clientIP: clientIP,
    message: 'Location verification uses IP geolocation only'
  });
});

// Clock in for the day (user only) with location verification
app.post('/api/clockin', auth, async (req, res) => {
  try {
    // Verify location first
    const locationCheck = await verifyLocation(req);
    
    if (!locationCheck.allowed) {
      return res.status(403).json({ 
        message: 'Access denied: Must be at office location',
        details: {
          method: locationCheck.method,
          distance: locationCheck.distance,
          location: locationCheck.location,
          error: locationCheck.error
        }
      });
    }
    
    const today = new Date().toISOString().slice(0, 10);
    db.get('SELECT * FROM attendance WHERE user_id = ? AND date = ?', [req.session.user_id, today], (err, row) => {
      if (row) return res.status(400).json({ message: 'Already clocked in today' });
      db.run('INSERT INTO attendance (user_id, date) VALUES (?, ?)', [req.session.user_id, today], function(err) {
        if (err) return res.status(500).json({ message: 'Clock in failed' });
        res.json({ 
          message: 'Clocked in!',
          location: {
            method: locationCheck.method,
            distance: locationCheck.distance
          }
        });
      });
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ message: 'Clock in failed due to location verification error' });
  }
});



// Get current user's attendance stats for the month
app.get('/api/stats', auth, (req, res) => {
  const now = new Date();
  const month = now.toISOString().slice(0, 7); // YYYY-MM
  db.all('SELECT date FROM attendance WHERE user_id = ? AND date LIKE ?', [req.session.user_id, `${month}%`], (err, rows) => {
    const records = rows || [];
    res.json({
      daysPresent: records.length,
      daysThisMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
      records
    });
  });
});

// Admin: Get all users' attendance stats for the month
app.get('/api/admin/stats', auth, adminOnly, (req, res) => {
  db.all('SELECT id, email, fullname FROM users', (err, users) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    const now = new Date();
    const month = now.toISOString().slice(0, 7);
    db.all('SELECT user_id, date FROM attendance WHERE date LIKE ?', [`${month}%`], (err, attendance) => {
      const stats = users.map(u => {
        const userAttendance = attendance.filter(a => a.user_id === u.id);
        return {
          email: u.email,
          fullname: u.fullname,
          daysPresent: userAttendance.length,
          records: userAttendance.map(a => a.date)
        };
      });
      res.json({ stats, daysThisMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() });
    });
  });
});

// --- Serve Frontend ---
app.use(express.static('public'));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  