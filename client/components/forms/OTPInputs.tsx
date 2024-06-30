'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useState } from 'react';

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
import { compareUserOTP } from '../../app/services/emailServices';
import { MutedDesc } from '../common';
import { Send } from 'lucide-react';

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Must be 6 characters.',
  }),
});

export function OTPInputs({
  email,
  expirationTime,
  handleResendVerificationEmail,
}: {
  email: string;
  expirationTime: Date | undefined;
  handleResendVerificationEmail: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

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
    form.setFocus('pin');

    const subscription = form.watch((value) => {
      if (value?.pin?.length === 6) {
        onSubmit({ pin: value.pin });
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    if (!expirationTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeLeft = expirationTime.getTime() - now.getTime();
      setTimeLeft(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setLoading(false);
        form.setError('pin', {
          message: 'OTP has expired.',
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime, form]);

  const formatTimeLeft = (timeLeft: number) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <>
      {timeLeft > 0 && (
        <MutedDesc className="mr-3">
          OTP expires in {formatTimeLeft(timeLeft)}
        </MutedDesc>
      )}
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
          {timeLeft > 0 ? (
            <Button
              type="submit"
              size={'full'}
              disabled={loading}
              loading={loading}
              label="Verify"
            />
          ) : (
            <Button
              headingIcon={<Send size={16} />}
              label="Resend"
              onClick={handleResendVerificationEmail}
              size={'full'}
              disabled={loading}
              loading={loading}
            />
          )}
        </form>
      </Form>
    </>
  );
}
