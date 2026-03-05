import React from "react";
import { NavLink } from "react-router-dom";

const Naviagtion = () => {
  return (
    <nav className="flex gap-2 items-center">
      <NavLink
        to="/projects"
        className={({ isActive }) =>
          `border-b-2 pt-2 border-transparent text-lg font-medium ${isActive ? "text-violet-700 border-violet-700" : "text-zinc-900 hover:text-zinc-800 hover:border-zinc-800"} transition-all duration-300`
        }
      >
        Проекти
      </NavLink>
      <NavLink
        to="/tasks"
        className={({ isActive }) =>
          `border-b-2 pt-2 border-transparent text-lg font-medium ${isActive ? "text-violet-700 border-violet-700" : "text-zinc-900 hover:text-zinc-800 hover:border-zinc-800"} transition-all duration-300`
        }
      >
        Завдання
      </NavLink>
    </nav>
  );
};

export default Naviagtion;
