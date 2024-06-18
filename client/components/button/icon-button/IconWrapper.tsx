import React, { FC, SVGProps } from "react";

interface IconWrapperProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const IconWrapper: FC<IconWrapperProps> = ({
  size = 24,
  color = "currentColor",
  children,
  ...props
}) => {
  return React.cloneElement(children as React.ReactElement, {
    width: size,
    height: size,
    stroke: color,
    ...props,
  });
};

export default IconWrapper;
