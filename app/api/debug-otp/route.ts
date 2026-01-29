import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email parameter required. Usage: /api/debug-otp?email=test@example.com',
      });
    }

    const key = `otp:${email.toLowerCase().trim()}`;
    const storedOTP = await redis.get(key);

    return NextResponse.json({
      success: true,
      email,
      key,
      storedOTP,
      type: typeof storedOTP,
      exists: !!storedOTP,
    });
  } catch (error: any) {
    console.error('Debug OTP error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
