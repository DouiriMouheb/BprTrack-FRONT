# Authentication & User Management System# Authentication System# Authentication System



## Overview

This application uses JWT (JSON Web Token) authentication with a backend API for secure user authentication and includes a complete user management system.

## Overview## Overview

## Features

- **Login Modal**: Small lock button next to "Cert Engine" titleThis application uses JWT (JSON Web Token) authentication with a backend API for secure user authentication.This application now includes an admin authentication system with protected routes.

- **JWT-based Authentication**: Secure token-based authentication with 24-hour expiration

- **Protected Admin Route**: `/admin` route is protected and requires authentication

- **Token Storage**: JWT tokens stored in localStorage and automatically included in API requests

- **Auto Token Validation**: Tokens are validated on app load and automatically cleared when expired## Features## Features

- **Protected API Endpoints**: Most data endpoints require authentication

- **User Management**: Full CRUD operations for managing user accounts- **Login Modal**: Small lock button next to "Cert Engine" title- **Login Modal**: Small lock button next to "Cert Engine" title

- **Logout Functionality**: Admin page includes a logout button

- **JWT-based Authentication**: Secure token-based authentication with 24-hour expiration- **Protected Admin Route**: `/admin` route is protected and requires authentication

## Backend API Endpoints

- **Protected Admin Route**: `/admin` route is protected and requires authentication- **Session-based Auth**: Authentication persists during the current browser session

### Authentication Endpoints

- **POST** `http://localhost:5000/api/auth/login` - User login- **Token Storage**: JWT tokens stored in localStorage and automatically included in API requests- **Logout Functionality**: Admin page includes a logout button

  ```json

  Request: { - **Auto Token Validation**: Tokens are validated on app load and automatically cleared when expired

    "usernameOrEmail": "admin", 

    "password": "password123" - **Protected API Endpoints**: Most data endpoints require authentication## Default Credentials

  }

  - **Logout Functionality**: Admin page includes a logout buttonThe credentials are stored in the `.env` file:

  Success Response (200): {

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",- **Username**: `admin`

    "username": "admin",

    "email": "admin@example.com",## Backend API Endpoints- **Password**: `admin123`

    "roles": ["User"],

    "expiresAt": "2025-10-30T07:39:24.9062446Z"

  }

  ### Authentication Endpoints## Usage

  Error Response (401): {

    "message": "Invalid credentials"- **POST** `http://localhost:5000/api/auth/login` - User login

  }

    ```json### Accessing Admin Panel

  Validation Error (400): {

    "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",  Request: { "username": "string", "password": "string" }1. Click the lock icon button next to "Cert Engine" title

    "title": "One or more validation errors occurred.",

    "status": 400,  Response: { "token": "jwt_token", "user": { "username": "string" } }2. Enter credentials in the login modal

    "errors": {

      "Password": ["Password is required"]  ```3. Click "Login" button

    }

  }4. You'll be redirected to `/admin` page

  ```

- **POST** `http://localhost:5000/api/auth/register` - User registration

- **POST** `http://localhost:5000/api/auth/register` - User registration

  ```json  ```json### Logging Out

  Request: { 

    "username": "string",  Request: { "username": "string", "password": "string" }- Click the "Logout" button on the admin page

    "email": "email@example.com",

    "password": "string"   Response: { "token": "jwt_token", "user": { "username": "string" } }- You'll be redirected back to the home page

  }

    ```

  Success Response (200): {

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",## File Structure

    "username": "admin",

    "email": "admin@example.com",### Protected Data Endpoints```

    "roles": ["User"],

    "expiresAt": "2025-10-30T07:39:24.9062446Z"All `/api/Data` endpoints are protected with `[Authorize]` attribute **except**:src/

  }

  ```- **GET** `/api/Data/{chiaveRicerca}` - Public search endpoint with `[AllowAnonymous]`  ├── components/



### User Management Endpoints  │   ├── LoginModal.jsx       # Login form modal

All user management endpoints require authentication (JWT token in Authorization header).

### Security Features  │   ├── ProtectedRoute.jsx   # Route protection wrapper

- **GET** `/api/Users` - Get all users

  ```json- Passwords are securely hashed using BCrypt  │   ├── DataTable.jsx

  Response: [

    {- JWT tokens expire after 24 hours (configurable on backend)  │   └── Modal.jsx

      "id": "string",

      "username": "string",- Authorization header automatically included: `Bearer {token}`  ├── contexts/

      "email": "string",

      "roles": ["string"],  │   └── AuthContext.jsx      # Authentication context & logic

      "createdAt": "2025-10-29T08:05:26.062Z",

      "isActive": true## Usage  ├── pages/

    }

  ]  │   ├── CertEngine.jsx       # Home page with login button

  ```

### Accessing Admin Panel  │   └── Admin.jsx            # Protected admin dashboard

- **GET** `/api/Users/{id}` - Get user by ID

- **GET** `/api/Users/email/{email}` - Get user by email1. Click the lock icon button next to "Cert Engine" title  └── App.jsx                  # Router configuration

- **PUT** `/api/Users/{id}` - Update user

  ```json2. Enter your credentials in the login modal```

  Request: {

    "username": "string",3. Click "Login" button

    "email": "string",

    "roles": ["string"],4. JWT token is stored in localStorage## Environment Variables

    "isActive": true

  }5. You'll be redirected to `/admin` pageMake sure to create a `.env` file in the root directory:

  ```

