import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '../inputs/FormInput';
import { Button } from '../ui/button';
import { FunnelDesc, FunnelTitle } from '../../styles/funnel.styles';
import { EmailSchema, TEmailSchema } from '@/lib/validators/auth-validators';
import { SingleContent } from '../common';
import { useFunnel } from '@/providers/FunnelProvider';
import { useState } from 'react';
import LoadingSpinner from '../icons/LoadingSpinner';

const EmailForm = ({
  setEmail,
}: {
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const [loading, setLoading] = useState(false);

  const { toNext } = useFunnel();
  const defaultValues = {
    email: '',
  };
  const emailForm = useForm<TEmailSchema>({
    resolver: zodResolver(EmailSchema),
    defaultValues,
  });

  const checkEmailExists = async (email: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-duplicate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();
    if (data.exists) {
      // Handle duplicate email case
      return true;
    } else {
      // Handle non-duplicate email case
      return false;
    }
  };

  const onSubmitEmail = async () => {
    setLoading(true);

    try {
      const data = emailForm.getValues();
      setEmail(data.email);

      const emailExists = await checkEmailExists(data.email);

      if (emailExists) {
        console.log('exists');
      }
      //TODO: if error
      // setLoading(false);

      toNext();
    } catch (error) {
      console.error('Error in onSubmitEmail:', error);
      setLoading(false);
    }
  };

  return (
    <SingleContent>
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
          <FunnelTitle>Welcome!</FunnelTitle>
          <FunnelDesc>
            Let's strat with your email to create an account
          </FunnelDesc>
          <FormInput
            name="email"
            form={emailForm}
            placeholder="your-email@google.com"
            moreStyles="mt-10 mb-8"
          />
          <Button type="submit" size={'full'} disabled={loading}>
            {loading && <LoadingSpinner />}
            Verify
          </Button>
        </form>
      </Form>
    </SingleContent>
  );
};

export default EmailForm;
