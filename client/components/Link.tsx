import Link from "next/link";
import tw from "tailwind-styled-components";

const LinkBox = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <StyledLink href={href} passHref>
      {children}
    </StyledLink>
  );
};

export default LinkBox;

const StyledLink = tw(Link)`
  w-full
`;