- **DELETE** `/api/Users/{id}` - Delete user



### Protected Data Endpoints### Logging Out```env

All `/api/Data` endpoints are protected with `[Authorize]` attribute **except**:

- **GET** `/api/Data/{chiaveRicerca}` - Public search endpoint with `[AllowAnonymous]`- Click the "Logout" button on the admin pageVITE_ADMIN_USERNAME=admin



### Security Features- JWT token is removed from localStorageVITE_ADMIN_PASSWORD=admin123

- Passwords are securely hashed using BCrypt

- JWT tokens expire after 24 hours (configurable on backend)- You'll be redirected back to the home page```

- Authorization header automatically included: `Bearer {token}`



## Usage

## File Structure⚠️ **Security Note**: For production, replace hardcoded credentials with a proper backend authentication system.

### Accessing Admin Panel

1. Click the lock icon button next to "Cert Engine" title```

2. Enter your credentials in the login modal

3. Click "Login" buttonsrc/## Routes

4. JWT token is stored in localStorage

5. You'll be redirected to `/admin` page  ├── components/- `/` - Main CertEngine page (public)



### Managing Users  │   ├── LoginModal.jsx       # Login form modal with async JWT login- `/admin` - Admin dashboard (protected)

1. Login to the admin panel

2. Click the "User Management" tab  │   ├── ProtectedRoute.jsx   # Route protection wrapper

3. View all users with their details (username, email, roles, status, created date)

4. **Search**: Filter users by username or email  │   ├── DataTable.jsx## Technical Details

5. **Edit User**: Click edit icon to update user information

   - Update username  │   └── Modal.jsx- Uses React Context API for state management

   - Update email

   - Toggle active/inactive status  ├── contexts/- Session storage for persistence during browser session

6. **Delete User**: Click trash icon to remove a user (with confirmation)

  │   └── AuthContext.jsx      # Authentication context with JWT support- React Router for protected routes

### Logging Out

- Click the "Logout" button on the admin page  ├── services/- Toast notifications for user feedback

- JWT token is removed from localStorage

- You'll be redirected back to the home page  │   ├── authService.js       # JWT authentication service (NEW)

  │   ├── dataService.js       # Data API calls with auth headers

## File Structure  │   └── certificationService.js

```  ├── pages/

src/  │   ├── CertEngine.jsx       # Home page with login button

  ├── components/  │   └── Admin.jsx            # Protected admin dashboard

  │   ├── LoginModal.jsx       # Login form modal with async JWT login  └── App.jsx                  # Router configuration

  │   ├── ProtectedRoute.jsx   # Route protection wrapper```

  │   ├── UserManagement.jsx   # User management interface (NEW)

  │   ├── DataTable.jsx## Environment Variables

  │   └── Modal.jsxMake sure to create a `.env` file in the root directory:

  ├── contexts/

  │   └── AuthContext.jsx      # Authentication context with JWT support```env

  ├── services/VITE_API_BASE_URL=http://localhost:5000/api

  │   ├── authService.js       # JWT authentication serviceVITE_CERT_API_BASE_URL=http://172.31.95.29:5001/api

  │   ├── userService.js       # User management service (NEW)```

  │   ├── dataService.js       # Data API calls with auth headers

  │   └── certificationService.js## Routes

  ├── pages/- `/` - Main CertEngine page (public)

  │   ├── CertEngine.jsx       # Home page with login button- `/admin` - Admin dashboard (protected)

  │   └── Admin.jsx            # Protected admin dashboard with tabs

  └── App.jsx                  # Router configuration## Technical Details

```

### Token Management

## Environment Variables- JWT tokens stored in `localStorage` with key `jwt_token`

Make sure to create a `.env` file in the root directory:- User info stored in `localStorage` with key `user_info` (includes username, email, roles, expiresAt)

- Tokens automatically validated on app initialization using `expiresAt` field

```env- Expired tokens are automatically removed

VITE_API_BASE_URL=http://localhost:5000/api

VITE_CERT_API_BASE_URL=http://172.31.95.29:5001/api### API Request Flow

