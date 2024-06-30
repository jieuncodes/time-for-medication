import tw from 'tailwind-styled-components';

export const FunnelWrapper = tw.div`
  relative
  flex
  w-full
  flex-col
  items-center
  justify-center
`;

export const FullHeightFunnelWrapper = tw(FunnelWrapper)`
  h-full
  justify-start
`;

export const FunnelTitle = tw.h1`
  mb-4
  w-full
  text-2xl
  font-bold
  text-black
`;

export const CenteredFunnelTitle = tw(FunnelTitle)`
  text-center
`;

export const FunnelDesc = tw.p`
  mb-10
  text-gray-500
`;

export const FunnelError = tw.p`
  mb-10
  self-start
  text-destructive
`;
