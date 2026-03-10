import SkillLabel from "@/components/skill/skill-label";
import SkillSearch from "@/components/skill/skill-search";
import UserAvatar from "@/components/user-avatar";
import type { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import { apiClient } from "@/utils/api-client";
import {
  ADD_USER_SKILL_URL,
  GET_PROFILE_URL,
  REMOVE_USER_SKILL_URL,
  UPDATE_PROFILE_URL,
} from "@/utils/constants";
import type { UpdateProfileDto, UserSkillDto } from "@flowit/shared";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileSetupProps {
  type?: "setup" | "edit";
}

const ProfileSetup = ({ type = "setup" }: ProfileSetupProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userReducer.user);
  const dispatch = useDispatch();

  const [avatarHovered, setAvatarHovered] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [skills, setSkills] = useState<any[]>([]);

  const isEmpty = () => {
    if (name === "" || surname === "") return true;
    return false;
  };

  const getProfile = async () => {
    if (!user?.id) return;
    await apiClient.get(GET_PROFILE_URL(user.id)).then((res) => {
      setSkills(res.data.skills);
      console.log(res.data);
    });
  };

  const submit = async () => {
    if (isEmpty()) {
      toast.error("Ім'я та прізвище не можуть бути порожніми");
    }

    const data: UpdateProfileDto = { name, surname };

    await apiClient
      .post(UPDATE_PROFILE_URL, data)
      .then((res) => {
        dispatch(setUser(res.data.user));
        toast.success("Профіль успішно заповнено!");
        navigate("/profile");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };

  const addUserSkill = async (name: string) => {
    const data: UserSkillDto = { skillName: name };

    await apiClient
      .post(ADD_USER_SKILL_URL, data)
      .then((res) => {
        const skill = res.data.skill;
        if (!skill) {
          toast.error("Помилка при додаванні навички");
          return;
        }
        setSkills(res.data.skills);
        toast.success("Навичку успішно додано");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const removeUserSkill = async (name: string) => {
    const data: UserSkillDto = { skillName: name };

    await apiClient
      .post(REMOVE_USER_SKILL_URL, data)
      .then((res) => {
        setSkills(res.data.skills);
        toast.success("Навичку успішно вилучно");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    if (user?.isProfileCompleted) {
      navigate(`/profile/${user.id}`);
      return;
    }
    getProfile();
  }, []);

  return (
    <div className="flex justify-center p-8">
      <div className="flex flex-col justify-center items-center gap-6 p-4 rounded-xl shadow-md w-[90vw] max-w-196">
        {type === "setup" && (
          <div className="text-center">
            <p className="text-2xl font-semibold">Заповнення профілю</p>
            <p>
              Для користування платформою необхідно заповнити власний профіль.
              Надалі ви зможете його редагувати.
            </p>
          </div>
        )}

        {type === "edit" && (
          <div className="text-center">
            <p className="text-2xl font-semibold">Редагування профілю</p>
          </div>
        )}

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
              <SkillSearch onSelect={addUserSkill} skillsToFilter={skills} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {skills?.length > 0 ? (
            skills.map((s: any) => (
              <SkillLabel
                id={s.id}
                name={s.name}
                editable={true}
                onRemove={() => {
                  removeUserSkill(s.name);
                }}
              />
            ))
          ) : (
            <p>Ще немає жодної навички</p>
          )}
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
