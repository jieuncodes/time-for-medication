import GoBackButton from "components/button/GoBackButton";
import { Content, Title } from "components/common";
import SignUpForm from "components/forms/SignUpForm";
import tw from "tailwind-styled-components";

export default function SignUpWithEmail() {
  return (
    <Content>
      <Header>
        <GoBackButton />
      </Header>
      <Title>Sign up to MedTime</Title>
      <SignUpForm />
    </Content>
  );
}

const Header = tw.div`
  relative
  mb-4
  mt-2
  flex
  h-12
  w-full
  items-center
`;
