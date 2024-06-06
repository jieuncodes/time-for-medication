import tw from "tailwind-styled-components";

import Image from "next/image";
import { RoundButton } from "components/atoms/button/icon-button/RoundButton";
import { Content, Divider, LinkText, Title } from "components/common";
import Link from "next/link";

export default function signUp() {
  return (
    <Content>
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
      <StyledEmailSignUpBtn>
        <Link href="/signup/new">Continue with email</Link>
      </StyledEmailSignUpBtn>

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
  border-[#DBDBDE]
  text-black
`;
