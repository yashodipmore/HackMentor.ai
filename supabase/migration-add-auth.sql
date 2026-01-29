-- Migration: Add authentication fields to users table
-- Run this in Supabase SQL Editor

-- Add password_hash column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Done! Now you can use email/password authentication
