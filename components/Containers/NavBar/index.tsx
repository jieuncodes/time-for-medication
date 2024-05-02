import tw from "tailwind-styled-components";
import NavMenu from "./NavItem";
import SearchInput from "./NavItem/SearchInput";
import ThemeSwitcher from "./NavItem/ThemeSwitcher";

const NavBar = () => {
  return (
    <NavBarContainer>
      <Logo>TFM</Logo>
      <NavMenu />
      <SearchInput />
      <ThemeSwitcher />
    </NavBarContainer>
  );
};

export default NavBar;

const NavBarContainer = tw.nav`
 px-4 my-4
flex items-center justify-end
fixed top-0 left-0 w-full px-20 py-4 text-black `;
const Logo = tw.div`
text-2xl font-bold text-primary-500 text-black absolute left-20`;
