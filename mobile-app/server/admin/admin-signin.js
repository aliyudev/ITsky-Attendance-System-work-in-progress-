// Enhanced Admin Login Script
// Handles login form validation and submission for admin users with loading states

const form = document.getElementById('admin-login-form');
const submitBtn = document.getElementById('submit-btn');
const buttonText = document.getElementById('button-text');
const loginError = document.getElementById('admin-login-error');

form.onsubmit = async (e) => {
  e.preventDefault();
  
  // Clear previous errors
  loginError.textContent = '';
  
  // Get form values
  const email = document.getElementById('admin-login-email').value.trim();
  const password = document.getElementById('admin-login-password').value;
  
  // Validate email domain
  if (!email.endsWith('@itskysolutions.com')) {
    loginError.textContent = 'Admin email must be @itskysolutions.com';
    return;
  }
  
  // Show loading state
  submitBtn.disabled = true;
  buttonText.innerHTML = '<span class="loading-spinner"></span>Signing In...';
  
  try {
    // Send login request
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (!data.isAdmin) {
      loginError.textContent = 'Not an admin account. Please use admin credentials.';
      return;
    }
    
    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.email);
    
    // Redirect to admin dashboard
    window.location.href = 'admin.html';
    
  } catch (err) {
    loginError.textContent = err.message || 'Login failed. Please try again.';
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    buttonText.textContent = 'Sign In';
  }
};

// Add input validation
document.getElementById('admin-login-email').addEventListener('input', (e) => {
  const email = e.target.value.trim();
  if (email && !email.endsWith('@itskysolutions.com')) {
    e.target.style.borderColor = '#dc2626';
  } else {
    e.target.style.borderColor = '#dc2626';
  }
});

// Clear error when user starts typing
document.getElementById('admin-login-email').addEventListener('input', () => {
  loginError.textContent = '';
});

document.getElementById('admin-login-password').addEventListener('input', () => {
  loginError.textContent = '';
}); 