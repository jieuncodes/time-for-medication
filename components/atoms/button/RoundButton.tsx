import tw from "tailwind-styled-components";

export const RoundButton = tw.button`
  duration-400
  inline-flex
  h-12
  w-full
  items-center
  justify-center
  gap-2
  space-x-2
  whitespace-nowrap
  rounded-full
  border
  text-sm
  font-medium
  text-black
  ring-offset-background
  transition-colors
  transition-colors
  ease-in-out
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-ring
  focus-visible:ring-offset-2
  disabled:pointer-events-none
  disabled:opacity-50
`;
