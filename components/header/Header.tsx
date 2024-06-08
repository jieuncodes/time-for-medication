import React from "react";
import "./header.css";
import IconWrapper from "../button/icon-button/IconWrapper";
import Person from "components/icons/Person";
import tw from "tailwind-styled-components";
import Link from "next/link";
import Image from "next/image";

export const Header = () => {
  const loggedIn = false;
  return (
    <HeaderContainer>
      <NavStart>
        <div className="dropdown">
          <div role="button" className="btn btn-ghost btn-circle">
            <IconWrapper></IconWrapper>
          </div>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </NavStart>
      <NavCenter>
        <a className="text-xl font-bold">MedTime</a>
      </NavCenter>
      <NavEnd>
        <button className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
        {loggedIn ? (
          <button>
            <div className="avatar">
              <div className="w-10 rounded-full">
                <Image
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  alt="avatar"
                />
              </div>
            </div>
          </button>
        ) : (
          <Link href="/login">
            <IconWrapper size={24}>
              <Person />
            </IconWrapper>
          </Link>
        )}
      </NavEnd>
    </HeaderContainer>
  );
};

export const HeaderContainer = tw.div`
  navbar
  relative
  left-0
  top-0
  flex
  w-full
  items-center
  justify-between
  bg-base-100
  px-4
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
  items-center
`;
