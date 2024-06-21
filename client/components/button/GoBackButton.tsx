"use client";
import IconWrapper from "./icon-button/IconWrapper";
import tw from "tailwind-styled-components";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const GoBackButton = () => {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  return (
    <CircleBtn onClick={handleGoBack}>
      <IconWrapper stroke="black">
        <ChevronLeft />
      </IconWrapper>
    </CircleBtn>
  );
};

export default GoBackButton;

const CircleBtn = tw.div`
  border-gary-200
  left-4
  top-4
  flex
  flex
  h-10
  w-10
  items-center
  justify-center
  rounded-full
  border-2
`;
