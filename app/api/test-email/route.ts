import { NextResponse } from 'next/server';
import { verifyEmailConfig, sendOTPEmail } from '@/lib/nodemailer';

export async function GET() {
  try {
    // Verify email configuration
    const isConfigValid = await verifyEmailConfig();
    
    if (!isConfigValid) {
      return NextResponse.json({
        success: false,
        error: 'Email configuration is invalid. Check your Gmail credentials.',
      }, { status: 500 });
    }

    // Send test OTP
    const testOTP = '123456';
    const testEmail = process.env.EMAIL_USER || 'test@example.com';
    
    await sendOTPEmail(testEmail, testOTP);

    return NextResponse.json({
      success: true,
      message: 'Email configuration is working! Test OTP sent.',
      testEmail,
      testOTP,
    });
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: error.toString(),
    }, { status: 500 });
  }
}
