// User Registration Script
// Handles registration form validation and submission for employees

document.getElementById('register-form').onsubmit = async (e) => {
  e.preventDefault();
  const registerError = document.getElementById('register-error');
  registerError.textContent = '';
  // Get form values
  const fullname = document.getElementById('register-fullname').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  // Validate fields
  if (!fullname) {
    registerError.style.color = '#dc2626';
    registerError.textContent = 'Full Name is required.';
    return;
  }
  if (!email.endsWith('@itskysolutions.com')) {
    registerError.style.color = '#dc2626';
    registerError.textContent = 'Email must be @itskysolutions.com';
    return;
  }
  if (password !== confirmPassword) {
    registerError.style.color = '#dc2626';
    registerError.textContent = 'Passwords do not match.';
    return;
  }
  try {
    // Send registration request
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullname, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    registerError.style.color = '#198754';
    registerError.textContent = 'Registration successful! You can now sign in.';
  } catch (err) {
    registerError.style.color = '#dc2626';
    registerError.textContent = err.message;
  }
}; 