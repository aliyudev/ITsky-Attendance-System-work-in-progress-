// Admin Login Script
// Handles login form validation and submission for admin users only

document.getElementById('admin-login-form').onsubmit = async (e) => {
  e.preventDefault();
  const loginError = document.getElementById('admin-login-error');
  loginError.textContent = '';
  // Get form values
  const email = document.getElementById('admin-login-email').value.trim();
  const password = document.getElementById('admin-login-password').value;
  try {
    // Send login request
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (!data.is_admin) {
      loginError.textContent = 'Not an admin account.';
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.email);
    window.location.href = 'admin.html';
  } catch (err) {
    loginError.textContent = err.message;
  }
}; 