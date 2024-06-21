import tw from 'tailwind-styled-components';

import Image from 'next/image';
import LoginForm from '@/components/forms/LoginForm';
import { RoundButton } from '@/components/button/RoundButton';
import { Content, Divider, LinkText, Title } from '@/components/common';

export default function Login() {
  return (
    <Content className="h-full">
      <Title>Sign in to MedTime</Title>
      <StyledGoogleBtn>
        <Image
          src="/images/google.png"
          alt="Google Icon"
          width={20}
          height={20}
        />
        Log In with Google
      </StyledGoogleBtn>

      <Divider>or sign in with email</Divider>

      <LoginForm />

      <SignUp>
        {`Don't have an account?`}
        <LinkText href="/signup">{` Sign Up`}</LinkText>
      </SignUp>
    </Content>
  );
}

const SignUp = tw.div`
  mt-4
  text-gray-400
`;
const StyledGoogleBtn = tw(RoundButton)`
  hover:border-transparent
  hover:bg-black
  hover:text-white
`;
