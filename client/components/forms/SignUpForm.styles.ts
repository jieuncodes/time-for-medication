import { RoundButton } from '../button/RoundButton';
import tw from 'tailwind-styled-components';

export const FormContainer = tw.div`
  flex
  h-full
  w-full
  flex-col
  justify-center
`;
export const Options = tw.div`
  h-fit-content
  mt-4
  flex
  w-full
  items-center
  justify-center
  gap-2
`;
export const LoginButton = tw(RoundButton)`
  mt-14
  border-none
  bg-blue-500
  text-white
  hover:bg-blue-600
`;

export const ColForms = tw.div`
  grid
  grid-cols-1
  gap-6
`;
