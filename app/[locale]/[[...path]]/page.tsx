import NavBar from "@/components/Containers/NavBar";
import { FC } from "react";
import tw from "tailwind-styled-components";

const getPage: FC = async () => {
  return (
    <Hero>
      <NavBar />
    </Hero>
  );
};

export default getPage;

const Hero = tw.div`hero min-h-screen absolute left-0 top-0  `;
