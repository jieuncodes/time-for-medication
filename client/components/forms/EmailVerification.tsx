import Lottie from 'lottie-react';
import emailSend from '@/public/lottie/email-send.json';
import { FunnelDesc, FunnelTitle, FunnelWrapper } from '@/styles/funnel.styles';

import { LottieWrapper, SingleContent } from '../common';

import { InputOTPForm } from './InputOTP';

const EmailVerification = ({ email }: { email: string | undefined }) => {
  // if(!email) return go back;
  return (
    <FunnelWrapper>
      <LottieWrapper>
        <Lottie animationData={emailSend} loop={false} />
      </LottieWrapper>
      <FunnelTitle>Verification code</FunnelTitle>
      <FunnelDesc>{`Enter the verification code sent to ${email}`}</FunnelDesc>
      <InputOTPForm />
    </FunnelWrapper>
  );
};
export default EmailVerification;
