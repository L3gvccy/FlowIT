import React from "react";
import { Link } from "react-router-dom";

const HeaderLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/logo.png" className="w-12 h-12" />
      <p className="font-bold text-violet-600 text-3xl select-none">FlowIT</p>
    </Link>
  );
};

export default HeaderLogo;
