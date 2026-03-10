import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Naviagtion = () => {
  return (
    <>
      <nav className="hidden md:flex gap-2 items-center">
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
      <nav className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex gap-2 items-center p-2 border border-violet-600 rounded-xl transition-all duration-300">
            <div>
              <Menu size={18} />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <NavLink to="/projects">Проекти</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NavLink to="/tasks">Завдання</NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
};

export default Naviagtion;
