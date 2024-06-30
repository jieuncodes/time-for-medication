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
