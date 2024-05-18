import React from "react";

import "./header.css";
import { IconButton } from "../button/icon-button/IconButton";
import Person from "components/atoms/icons/Person";

type User = {
  name: string;
};

interface HeaderProps {
  user?: User;
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
}

export const Header = ({
  user,
  onLogin,
  onLogout,
  onCreateAccount,
}: HeaderProps) => (
  <header>
    <div className="tfm-header">
      <div>
        <h1>TFM</h1>
      </div>
      <div>
        <IconButton url={""} iconComponent={Person} />
      </div>
    </div>
  </header>
);
