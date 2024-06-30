import tw from 'tailwind-styled-components';

export const Content = tw.div`
  top-0
  flex
  h-full
  w-full
  flex-col
  items-center
  justify-center
  overflow-x-hidden
  overflow-y-scroll
  px-6
  py-8
`;

export const SingleContent = tw.div`
  flex
  h-full
  flex-col
  items-center
  justify-center
  overflow-x-hidden
  pb-48
`;
export const Title = tw.h1`
  left-0
  mb-10
  text-2xl
  font-bold
  text-black
`;

export const Divider = tw.div`
  focus-visible
  my-6
  flex
  w-full
  items-center
  text-sm
  text-gray-400
  text-gray-500
  before:mr-2
  before:flex-1
  before:border-b
  before:border-gray-200
  after:ml-2
  after:flex-1
  after:border-b
  after:border-gray-200
`;
export const LinkText = tw.a`
  text-blue-500
`;

export const LottieWrapper = tw.div`
  w-60
`;

export const Header = tw.div`
  absolute
  top-0
  mt-6
  box-border
  flex
  h-12
  w-full
  items-center
  pl-5
`;

export const ButtonsBox = tw.div`
  mt-6
  flex
  w-full
  flex-row
  gap-3
`;

export const MutedDesc = tw.p`
  ml-1
  self-end
  text-sm
  font-normal
`;
