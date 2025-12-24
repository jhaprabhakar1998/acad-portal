# OTP Implementation Summary

## Overview
Complete Node.js implementation of the OTP sending and verification flow from PHP VMC application.

## Files Created

### 1. Analysis Document
- **File**: `ANALYSIS_OTP_FLOW.md`
- **Purpose**: Comprehensive analysis of PHP OTP flow and Node.js implementation plan

### 2. Database Schema
- **File**: `db-setup/student_otp_schema.sql`
- **Purpose**: SQL schema for storing OTPs with expiration and usage tracking

### 3. Services

#### SMS Service
- **File**: `src/services/sms.service.ts`
- **Purpose**: Handles SMS sending via foxxsms.net API
- **Features**:
  - Mobile number validation
  - SMS API integration
  - Mock mode for development

#### OTP Service
- **File**: `src/services/otp.service.ts`
- **Purpose**: Manages OTP lifecycle
- **Features**:
  - OTP generation (6-digit)
  - Database storage with expiration
  - Rate limiting (5 requests per hour)
  - OTP verification
  - Expired OTP cleanup

### 4. Controllers
- **File**: `src/controllers/Students.controller.ts`
- **Methods Added**:
  - `sendOtp`: Sends OTP to mobile number
  - `verifyOtp`: Verifies OTP and creates session

### 5. Middleware
- **File**: `src/middlewares/session.middleware.ts`
- **Purpose**: Session management
- **Features**:
  - Express-session configuration
  - Authentication middleware
  - User session helpers

### 6. Routes
- **File**: `src/routes/index.ts`
- **Endpoints Added**:
  - `POST /api/v1/students/send-otp`
  - `POST /api/v1/students/verify-otp`

## API Endpoints

### 1. Get Mobile Numbers for OTP
**Endpoint**: `POST /api/v1/students/get-mobile-for-otp`

**Request**:
```json
{
  "roll_number": "ROLL001"
}
```

**Response**:
```json
{
  "msg": "OTP sent successfully",
  "deatil_rollnumber": "ROLL001",
  "rtadioHtml": "<label>...</label>",
  "errcode": 0
}
```

### 2. Send OTP
**Endpoint**: `POST /api/v1/students/send-otp`

**Request**:
```json
{
  "roll_number": "ROLL001",
  "mobile_number": "9876543210"
}
```

**Response**:
```json
{
  "msg": "OTP sent successfully",
  "errcode": 0
}
```

### 3. Verify OTP
**Endpoint**: `POST /api/v1/students/verify-otp`

**Request**:
```json
{
  "roll_number": "ROLL001",
  "mobile_number": "9876543210",
  "otp": "123456"
}
```

**Response**:
```json
{
  "msg": "OTP Verified, Thanks",
  "errcode": 0
}
```

## Security Improvements Over PHP

1. **OTP Storage**: OTPs are stored in database (not returned in response)
2. **Expiration**: OTPs expire after 10 minutes (configurable)
3. **Rate Limiting**: Maximum 5 OTP requests per hour per phone/roll
4. **One-time Use**: OTPs are marked as used after verification
5. **Session Security**: HttpOnly, Secure cookies in production

## Environment Variables

Add to `.env.local`:

```env
# SMS Configuration
SMS_API_URL=http://foxxsms.net/sms//submitsms.jsp
SMS_API_USER=VMCINF1
SMS_API_KEY=df9e61553eXX
SMS_SENDER_ID=VMCINF
SMS_MOCK=false  # Set to true to mock SMS in development

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
OTP_RATE_LIMIT_PER_HOUR=5

# Session Configuration
SESSION_SECRET=your-secret-key-change-in-production
SESSION_MAX_AGE=7200000  # 2 hours in milliseconds

# CORS
FRONTEND_URL=http://localhost:5173
```

## Setup Steps

1. **Create OTP Table**:
   ```bash
   mysql -u your_user -p your_database < db-setup/student_otp_schema.sql
   ```

2. **Install Dependencies** (if needed):
   ```bash
   npm install express-session @types/express-session
   ```

3. **Configure Environment**: Add variables to `.env.local`

4. **Start Server**:
   ```bash
   npm run dev
   ```

## Flow Diagram

```
1. User enters roll number
   → POST /students/get-mobile-for-otp
   → Returns masked phone numbers

2. User selects phone number
   → POST /students/send-otp
   → Generates OTP
   → Stores in database (expires in 10 min)
   → Sends SMS
   → Returns success

3. User enters OTP
   → POST /students/verify-otp
   → Validates OTP from database
   → Checks expiration
   → Marks as used
   → Creates session (_user)
   → Returns success

4. Subsequent requests
   → Session cookie sent automatically
   → req.session._user contains student data
```

## Session Management

- **Storage**: Memory store (default) - can be upgraded to Redis/MySQL
- **Cookie Name**: `vmc_session`
- **Lifetime**: 2 hours
- **Security**: HttpOnly, Secure (production), SameSite strict
- **Access**: `req.session._user` contains student object

## Testing

### Test OTP Flow:
```bash
# 1. Get mobile numbers
curl -X POST http://localhost:30000/api/v1/students/get-mobile-for-otp \
  -H "Content-Type: application/json" \
  -d '{"roll_number": "ROLL001"}'

# 2. Send OTP (with session cookie from step 1)
curl -X POST http://localhost:30000/api/v1/students/send-otp \
  -H "Content-Type: application/json" \
  -d '{"roll_number": "ROLL001", "mobile_number": "9876543210"}'

# 3. Verify OTP
curl -X POST http://localhost:30000/api/v1/students/verify-otp \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{"roll_number": "ROLL001", "mobile_number": "9876543210", "otp": "123456"}'
```

## Database Queries

### Check OTP Status:
```sql
SELECT * FROM student_otp 
WHERE roll_number = 'ROLL001' 
ORDER BY created_at DESC;
```

### Cleanup Expired OTPs:
```sql
DELETE FROM student_otp 
WHERE expires_at < NOW() OR is_used = 1;
```

## Notes

- OTP is NOT returned in API response (security improvement)
- In development mode, OTP is logged to console if SMS_MOCK=true
- Rate limiting prevents abuse
- Sessions are stored in memory (consider Redis for production)
- All OTPs expire after 10 minutes

