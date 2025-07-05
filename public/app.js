// User Dashboard Script
// Handles user dashboard logic: authentication check, clock in, attendance calendar, and logout

// DOM Elements
const userNameSpan = document.getElementById('user-name');
const clockinBtn = document.getElementById('clockin-btn');
const clockinMsg = document.getElementById('clockin-message');
const locationStatus = document.getElementById('location-status');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const calendarDiv = document.getElementById('calendar');
const logoutBtn = document.getElementById('logout-btn');

// Get token and email from localStorage
let token = localStorage.getItem('token') || null;
let email = localStorage.getItem('username') || null;

// Show dashboard and load calendar
function showDashboard() {
  userNameSpan.textContent = email;
  loadCalendar();
}

// Redirect to sign in if not authenticated
if (!token || !email) {
  window.location.href = 'signin.html';
}
showDashboard();

// Handle clock in button click
clockinBtn.onclick = async () => {
  clockinBtn.disabled = true;
  clockinMsg.textContent = '';
  locationStatus.style.display = 'block';
  
  try {
    // Show location verification status
    statusIndicator.style.background = '#ffa500'; // Orange - checking
    statusText.textContent = 'Requesting GPS location...';
    
    // First verify location
    const position = await getGPSLocation();
    
    if (!position) {
      throw new Error('GPS location is required. Please allow location access.');
    }
    
    statusText.textContent = 'Verifying location with server...';
    
    // Verify location with server
    const locationRes = await fetch('/api/verify-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      })
    });
    
    const locationData = await locationRes.json();
    
    if (!locationData.allowed) {
      statusIndicator.style.background = '#f44336'; // Red - error
      statusText.textContent = `Access denied: ${locationData.distance}m from office`;
      throw new Error(`Access denied: You must be at the office location (${locationData.distance}m from office)`);
    }
    
    statusIndicator.style.background = '#4CAF50'; // Green - success
    statusText.textContent = `Location verified (${locationData.distance}m from office)`;
    
    clockinMsg.textContent = 'Clocking in...';
    
    // Send clock in request
    const res = await fetch('/api/clockin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Clock in failed');
    
    clockinMsg.textContent = `✅ ${data.message}`;
    statusText.textContent = `✅ Clocked in successfully (${locationData.distance}m from office)`;
    loadCalendar();
  } catch (err) {
    statusIndicator.style.background = '#f44336'; // Red - error
    statusText.textContent = err.message;
    clockinMsg.textContent = err.message;
  }
  clockinBtn.disabled = false;
};

// Get GPS location from browser
function getGPSLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0 // Force fresh location
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        console.log('GPS Location error:', error.message);
        resolve(null);
      },
      options
    );
  });
}

// Handle logout
logoutBtn.onclick = () => {
  token = null;
  email = null;
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'signin.html';
};

// Load and render attendance calendar
async function loadCalendar() {
  calendarDiv.textContent = 'Loading...';
  try {
    // Fetch attendance stats for current user
    const res = await fetch('/api/stats', {
      headers: { 'Authorization': token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load stats');
    renderCalendar(data);
  } catch (err) {
    calendarDiv.textContent = err.message;
  }
}

// Render a calendar for the current month, highlighting present days
function renderCalendar(data) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const presentDays = new Set(data.records.map(r => Number(r.date.split('-')[2])));
  let html = '<table class="calendar"><tr>';
  const firstDay = new Date(year, month, 1).getDay();
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  html += weekDays.map(d => `<th>${d}</th>`).join('') + '</tr><tr>';
  for (let i = 0; i < firstDay; i++) html += '<td></td>';
  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) html += '</tr><tr>';
    if (presentDays.has(day)) {
      html += `<td class="present">${day}</td>`;
    } else {
      html += `<td>${day}</td>`;
    }
  }
  html += '</tr></table>';
  html += `<div style="margin-top:8px;"><b>Days Present:</b> ${data.daysPresent} / ${data.daysThisMonth}</div>`;
  calendarDiv.innerHTML = html;
} 