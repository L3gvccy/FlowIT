import SkillSearch from "@/components/skill/skill-search";
import UserAvatar from "@/components/user-avatar";
import type { RootState } from "@/store/store";
import type { UpdateProfileDto } from "@flowit/shared";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userReducer.user);

  const [avatarHovered, setAvatarHovered] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [, set] = useState();

  const isEmpty = () => {
    if (name === "" || surname === "") return true;
    return false;
  };

  const submit = async () => {
    if (isEmpty()) {
      toast.error("Ім'я та прізвище не можуть бути порожніми");
    }

    const data: UpdateProfileDto = { name, surname };
  };

  useEffect(() => {
    if (user?.isProfileCompleted) {
      navigate("/profile");
    }
  }, []);

  return (
    <div className="flex justify-center p-8">
      <div className="flex flex-col justify-center items-center gap-6 p-4 rounded-xl shadow-md w-[90vw] max-w-196">
        <div className="text-center">
          <p className="text-2xl font-semibold">Заповнення профілю</p>
          <p>
            Для користування платформою необхідно заповнити власний профіль.
            Надалі ви зможете його редагувати.
          </p>
        </div>

        <div
          className="relative cursor-pointer rounded-full"
          onMouseEnter={() => {
            setAvatarHovered(true);
          }}
          onMouseLeave={() => {
            setAvatarHovered(false);
          }}
        >
          <UserAvatar size="xl" />
          <div
            className={`flex items-center justify-center absolute inset-0 h-24 w-24 rounded-full transition ${avatarHovered ? "bg-zinc-900/50 text-white" : "bg-zinc-900/0 text-transparent"}`}
          >
            <Plus size={36} />
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-col gap-1 w-full">
            <p className="px-2">Ім'я</p>
            <input
              type="text"
              className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
              placeholder="John"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <p className="px-2">Прізвище</p>
            <input
              type="text"
              className="border-0 outline-0 w-full bg-zinc-100 rounded-xl p-2"
              placeholder="Doe"
              value={surname}
              onChange={(e) => {
                setSurname(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <p className="text-lg text-center font-semibold">Навички</p>
          <div className="flex justify-center">
            <div className="w-full max-w-125">
              <SkillSearch />
            </div>
          </div>
        </div>

        <button
          disabled={!name || !surname}
          onClick={submit}
          className="w-full rounded-xl p-2 bg-violet-600 text-white hover:bg-violet-500 disabled:bg-violet-900 disabled:cursor-not-allowed font-semibold cursor-pointer transition-all duration-300"
        >
          Підтвердити
        </button>
      </div>
    </div>
  );
};

export default ProfileSetup;
