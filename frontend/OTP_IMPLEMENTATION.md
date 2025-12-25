# OTP Flow Implementation - Frontend

## Overview
Complete frontend implementation of the OTP sending and verification flow with modal dialog and routing.

## Components Created

### 1. Modal Component (`components/ui/Modal.jsx`)
- Reusable modal dialog component
- Supports close button, escape key, and overlay click
- Prevents body scroll when open
- Smooth animations

### 2. OTP Modal Component (`components/OtpModal.jsx`)
- Specialized modal for OTP verification
- Features:
  - 6-digit OTP input with auto-formatting
  - Resend OTP with 60-second cooldown
  - Loading states
  - Error display
  - Cancel and Verify buttons

### 3. Student Profile Page (`pages/StudentProfile.jsx`)
- Placeholder page after successful login
- Can be extended with actual profile content

## API Integration

### Updated API Service (`services/api.js`)
Added methods:
- `sendOtp(rollNumber, mobileNumber)` - Sends OTP to mobile
- `verifyOtp(rollNumber, mobileNumber, otp)` - Verifies OTP and creates session

**Response Handling**:
- API returns `{ errcode: 0 }` for success
- API returns `{ errcode: 1, msg: "..." }` for errors
- All responses include credentials for session cookies

## Flow Implementation

### Step 1: Roll Number Input
- User enters roll number
- Clicks "Request OTP"
- API: `POST /students/get-mobile-for-otp`

### Step 2: Phone Selection
- Shows masked phone numbers as radio buttons
- User selects phone number
- Clicks "Send OTP"
- API: `POST /students/send-otp`
- Opens OTP modal on success

### Step 3: OTP Verification
- Modal opens with OTP input
- User enters 6-digit OTP
- Clicks "Verify OTP"
- API: `POST /students/verify-otp`
- On success: Redirects to `/student_profile`
- Session cookie is automatically stored

### Step 4: Resend OTP
- User clicks "click here" link
- 60-second cooldown timer
- API: `POST /students/send-otp` (same as send)
- New OTP sent, old one invalidated

## Routing

Using `react-router-dom`:
- `/` - Login page
- `/student_profile` - Student profile page (after login)
- `*` - Redirects to `/`

## State Management

### LoginPage State:
- `rollNumber` - Current roll number
- `loading` - Loading state for API calls
- `error` - Error messages
- `phoneNumbers` - Available phone numbers
- `selectedPhone` - Selected phone number
- `rollNumberSubmitted` - Whether roll number step is complete
- `otpModalOpen` - OTP modal visibility
- `otpLoading` - OTP verification loading
- `otpError` - OTP verification errors

## Features

### OTP Modal Features:
1. **Auto-formatting**: Only accepts digits, max 6 characters
2. **Resend Cooldown**: 60-second timer prevents spam
3. **Loading States**: Shows "Verifying..." during API call
4. **Error Handling**: Displays error messages
5. **Keyboard Support**: Escape key closes modal
6. **Accessibility**: Proper ARIA labels and focus management

### Security:
- Session cookies with `credentials: 'include'`
- HttpOnly cookies (handled by backend)
- Secure cookies in production

## Styling

### Modal Design:
- Light blue header (`#5ba3f5` to `#4a90e2`)
- White body
- Smooth animations (fade in, slide up)
- Responsive design

### Button Colors:
- Cancel: Yellow/Gold (`#f0b429`)
- Verify: Dark Blue (`#1a1a1f`)

## Extensibility

### Adding New Pages:
1. Create page component in `pages/`
2. Add route in `App.jsx`
3. Use `useNavigate()` for navigation

### Adding Protected Routes:
```jsx
// Create auth middleware
const ProtectedRoute = ({ children }) => {
  // Check session/auth state
  // Redirect to login if not authenticated
};
```

### Extending OTP Modal:
- Add props for custom callbacks
- Add additional validation
- Add OTP auto-submit on 6 digits (optional)

## Testing

### Test Flow:
1. Enter roll number → Should show phone numbers
2. Select phone → Click "Send OTP" → Modal should open
3. Enter OTP → Click "Verify" → Should redirect to profile
4. Test resend → Should show cooldown timer
5. Test invalid OTP → Should show error

### Test Cases:
- Invalid roll number
- No phone numbers found
- OTP send failure
- Invalid OTP
- Expired OTP
- Resend functionality
- Session persistence

## Environment

No additional environment variables needed for frontend.
Backend API URL is hardcoded: `http://localhost:30000/api/v1`

## Dependencies Added

- `react-router-dom`: ^6.20.0 - For routing and navigation

## Next Steps

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Test the Flow**:
   - Navigate to `http://localhost:5173`
   - Test complete OTP flow
   - Verify session persistence

4. **Extend Student Profile**:
   - Add actual profile content
   - Fetch student data from API
   - Add logout functionality

