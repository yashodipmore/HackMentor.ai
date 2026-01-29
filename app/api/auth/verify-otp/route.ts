import { NextResponse } from 'next/server';
import { verifyOTP, createUser, generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, otp, password, name } = await request.json();

    console.log('Verify OTP Request:', { email, otp: otp?.substring(0, 3) + '***', hasPassword: !!password });

    if (!email || !otp || !password) {
      return NextResponse.json(
        { success: false, error: 'Email, OTP, and password are required' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    
    console.log('OTP Verification Result:', isValid);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(email, password, name);

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
