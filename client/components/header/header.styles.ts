import tw from 'tailwind-styled-components';

export const HeaderContainer = tw.div`
  navbar
  relative
  left-0
  top-0
  flex
  w-full
  items-center
  justify-between
`;

export const NavStart = tw.div`
  navbar-start
  flex
  items-center
`;
export const NavCenter = tw.div`
  navbar-center
  absolute
  left-1/2
  -translate-x-1/2
  transform
`;
export const NavEnd = tw.div`
  navbar-end
  ml-3
  flex
  w-fit
  items-center
  gap-3
`;

export const MenuBtn = tw.button`
`;

export const Logo = tw.h1`
  text-xl
  font-bold
  text-black
`;
