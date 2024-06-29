import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const generateOtp = async (email: string): Promise<string> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/generate-otp`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await response.json();
  if (!response.ok || !data.otp) {
    throw new Error(data.error || 'Failed to generate OTP');
  }

  return data.otp;
};
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.RESEND_API_KEY,
    },
  });
};

const sendEmail = async (
  email: string,
  subject: string,
  text: string
): Promise<void> => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: subject,
    text: text,
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, subject } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    try {
      const otp = await generateOtp(email);

      await sendEmail(
        email,
        subject || 'Your OTP Code',
        `Please use the following OTP to verify your email: ${otp}`
      );

      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending email:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
