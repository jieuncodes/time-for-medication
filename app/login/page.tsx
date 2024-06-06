"use client";

import tw from "tailwind-styled-components";

import Image from "next/image";
import LoginForm from "components/molecules/forms/LoginForm";
import { RoundButton } from "components/atoms/button/icon-button/RoundButton";

export default function Login() {
  return (
    <Content>
      <Title>Sign in to MedTime</Title>
      <RoundButton>
        <Image
          src="/images/google.png"
          alt="Google Icon"
          width={20}
          height={20}
        />
        Log In with Google
      </RoundButton>

      <Divider>or sign in with email</Divider>
      <LoginForm />

      <SignUp>
        {`Don't have an account?`}
        <a href="/signup" className="text-blue-500">
          {` Sign Up`}
        </a>
      </SignUp>
    </Content>
  );
}

const Content = tw.div`absolute w-full flex flex-col items-center px-6 py-8 bg-opacity-75 rounded-lg bottom-20`;
const Title = tw.h1`text-2xl font-bold text-black left-0 mb-20`;

const Divider = tw.div`flex items-center my-6 text-gray-400 before:flex-1 before:border-b before:border-gray-200 before:mr-2 after:flex-1 after:border-b after:border-gray-200 after:ml-2 w-full text-sm text-gray-500 focus-visible`;
const SignUp = tw.div`mt-4 text-gray-400`;
