import tw from 'tailwind-styled-components';

import Image from 'next/image';
import { RoundButton } from '@/components/button/RoundButton';
import LinkBox from '@/components/Link';
import { Content, Divider, Title, LinkText } from '@/components/common';

export default function signUp() {
  return (
    <Content className="h-full">
      <Title>Sign up to MedTime</Title>
      <StyledGoogleBtn>
        <Image
          src="/images/google.png"
          alt="Google Icon"
          width={20}
          height={20}
        />
        Sign up with Google
      </StyledGoogleBtn>

      <Divider>or</Divider>

      <LinkBox href="/signup/new">
        <StyledEmailSignUpBtn>Continue with email</StyledEmailSignUpBtn>
      </LinkBox>

      <SignUp>
        {`Already have an account? `}
        <LinkText href="/login">{` Sign In`}</LinkText>
      </SignUp>
    </Content>
  );
}

const SignUp = tw.div`
  mt-10
  text-gray-400
`;

export const StyledGoogleBtn = tw(RoundButton)`
  bg-[#0E0C22]
  text-white
  hover:border-none
  hover:opacity-70
`;

export const StyledEmailSignUpBtn = tw(RoundButton)`
  border-gray-200
  text-black
`;
