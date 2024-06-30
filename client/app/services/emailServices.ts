export const sendVerificationEmail = async ({ email }: { email: string }) => {
  try {
    const response = await fetch('/api/auth/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'An unexpected error occurred.' };
  }
};

export const compareUserOTP = async ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  try {
    console.log(
      'process.env.NEXT_PUBLIC_API_URL',
      process.env.NEXT_PUBLIC_API_URL
    );
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: `An unexpected error occurred.: ${error}` };
  }
};
