import tw from "tailwind-styled-components";

export const Content = tw.div`
  top-0
  flex
  h-auto
  w-full
  flex-col
  items-center
  justify-center
  overflow-y-scroll
  px-6
  py-8
  text-black
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
