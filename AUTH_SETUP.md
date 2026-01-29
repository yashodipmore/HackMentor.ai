# 🔐 Authentication Setup - HackMentor AI

## Overview
Complete OTP-based signup + Email/Password login system using:
- **Nodemailer** for email delivery (OTP codes via Gmail)
- **JWT** for session management
- **bcryptjs** for password hashing
- **Upstash Redis** for OTP storage (10 min expiry)
- **Supabase** for user data

---

## 🚀 Quick Start

### 1. Database Migration
Run this SQL in your Supabase SQL Editor:

```sql
-- Add authentication fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

Or run the full migration file: `supabase/migration-add-auth.sql`

### 2. Environment Variables
Already added to `.env.local`:
```env
JWT_SECRET=hackmentor_super_secret_key_2024_change_in_production
EMAIL_USER=yashodipmore2004@gmail.com
EMAIL_PASSWORD=qtke qigy twey idrj
```

### 3. Test the Flow

#### Signup Flow:
1. Go to: `http://localhost:3000/auth`
2. Click "Sign up"
3. Enter email and name
4. Click "Send OTP"
5. Check email for 6-digit code
6. Enter OTP + create password
7. Click "Verify & Create Account"
8. Redirects to dashboard

#### Login Flow:
1. Go to: `http://localhost:3000/auth`
2. Enter email + password
3. Click "Login"
4. Redirects to dashboard

---

## 📁 Files Created

### Backend (API Routes)
- `app/api/auth/signup/route.ts` - Send OTP email
- `app/api/auth/verify-otp/route.ts` - Verify OTP & create account
- `app/api/auth/login/route.ts` - Email/password login
- `app/api/auth/me/route.ts` - Get current user (JWT verification)

### Libraries
- `lib/auth.ts` - Auth helpers (JWT, bcrypt, OTP, user CRUD)
- `lib/nodemailer.ts` - Email sending with Gmail

### Frontend
- `app/auth/page.tsx` - Beautiful auth UI (login/signup/verify)

### Database
- `supabase/schema.sql` - Updated with `password_hash` and `email_verified`
- `supabase/migration-add-auth.sql` - Migration for existing tables

---

## 🔑 API Endpoints

### POST `/api/auth/signup`
Send OTP to email for signup
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "OTP sent to your email. Please verify."
}
```

### POST `/api/auth/verify-otp`
Verify OTP and create account
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response:
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST `/api/auth/login`
Login with email/password
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### GET `/api/auth/me`
Get current user (requires Bearer token)
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

Response:
```json
{
  "success": true,
  "user": {
    "userId": "uuid",
    "email": "user@example.com"
  }
}
```

---

## 🎨 UI Features

### Auth Page (`/auth`)
- Clean white + purple theme
- Playfair Display font
- 3 modes: Login, Signup, Verify OTP
- Smooth transitions
- Error/success messages
- Loading states
- Responsive design

### Dashboard Protection
- Auto-redirect to `/auth` if not logged in
- User info in navbar
- Logout button
- Token stored in localStorage

---

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds = 10
2. **JWT Tokens**: 7-day expiry
3. **OTP Expiry**: 10 minutes in Redis
4. **Email Verification**: OTP-based signup
5. **Protected Routes**: Dashboard checks auth on mount
6. **Secure Storage**: Tokens in localStorage (client-side)

---

## 🧪 Testing

### Test Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📧 Email Template

OTP emails are beautifully designed with:
- HackMentor.AI branding
- Large 6-digit code display
- Purple gradient background
- Professional typography
- 10-minute expiry notice

---

## 🐛 Troubleshooting

### "Email already registered"
- User exists, use login instead
- Or use different email

### "Invalid or expired OTP"
- OTP expires in 10 minutes
- Request new OTP by going back to signup

### "Invalid email or password"
- Check credentials
- Password is case-sensitive

### Nodemailer/Gmail Error
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env.local`
- Ensure Gmail App Password is correct (not regular password)
- Enable 2-Step Verification in Gmail
- Generate App Password from: https://myaccount.google.com/apppasswords
- Check Gmail "Less secure app access" settings

### Redis Connection Error
- Check `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Verify Upstash Redis is active

---

## 🚀 Next Steps

1. Run database migration
2. Test signup flow
3. Test login flow
4. Customize email template in `lib/nodemailer.ts`
5. Add password reset functionality (optional)
6. Add social login (Google, GitHub) (optional)

---

## 📝 Notes

- **Production**: Change `JWT_SECRET` to a strong random string
- **Gmail**: Using App Password for authentication (more secure than regular password)
- **Email Limits**: Gmail has daily sending limits (500 emails/day for free accounts)
- **Token Storage**: Consider using httpOnly cookies for better security in production
- **Rate Limiting**: Add rate limiting to prevent OTP spam

---

**Status**: ✅ Ready to use with Nodemailer + Gmail!
