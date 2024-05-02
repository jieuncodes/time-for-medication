import NavBar from "@/components/Containers/NavBar";
import { FC } from "react";
import tw from "tailwind-styled-components";

const getPage: FC = async () => {
  return (
    <Hero>
      <NavBar />
      <HeroDivider>
        <DividerTitle>Supplements</DividerTitle>
        <Divider />
        <DownloadAppBtn>Download APP</DownloadAppBtn>
      </HeroDivider>
      <HeroBody>
        <div className="grid grid-cols-6 h-44">
          <div className="col-span-2">
            <span className="text-3xl font-semibold">Improve</span>
            <p className="pt-2">
              Fugiat velit dolor dolor proident Lorem duis ea minim aliquip
              dolor dolor sunt et dolore.
            </p>
          </div>
          <div className="col-span-4 pb-5 font-bold text-9xl place-self-end">
            Health Care
          </div>
        </div>
        <div className="grid grid-cols-6 grid-rows-2 gap-3 ">
          <div className="col-span-2 grid-rows-1">
            <span className="text-xl font-semibold">Win</span>
            <p className="pt-2">
              Sit dolore nulla proident sint occaecat magna reprehenderit
              consequat laborum irure consectetur exercitation aliqua.
            </p>
          </div>

          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="grid-rows-1">
              <CardImage src={`/images/sample.jpeg`} alt="Content" />
            </Card>
          ))}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="grid-rows-2">
              <CardImage src={`/images/sample.jpeg`} alt="Content" />
            </Card>
          ))}
          <div className="flex-col items-end self-end col-span-2 ml-3">
            <span className="text-xl font-semibold">Inspired</span>
            <p className="pt-6">
              Exercitation aute ad id in in incididunt nulla. Adipisicing
              exercitation proident elit.
            </p>
            <p className="pt-3">💊 Time for medication </p>
          </div>
        </div>
      </HeroBody>
    </Hero>
  );
};

export default getPage;

const Hero = tw.div`hero h-screen absolute left-0 top-0 px-20 text-black flex flex-col justify-center w-full`;
const HeroDivider = tw.div`w-full
flex items-center justify-between mb-16`;
const DividerTitle = tw.h1`text-lg font-semibold mr-6`;
const Divider = tw.div`w-full h-0.5 bg-neutral/20`;
const DownloadAppBtn = tw.button`btn btn-neutral rounded-3xl ml-6 text-cupcake-white`;
const HeroBody = tw.div`relative w-full h-3/5 `;

const Card = tw.div``;
const CardImage = tw.img`w-full aspect-square object-cover`;
const CardText = tw.p`text-gray-700 text-base`;
