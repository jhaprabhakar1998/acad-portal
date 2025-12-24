# OTP Flow Quick Reference

## Complete Flow

### Step 1: Get Mobile Numbers
**Endpoint**: `POST /api/v1/students/get-mobile-for-otp`
- User enters roll number
- Returns masked phone numbers as HTML radio buttons
- User selects a phone number

### Step 2: Send OTP
**Endpoint**: `POST /api/v1/students/send-otp`
- Validates mobile number belongs to roll number
- Generates 6-digit OTP
- Stores in `student_otp` table (expires in 10 min)
- Sends SMS via foxxsms.net API
- Returns success (OTP NOT in response)

### Step 3: Verify OTP
**Endpoint**: `POST /api/v1/students/verify-otp`
- Validates OTP from database
- Checks expiration
- Marks OTP as used
- Creates session (`req.session._user`)
- Returns success

## Database Tables

### student_otp
```sql
- id (PK)
- roll_number
- mobile_number
- otp (6 digits)
- is_used (0/1)
- expires_at (datetime)
- created_at
- updated_at
```

## Session Storage

- **Key**: `_user`
- **Value**: Complete student object from database
- **Lifetime**: 2 hours
- **Access**: `req.session._user`

## Environment Variables Required

```env
# SMS
SMS_API_URL=http://foxxsms.net/sms//submitsms.jsp
SMS_API_USER=VMCINF1
SMS_API_KEY=df9e61553eXX
SMS_SENDER_ID=VMCINF

# OTP
OTP_EXPIRY_MINUTES=10
OTP_RATE_LIMIT_PER_HOUR=5

# Session
SESSION_SECRET=your-secret-key
SESSION_MAX_AGE=7200000
FRONTEND_URL=http://localhost:5173
```

## Security Features

✅ OTP stored in database (not returned)
✅ Expiration (10 minutes)
✅ Rate limiting (5/hour)
✅ One-time use
✅ Session security (HttpOnly, Secure)

## Testing in Development

Set `SMS_MOCK=true` to log OTP to console instead of sending SMS.

