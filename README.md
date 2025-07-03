# ITSky Attendance Web App

A modern web application for employee attendance management at ITSky Solutions.

---

## Features
- **User Registration:** Staff can sign up with full name, company email, and password (with confirmation).
- **User Login:** Staff can log in with their company email and password.
- **Clock In:** Staff can clock in once per day.
- **Personal Dashboard:** Staff see their attendance calendar for the current month.
- **Admin Login:** Admins have a dedicated login page.
- **Admin Dashboard:** Admins can view all users, search by name/email, and see each user's attendance calendar.
- **Branding:** Custom logo and company name on all pages.

---

## Project Structure & File Explanations

```
Test/
  ├── public/
  │   ├── index.html           # User dashboard page
  │   ├── signup.html          # User registration page
  │   ├── signin.html          # User login page
  │   ├── admin.html           # Admin dashboard page
  │   ├── admin-signin.html    # Admin login page
  │   ├── app.js               # JS for user dashboard
  │   ├── signup.js            # JS for user registration
  │   ├── signin.js            # JS for user login
  │   ├── admin.js             # JS for admin dashboard
  │   ├── admin-signin.js      # JS for admin login
  │   ├── style.css            # Shared CSS for all pages
  │   ├── itskylogo.png        # Company logo
  ├── server.js                # Node.js/Express backend server
  ├── attendance.db            # SQLite database (auto-created)
  ├── package.json             # Node.js dependencies and scripts
  └── README.md                # Project documentation
```

### File Details
- **public/index.html**: User dashboard. Shows clock-in button and attendance calendar.
- **public/signup.html**: Registration form for employees. Requires full name, company email, password, and confirm password.
- **public/signin.html**: Login form for employees.
- **public/admin.html**: Admin dashboard. Shows all users, search, and attendance stats.
- **public/admin-signin.html**: Login form for admins only.
- **public/app.js**: Handles user dashboard logic (fetching stats, clock-in, logout).
- **public/signup.js**: Handles registration logic and validation.
- **public/signin.js**: Handles user login logic and prevents admin login here.
- **public/admin.js**: Handles admin dashboard logic, including search and rendering calendars.
- **public/admin-signin.js**: Handles admin login logic and redirects to admin dashboard.
- **public/style.css**: Styles for all pages.
- **public/itskylogo.png**: Company logo displayed on all pages.
- **server.js**: Main backend server. Handles API endpoints, authentication, attendance, and admin logic.
- **attendance.db**: SQLite database file (auto-created, do not edit manually).
- **package.json**: Lists dependencies and scripts for Node.js.
- **README.md**: This documentation file.

---

## server.js Code Structure & Comments

The `server.js` file is organized as follows (with comments in the code for each section):

1. **Imports and Setup**
   - Loads required modules (express, sqlite3, etc.)
   - Sets up Express app and SQLite database

2. **Database Initialization**
   - Creates `users` and `attendance` tables if they don't exist
   - Ensures a default admin user exists

3. **Session Management**
   - Uses a simple in-memory session object for demo purposes

4. **API Endpoints**
   - `/api/register` (POST): Register a new user (employee)
   - `/api/login` (POST): Log in as user or admin
   - `/api/clockin` (POST): Clock in for the day (user only)
   - `/api/stats` (GET): Get current user's attendance for the month
   - `/api/admin/stats` (GET): Get all users' attendance (admin only)

5. **Middleware**
   - `auth`: Checks for valid session token
   - `adminOnly`: Checks if user is admin

6. **Frontend Serving**
   - Serves static files from the `public` directory

7. **Server Start**
   - Starts the server on port 3000

**Each section in `server.js` is commented for clarity.**

---

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### 2. Installation
1. Clone or download this repository.
2. Place your logo image as `itskylogo.png` in the `public` directory.
3. In the project root, run:
   ```bash
   npm install
   ```

### 3. Running the App
Start the server with:
```bash
node server.js
```
You should see:
```
Server running on http://localhost:3000
```

### 4. Accessing the App
- **User Sign In:** [http://localhost:3000/signin.html](http://localhost:3000/signin.html)
- **User Sign Up:** [http://localhost:3000/signup.html](http://localhost:3000/signup.html)
- **Admin Sign In:** [http://localhost:3000/admin-signin.html](http://localhost:3000/admin-signin.html)
- **Admin Dashboard:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

## Usage

### Staff
- Register with your full name and a valid `@itskysolutions.com` email.
- Log in and use the "Clock In" button to mark your attendance for the day.
- View your attendance calendar for the current month.

### Admin
- Use the default admin account:
  - **Email:** `admin@itskysolutions.com`
  - **Password:** `admin`
- Log in via the Admin Sign In page.
- On the admin dashboard, search for users by name or email and view their monthly attendance.

---

## Customization
- **Logo:** Replace `itskylogo.png` in the `public` directory with your company logo.
- **Branding:** All pages use "ITSky Attendance" as the title and header.
- **Email Domain:** Only emails ending with `@itskysolutions.com` can register or log in.

---

## Troubleshooting
- **Port in use:** If you see `EADDRINUSE`, stop all running servers or restart your computer.
- **Database issues:** If you change the database schema, delete `attendance.db` and restart the server.
- **JSON parse errors:** Usually caused by backend errors or database issues. Check your terminal for errors and restart the server if needed.

---

## License
MIT 