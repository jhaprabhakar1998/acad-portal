# OTP Flow Analysis - PHP to Node.js Implementation

## Overview
This document provides a thorough analysis of the OTP sending and verification flow in the PHP VMC application and how to implement it in Node.js.

## PHP Implementation Analysis

### 1. OTP Sending Flow (`send_message_otp`)

**Location**: `StudentsController.php` (line 326-380)

**Process**:
1. Receives `roll_number` and `mobileno` from request
2. Generates random 6-digit OTP (100000-999999)
3. Sends SMS via foxxsms.net API
4. **Returns OTP in response** (security concern - should be stored in DB)

**SMS API Details**:
- URL: `http://foxxsms.net/sms//submitsms.jsp`
- Parameters:
  - `user`: VMCINF1
  - `key`: df9e61553eXX
  - `mobile`: 91 + mobileno (country code prefix)
  - `message`: URL encoded OTP message
  - `senderid`: VMCINF
  - `accusage`: 1

**Response Format**:
```json
{
  "msg": "OTP sent successfully",
  "deatilid": "123456",  // OTP value (security issue)
  "deatil_rollnumber": "ROLL001",
  "mobilenumber": "919876543210",
  "errcode": 0
}
```

**Issues Identified**:
- OTP returned in response (security vulnerability)
- No database storage of OTP
- No expiration time
- No rate limiting

### 2. OTP Verification Flow (`logint_with_otp`)

**Location**: `StudentsController.php` (line 383-415)

**Process**:
1. Receives `mobilenumber`, `otp`, `deatil_id` (OTP sent), `roll_number`
2. Compares `otp == deatil_id` (simple string comparison)
3. If match:
   - Fetches student from database by `roll_number`
   - Stores student object in session with key `'_user'`
   - Returns success response
4. If mismatch: Returns error response

**Response Format (Success)**:
```json
{
  "msg": "OTP Verified, Thanks",
  "errcode": 0
}
```

**Response Format (Error)**:
```json
{
  "msg": "OTP Not Match, Please try again",
  "errcode": 1
}
```

### 3. Session Management

**Storage**:
- Laravel uses file-based sessions by default
- Location: `storage/framework/sessions`
- Session lifetime: 120 minutes (configurable)
- Session driver: file (can be database, redis, etc.)

**Session Key**: `'_user'`
**Session Value**: Complete student object from database

**Session Usage**:
- Set: `$req->session()->put('_user', $user)`
- Get: `session('_user')` or `$request->session()->get('_user')`
- Check: `Session::has('_user')`
- Flush: `$request->session()->flush()`

### 4. Database Structure

**Student Table** (`mysql_vmc_test.student`):
- `id`: Primary key
- `roll_number`: Unique identifier
- `phone_number`: Student phone
- `guardian_phone_number`: Guardian phone
- `father_no`: Father phone
- `mother_no`: Mother phone
- Other student fields...

**OTP Tables** (for reference - used in other flows):
- `otp_forgot_passwords`: For forgot password OTP
- `otp_change_parent_phone_numbers`: For phone change OTP
- Structure: `id`, `mobile_number`, `otp`, `is_used`, `created_at`, `updated_at`

**Note**: Login OTP is NOT stored in database (security issue)

## Node.js Implementation Plan

### 1. Database Schema

Create `student_otp` table:
```sql
CREATE TABLE student_otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roll_number VARCHAR(50) NOT NULL,
  mobile_number VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  is_used TINYINT(1) DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_roll_mobile (roll_number, mobile_number),
  INDEX idx_expires (expires_at)
);
```

### 2. Architecture

**Components**:
1. **OTP Service**: Handles OTP generation, storage, validation
2. **SMS Service**: Handles SMS sending via API
3. **OTP Controller**: HTTP endpoints for send/verify
4. **Session Middleware**: Manages user sessions
5. **Database**: Store OTP with expiration

### 3. Security Improvements

1. **Store OTP in Database**: Don't return OTP in response
2. **Expiration Time**: OTP expires after 5-10 minutes
3. **Rate Limiting**: Limit OTP requests per phone/roll number
4. **One-time Use**: Mark OTP as used after verification
5. **Hash OTP**: Optional - hash OTP before storing

### 4. Flow Diagram

```
1. User enters roll number → get_mobileno_for_otp
2. User selects phone → send_otp
   - Generate OTP
   - Store in database with expiration
   - Send SMS
   - Return success (NO OTP in response)
3. User enters OTP → verify_otp
   - Fetch OTP from database
   - Check expiration
   - Verify OTP
   - Mark as used
   - Create session
   - Return success
```

### 5. Session Management

**Options**:
1. **express-session**: File-based or memory store
2. **express-session + MySQL**: Store sessions in database
3. **express-session + Redis**: Store sessions in Redis (recommended for production)

**Session Configuration**:
- Cookie name: `vmc_session`
- Max age: 2 hours (120 minutes)
- HttpOnly: true
- Secure: true (in production)
- SameSite: 'strict'

## Implementation Files

1. `db-setup/student_otp_schema.sql` - Database schema
2. `src/services/sms.service.ts` - SMS sending service
3. `src/services/otp.service.ts` - OTP management service
4. `src/controllers/Otp.controller.ts` - OTP endpoints
5. `src/middlewares/session.middleware.ts` - Session management
6. `src/middlewares/auth.middleware.ts` - Authentication check
7. Routes configuration

## Environment Variables

```env
# SMS Configuration
SMS_API_URL=http://foxxsms.net/sms//submitsms.jsp
SMS_API_USER=VMCINF1
SMS_API_KEY=df9e61553eXX
SMS_SENDER_ID=VMCINF

# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
OTP_RATE_LIMIT_PER_HOUR=5

# Session Configuration
SESSION_SECRET=your-secret-key-here
SESSION_MAX_AGE=7200000  # 2 hours in milliseconds
```

## API Endpoints

### POST /api/v1/students/send-otp
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

### POST /api/v1/students/verify-otp
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

## Testing

1. Test OTP generation and storage
2. Test SMS sending (mock in development)
3. Test OTP verification
4. Test expiration handling
5. Test rate limiting
6. Test session creation
7. Test invalid OTP handling