```1. User logs in via `authService.login()`

2. JWT token received and stored in localStorage

## Routes3. All protected API requests include `Authorization: Bearer {token}` header

- `/` - Main CertEngine page (public)4. Backend validates token on each request

- `/admin` - Admin dashboard (protected) with two tabs:5. Token expires after 24 hours, user must re-login

  - **Data Records**: View and certify data records

  - **User Management**: Manage user accounts### Authentication Service (`authService.js`)

Core functions:

## Technical Details- `login(usernameOrEmail, password)` - Authenticate user and store token

- `register(username, email, password)` - Register new user and store token

### Token Management- `logout()` - Clear stored token and user info

- JWT tokens stored in `localStorage` with key `jwt_token`- `getToken()` - Retrieve stored JWT token

- User info stored in `localStorage` with key `user_info` (includes username, email, roles, expiresAt)- `getUserInfo()` - Retrieve stored user information (username, email, roles, expiresAt)

- Tokens automatically validated on app initialization using `expiresAt` field- `isAuthenticated()` - Check if token exists and is not expired (uses expiresAt field)

- Expired tokens are automatically removed- `getAuthHeaders()` - Get Authorization header for API requests



### API Request Flow### Protected API Calls

1. User logs in via `authService.login()`The `dataService.js` automatically includes JWT token in protected endpoints:

2. JWT token received and stored in localStorage- `getAllData()` - Get all records (protected)

3. All protected API requests include `Authorization: Bearer {token}` header- `batchUpdateTicket()` - Update ticket IDs (protected)

4. Backend validates token on each request- `batchUpdatePrice()` - Update pricing (protected)

5. Token expires after 24 hours, user must re-login- `updateProofs()` - Update proofs (protected)

- `batchUpdateCertified()` - Update certified status (protected)

### Authentication Service (`authService.js`)

Core functions:Public endpoint (no auth required):

- `login(usernameOrEmail, password)` - Authenticate user and store token- `searchData(chiaveRicerca)` - Search by key (public with `[AllowAnonymous]`)

- `register(username, email, password)` - Register new user and store token

- `logout()` - Clear stored token and user info## Security Best Practices

- `getToken()` - Retrieve stored JWT token✅ Passwords hashed with BCrypt on backend  

- `getUserInfo()` - Retrieve stored user information (username, email, roles, expiresAt)✅ JWT tokens with 24-hour expiration  

- `isAuthenticated()` - Check if token exists and is not expired (uses expiresAt field)✅ Automatic token expiration handling  

- `getAuthHeaders()` - Get Authorization header for API requests✅ Protected API endpoints with Authorization attribute  

✅ HTTPS recommended for production  

### User Service (`userService.js`) - NEW✅ Token stored in localStorage (consider httpOnly cookies for enhanced security in production)

Core functions:

- `getAllUsers()` - Get all users from the system⚠️ **Production Considerations**:

- `getUserById(userId)` - Get specific user by ID- Use HTTPS for all API communication

- `getUserByEmail(email)` - Get user by email address- Consider implementing refresh tokens for better UX

- `updateUser(userId, userData)` - Update user information- Implement rate limiting on authentication endpoints

- `deleteUser(userId)` - Delete a user account- Add CORS configuration for production domains

- Consider moving to httpOnly cookies to prevent XSS attacks

### Protected API Calls
The `dataService.js` and `userService.js` automatically include JWT token in protected endpoints:

**Data Service:**
- `getAllData()` - Get all records (protected)
- `batchUpdateTicket()` - Update ticket IDs (protected)
- `batchUpdatePrice()` - Update pricing (protected)
- `updateProofs()` - Update proofs (protected)
- `batchUpdateCertified()` - Update certified status (protected)

**User Service:**
- `getAllUsers()` - Get all users (protected)
- `getUserById()` - Get user by ID (protected)
- `getUserByEmail()` - Get user by email (protected)
- `updateUser()` - Update user (protected)
- `deleteUser()` - Delete user (protected)

Public endpoint (no auth required):
- `searchData(chiaveRicerca)` - Search by key (public with `[AllowAnonymous]`)

## Security Best Practices
✅ Passwords hashed with BCrypt on backend  
✅ JWT tokens with 24-hour expiration  
✅ Automatic token expiration handling  
✅ Protected API endpoints with Authorization attribute  
✅ HTTPS recommended for production  
✅ Token stored in localStorage (consider httpOnly cookies for enhanced security in production)  
✅ User confirmation before deleting accounts  

⚠️ **Production Considerations**:
- Use HTTPS for all API communication
- Consider implementing refresh tokens for better UX
- Implement rate limiting on authentication endpoints
- Add CORS configuration for production domains
- Consider moving to httpOnly cookies to prevent XSS attacks
- Implement role-based access control for user management
- Add audit logging for user account changes
