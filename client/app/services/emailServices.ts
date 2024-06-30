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

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate OTP');
    }
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};
