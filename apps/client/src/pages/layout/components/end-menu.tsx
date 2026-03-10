import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user-avatar";
import type { RootState } from "@/store/store";
import { clearUser } from "@/store/userSlice";
import { apiClient } from "@/utils/api-client";
import { LOGOUT_URL } from "@/utils/constants";
import { LogIn, LogOut, User } from "lucide-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EndMenu = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userReducer.user);
  const dispatch = useDispatch();

  const logOut = async () => {
    await apiClient.get(LOGOUT_URL);
    dispatch(clearUser());
    localStorage.removeItem("accessToken");
    navigate("/");
    toast.success("Ви успішно вийшли з акаунту");
  };

  if (user?.id)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer">
          <UserAvatar image={user?.image} size="md" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="cursor-pointer">
            <Link
              to={`/profile/${user.id}`}
              className="flex gap-2 items-center"
            >
              <User />
              <p>Профіль</p>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              logOut();
            }}
            className="flex gap-2 items-center cursor-pointer"
          >
            <LogOut className="text-red-600" />
            <p className="text-red-600">Вийти</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  return (
    <Link
      to="/auth"
      className="flex gap-2 items-center p-2 border border-violet-600 hover:bg-violet-600 hover:text-white rounded-xl transition-all duration-300"
    >
      <p className="hidden md:block">Авторизація</p>
      <LogIn size={18} />
    </Link>
  );
};

export default EndMenu;
