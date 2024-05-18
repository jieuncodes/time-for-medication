import Link from "next/link";
import { FC, SVGProps } from "react";

export interface IconButtonProps {
  url: string;
  iconComponent: FC<SVGProps<SVGSVGElement>>;
  size?: "medium";
}

export const IconButton: FC<IconButtonProps> = ({
  url,
  iconComponent: IconComponent,
  size = "medium",
}) => {
  const sizeClass = {
    medium: "w-6 h-6",
  }[size];

  return (
    <Link href={url} className={`flex align-middle ${sizeClass}`}>
      <IconComponent />
    </Link>
  );
};
