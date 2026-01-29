import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
  } catch {
    return null;
  }
}

// Store OTP in Redis (with 10 min expiry)
export async function storeOTP(email: string, otp: string) {
  const { redis } = await import('./redis');
  
  const key = `otp:${email.toLowerCase().trim()}`;
  const otpValue = otp.toString().trim();
  
  console.log('Storing OTP:', { email, key, otp: otpValue });
  
  await redis.set(key, otpValue, { ex: 600 }); // 10 minutes
  
  // Verify it was stored
  const verify = await redis.get(key);
  console.log('Verified stored OTP:', verify);
}

// Verify OTP from Redis
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
  const { redis } = await import('./redis');
  
  const key = `otp:${email.toLowerCase().trim()}`;
  const inputOTP = otp.toString().trim();
  
  console.log('Verifying OTP:', { email, key, inputOTP });
  
  const storedOTP = await redis.get(key);
  console.log('Stored OTP from Redis:', storedOTP, 'Type:', typeof storedOTP);
  
  if (!storedOTP) {
    console.log('No OTP found in Redis for key:', key);
    return false;
  }
  
  // Convert both to strings and compare
  const storedOTPStr = String(storedOTP).trim();
  const inputOTPStr = String(inputOTP).trim();
  
  console.log('Comparing:', { storedOTPStr, inputOTPStr, match: storedOTPStr === inputOTPStr });
  
  if (storedOTPStr === inputOTPStr) {
    await redis.del(key); // Delete after verification
    console.log('OTP verified successfully!');
    return true;
  }
  
  console.log('OTP mismatch!');
  return false;
}

// Create user in Supabase
export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: hashedPassword,
      name: name || email.split('@')[0],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get user by email
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  
  const { error } = await supabase
    .from('users')
    .update({ password_hash: hashedPassword })
    .eq('id', userId);

  if (error) throw error;
}
