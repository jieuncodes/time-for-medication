"use client";

import type { FC, PropsWithChildren } from "react";

const BaseLayout: FC<PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

export default BaseLayout;
