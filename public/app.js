// User Dashboard Script
// Handles user dashboard logic: authentication check, clock in, attendance calendar, and logout

// DOM Elements
const userNameSpan = document.getElementById('user-name');
const clockinBtn = document.getElementById('clockin-btn');
const clockinMsg = document.getElementById('clockin-message');
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
  try {
    // Send clock in request
    const res = await fetch('/api/clockin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Clock in failed');
    clockinMsg.textContent = data.message;
    loadCalendar();
  } catch (err) {
    clockinMsg.textContent = err.message;
  }
  clockinBtn.disabled = false;
};

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