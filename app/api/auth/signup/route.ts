import { NextResponse } from 'next/server';
import { generateOTP, storeOTP, getUserByEmail } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    console.log('Signup Request:', { email, name });

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered. Please login.' },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    console.log('Generated OTP:', otp, 'for email:', email);
    
    await storeOTP(email, otp);

    // Send OTP email
    await sendOTPEmail(email, otp);
    
    console.log('OTP email sent successfully to:', email);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email. Please verify.',
      debug: { otp } // REMOVE THIS IN PRODUCTION!
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
