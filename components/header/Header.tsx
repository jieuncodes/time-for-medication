import React from "react";
import { Icons } from "components/Icons";
import LinkBox from "components/Link";
import { CircleUserRound } from "lucide-react";
import {
  HeaderContainer,
  NavStart,
  NavCenter,
  NavEnd,
  MenuBtn,
  Logo,
} from "./header.styles";

export const Header = () => {
  const loggedIn = false;
  return (
    <HeaderContainer>
      <NavStart>
        <MenuBtn>
          <Icons.hamburger />
        </MenuBtn>
      </NavStart>
      <NavCenter>
        <LinkBox href="/">
          <Logo>MedTime</Logo>
        </LinkBox>
      </NavCenter>
      <NavEnd>
        <LinkBox href="search">
          <Icons.search />
        </LinkBox>
        <LinkBox href={loggedIn ? "/user" : "/login"}>
          <CircleUserRound />
        </LinkBox>
      </NavEnd>
    </HeaderContainer>
  );
};
