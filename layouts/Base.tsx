"use client";

import { type FC, type PropsWithChildren } from "react";

const BaseLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>;
};

export default BaseLayout;
