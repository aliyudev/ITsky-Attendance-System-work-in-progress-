// Admin Dashboard Script
// Handles admin dashboard logic: authentication, search, rendering user calendars, and logout

const adminContent = document.getElementById('admin-content');
const logoutBtn = document.getElementById('logout-btn');
const searchBox = document.getElementById('search-box');
let token = localStorage.getItem('token') || null;
let email = localStorage.getItem('username') || null;
let isAdmin = false;
let allStats = [];

// On page load, check admin and fetch stats
(async function checkAdmin() {
  if (!token) {
    window.location.href = 'signin.html';
    return;
  }
  // Try to fetch admin stats
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': token }
    });
    if (res.status === 403) throw new Error('Not admin');
    const data = await res.json();
    isAdmin = true;
    allStats = data.stats;
    renderAdminStats(allStats, data.daysThisMonth);
    // Add search functionality
    searchBox.addEventListener('input', () => {
      const q = searchBox.value.toLowerCase();
      const filtered = allStats.filter(user =>
        (user.email && user.email.toLowerCase().includes(q)) ||
        (user.fullname && user.fullname.toLowerCase().includes(q))
      );
      renderAdminStats(filtered, data.daysThisMonth);
    });
  } catch (err) {
    adminContent.textContent = 'Access denied. Admins only.';
    setTimeout(() => window.location.href = 'index.html', 2000);
  }
})();

// Handle logout
logoutBtn.onclick = () => {
  token = null;
  email = null;
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = 'signin.html';
};

// Render all user stats and calendars
function renderAdminStats(stats, daysThisMonth) {
  if (!stats.length) {
    adminContent.textContent = 'No users found.';
    return;
  }
  let html = '';
  stats.forEach(user => {
    html += `<div class=\"user-calendar\"><h4>${user.fullname ? user.fullname + ' - ' : ''}${user.email} (${user.daysPresent} / ${daysThisMonth} days)</h4>`;
    html += renderCalendar(user.records, daysThisMonth);
    html += '</div>';
  });
  adminContent.innerHTML = html;
}

// Render a calendar for a user
function renderCalendar(records, daysThisMonth) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const presentDays = new Set(records.map(date => Number(date.split('-')[2])));
  let html = '<table class=\"calendar\"><tr>';
  const firstDay = new Date(year, month, 1).getDay();
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  html += weekDays.map(d => `<th>${d}</th>`).join('') + '</tr><tr>';
  for (let i = 0; i < firstDay; i++) html += '<td></td>';
  for (let day = 1; day <= daysThisMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) html += '</tr><tr>';
    if (presentDays.has(day)) {
      html += `<td class=\"present\">${day}</td>`;
    } else {
      html += `<td>${day}</td>`;
    }
  }
  html += '</tr></table>';
  return html;
} 