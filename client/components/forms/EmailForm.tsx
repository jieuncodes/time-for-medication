import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '../inputs/FormInput';
import { Button } from '../ui/button';
import { FunnelDesc, FunnelTitle } from '../../styles/funnel.styles';
import { EmailSchema, TEmailSchema } from '@/lib/validators/auth-validators';
import { SingleContent } from '../common';
import { useFunnel } from '@/providers/FunnelProvider';

const EmailForm = ({
  setEmail,
}: {
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const { toNext } = useFunnel();
  const defaultValues = {
    email: '',
  };
  const emailForm = useForm<TEmailSchema>({
    resolver: zodResolver(EmailSchema),
    defaultValues,
  });

  const onSubmitEmail = async () => {
    try {
      const data = emailForm.getValues();
      setEmail(data.email);
      toNext();
    } catch (error) {
      console.error('Error in onSubmitEmail:', error);
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
          <Button type="submit" size={'full'}>
            Verify
          </Button>
        </form>
      </Form>
    </SingleContent>
  );
};

export default EmailForm;
