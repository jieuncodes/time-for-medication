'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { useFunnel } from '@/providers/FunnelProvider';
import { useEffect, useState } from 'react';
import { compareUserOTP } from '../../app/services/emailServices';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Must be 6 characters.',
  }),
});

export function OTPInputs({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  });

  const { toNext } = useFunnel();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);

    const otpComparisonResult = await compareUserOTP({
      email,
      otp: data.pin,
    });
    console.log('otpComparisonResult', otpComparisonResult);

    if (otpComparisonResult.success) {
      toNext();
    } else {
      form.setError('pin', {
        message: otpComparisonResult.error || 'Wrong code. Please try again.',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value?.pin?.length === 6) {
        onSubmit({ pin: value.pin });
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size={'full'}
          disabled={loading}
          loading={loading}
          label="Verify"
        />
      </form>
    </Form>
  );
}
