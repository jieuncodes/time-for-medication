import { Form } from '@/components/ui/form';
import { EmailSchema, TEmailSchema } from '@/lib/validators/auth-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '../inputs/FormInput';
import { Button } from '../ui/button';
import tw from 'tailwind-styled-components';

const EmailForm = ({ toNext }: { toNext: () => void }) => {
  const emailForm = useForm<TEmailSchema>({
    resolver: zodResolver(EmailSchema),
  });

  const onSubmitEmail = async () => {
    try {
      toNext();
    } catch (error) {
      console.error('Error in onSubmitEmail:', error);
    }
  };

  return (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(onSubmitEmail)}>
        <FunnelTitle>
          Let's strat with your email to create an account
        </FunnelTitle>
        <FormInput name="email" form={emailForm} label="Email" />
        <Button type="submit" size={'full'}>
          Verify
        </Button>
      </form>
    </Form>
  );
};

export default EmailForm;

const FunnelTitle = tw.h1`
  mb-4
  text-2xl
  font-semibold
`;
