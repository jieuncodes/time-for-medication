import React from "react";
import "./header.css";
import IconWrapper from "../../atoms/button/icon-button/IconButton";
import Person from "components/atoms/icons/Person";
import tw from "tailwind-styled-components";
import Link from "next/link";

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const loggedIn = false;
  return (
    <HeaderContainer>
      <NavStart>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
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
            stroke="currentColor">
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
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
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

export const HeaderContainer = tw.div`navbar bg-base-100 relative top-0 left-0 flex w-full items-center justify-between px-4`;

export const NavStart = tw.div`navbar-start flex items-center`;
export const NavCenter = tw.div`navbar-center absolute left-1/2 transform -translate-x-1/2`;
export const NavEnd = tw.div`navbar-end flex items-center ml-3`;
