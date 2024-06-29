import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, subject, message } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.RESEND_API_KEY,
      },
    });

    try {
      await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: subject,
        text: message,
      });

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
