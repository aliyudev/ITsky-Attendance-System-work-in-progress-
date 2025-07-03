// User Login Script
// Handles login form validation and submission for employees (not admin)

document.getElementById('login-form').onsubmit = async (e) => {
  e.preventDefault();
  const loginError = document.getElementById('login-error');
  loginError.textContent = '';
  // Get form values
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  // Prevent admin login from this page
  if (email === 'admin@itskysolutions.com') {
    loginError.textContent = 'Please use the Admin Sign In page.';
    return;
  }
  try {
    // Send login request
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.email);
    window.location.href = 'index.html';
  } catch (err) {
    loginError.textContent = err.message;
  }
}; 