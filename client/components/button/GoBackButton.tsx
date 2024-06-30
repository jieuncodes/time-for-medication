'use client';

import IconWrapper from './icon-button/IconWrapper';
import tw from 'tailwind-styled-components';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const GoBackButton = ({ onClick }: { onClick?: () => void }) => {
  const router = useRouter();
  const handleGoBack = () => {
    if (onClick) {
      onClick();
      return;
    }
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
  absolute
  top-4
  z-50
  flex
  h-10
  w-10
  items-center
  justify-center
  rounded-full
  border-2
`;
