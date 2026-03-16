import React, { type ReactNode } from "react";
import { NavLink } from "react-router-dom";

const ProjectNavLink = ({
  to,
  end = false,
  children,
}: {
  to: string;
  end?: boolean;
  children: ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center text-md font-medium rounded-xl w-full gap-2 p-2 ${isActive ? "text-violet-600 bg-violet-300" : "text-zinc-900 hover:text-zinc-800"} transition-all duration-300`
      }
      end={end}
    >
      {children}
    </NavLink>
  );
};

export default ProjectNavLink;
