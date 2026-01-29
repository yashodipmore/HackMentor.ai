import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error('Missing EMAIL_USER or EMAIL_PASSWORD environment variables');
}

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send OTP email
export async function sendOTPEmail(email: string, otp: string) {
  try {
    const mailOptions = {
      from: `"HackMentor AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your HackMentor AI Verification Code',
      html: `
        <div style="font-family: 'Playfair Display', serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="color: #7c3aed; font-size: 32px; margin: 0;">HackMentor.AI</h1>
            <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">Your AI Pair Programming Mentor</p>
          </div>
          
          <div style="background: linear-gradient(to bottom right, #ffffff, #f3e8ff); border: 2px solid #e9d5ff; border-radius: 16px; padding: 32px; text-align: center;">
            <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">Verification Code</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Enter this code to complete your signup:</p>
            
            <div style="background: white; border: 3px solid #7c3aed; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <span style="font-size: 48px; font-weight: bold; color: #7c3aed; letter-spacing: 8px;">${otp}</span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">This code expires in 10 minutes.</p>
          </div>
          
          <div style="text-align: center; margin-top: 32px; color: #9ca3af; font-size: 14px;">
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer error:', error);
    throw error;
  }
}

// Verify transporter configuration
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
}
