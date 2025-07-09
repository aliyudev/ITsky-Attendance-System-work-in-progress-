// Enhanced Admin Dashboard Script
// Handles admin dashboard logic with mobile-like features: user cards, attendance rates, and better UX

const adminContent = document.getElementById('admin-content');
const logoutBtn = document.getElementById('logout-btn');
const searchBox = document.getElementById('search-box');
const adminEmailSpan = document.getElementById('admin-email');
const workingDaysSpan = document.getElementById('working-days');

let token = localStorage.getItem('token') || null;
let email = localStorage.getItem('username') || null;
let isAdmin = false;
let allStats = [];
let daysThisMonth = 0;

// On page load, check admin and fetch stats
(async function checkAdmin() {
  if (!token) {
    window.location.href = 'admin-signin.html';
    return;
  }
  
  // Set admin email
  adminEmailSpan.textContent = email || 'Admin';
  
  // Try to fetch admin stats
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': token }
    });
    if (res.status === 403) throw new Error('Not admin');
    const data = await res.json();
    isAdmin = true;
    allStats = data.stats;
    daysThisMonth = data.daysThisMonth;
    workingDaysSpan.textContent = daysThisMonth;
    
    renderAdminStats(allStats);
    
    // Add search functionality
    searchBox.addEventListener('input', () => {
      const q = searchBox.value.toLowerCase();
      const filtered = allStats.filter(user =>
        (user.email && user.email.toLowerCase().includes(q)) ||
        (user.fullname && user.fullname.toLowerCase().includes(q))
      );
      renderAdminStats(filtered);
    });
    
    // Add refresh functionality
    addRefreshButton();
    
  } catch (err) {
    adminContent.innerHTML = '<div class="no-users">Access denied. Admins only.</div>';
    setTimeout(() => window.location.href = 'index.html', 2000);
  }
})();

// Handle logout
logoutBtn.onclick = () => {
  if (confirm('Are you sure you want to logout?')) {
    token = null;
    email = null;
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = 'admin-signin.html';
  }
};

// Add refresh button functionality
function addRefreshButton() {
  const refreshBtn = document.createElement('button');
  refreshBtn.className = 'refresh-button';
  refreshBtn.textContent = 'Refresh';
  refreshBtn.onclick = async () => {
    refreshBtn.textContent = 'Refreshing...';
    refreshBtn.disabled = true;
    await loadStats();
    refreshBtn.textContent = 'Refresh';
    refreshBtn.disabled = false;
  };
  
  // Insert after search box
  const searchContainer = document.querySelector('.search-container');
  searchContainer.appendChild(refreshBtn);
}

// Load stats with loading state
async function loadStats() {
  adminContent.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading statistics...</div>
    </div>
  `;
  
  try {
    const res = await fetch('/api/admin/stats', {
      headers: { 'Authorization': token }
    });
    const data = await res.json();
    allStats = data.stats;
    daysThisMonth = data.daysThisMonth;
    workingDaysSpan.textContent = daysThisMonth;
    renderAdminStats(allStats);
  } catch (error) {
    adminContent.innerHTML = '<div class="no-users">Failed to load statistics. Please try again.</div>';
  }
}

// Show coming soon message
function showComingSoon(message) {
  alert(message);
}

// Render all user stats in card format (matching mobile design)
function renderAdminStats(stats) {
  if (!stats || !stats.length) {
    adminContent.innerHTML = '<div class="no-users">No users found.</div>';
    return;
  }
  
  let html = '';
  stats.forEach(user => {
    const attendanceRate = daysThisMonth > 0 
      ? Math.round((user.daysPresent / daysThisMonth) * 100) 
      : 0;
    
    html += `
      <div class="user-card">
        <div class="user-header">
          <div class="user-name">${user.fullname || 'Unknown User'}</div>
          <div class="user-email">${user.email}</div>
        </div>
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-label">Days Present</div>
            <div class="stat-value">${user.daysPresent}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">This Month</div>
            <div class="stat-value">${daysThisMonth}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Attendance Rate</div>
            <div class="stat-value">${attendanceRate}%</div>
          </div>
        </div>
    `;
    
    // Add attendance dates if available
    if (user.records && user.records.length > 0) {
      const recentDates = user.records.slice(-5); // Show last 5 dates
      html += `
        <div class="attendance-dates">
          <div class="dates-label">Attendance Dates:</div>
          <div class="dates-text">
            ${recentDates.join(', ')}
            ${user.records.length > 5 ? '...' : ''}
          </div>
        </div>
      `;
    }
    
    html += '</div>';
  });
  
  adminContent.innerHTML = html;
}

// Legacy calendar function (kept for backward compatibility)
function renderCalendar(records, daysThisMonth) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const presentDays = new Set(records.map(date => Number(date.split('-')[2])));
  let html = '<table class="calendar"><tr>';
  const firstDay = new Date(year, month, 1).getDay();
  const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  html += weekDays.map(d => `<th>${d}</th>`).join('') + '</tr><tr>';
  for (let i = 0; i < firstDay; i++) html += '<td></td>';
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    if ((firstDay + day - 1) % 7 === 0 && day !== 1) html += '</tr><tr>';
    
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 4; // Monday to Thursday
    const isFriday = dayOfWeek === 5; // Friday
    
    if (presentDays.has(day)) {
      html += `<td class="present">${day}</td>`;
    } else if (isWorkingDay) {
      html += `<td class="absent">${day}</td>`;
    } else if (isFriday) {
      html += `<td class="friday">${day}</td>`;
    } else {
      html += `<td class="weekend">${day}</td>`;
    }
  }
  html += '</tr></table>';
  return html;
} 