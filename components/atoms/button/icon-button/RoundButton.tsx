import tw from "tailwind-styled-components";
import { Button } from "@/components/ui/button";

export const RoundButton = tw(
  Button
)`w-full border rounded-full text-black border-gray-400 h-12 hover:bg-black hover:text-white hover:border-transparent space-x-2 gap-2 transition-colors duration-400 ease-in-out`;
