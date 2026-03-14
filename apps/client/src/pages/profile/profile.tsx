import ProjectDisplay from "@/components/project/project-display";
import SkillLabel from "@/components/skill/skill-label";
import SkillSearch from "@/components/skill/skill-search";
import UserAvatar from "@/components/user-avatar";
import { apiClient } from "@/utils/api-client";
import {
  ADD_USER_SKILL_URL,
  GET_PROFILE_URL,
  REMOVE_USER_SKILL_URL,
} from "@/utils/constants";
import type {
  ProjectInterface,
  EmployeeInterface,
  User,
  UserSkillDto,
} from "@flowit/shared";
import {
  ArrowLeft,
  Pen,
  Pencil,
  PencilOff,
  UserPen,
  UserPlus,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [editable, setEditable] = useState(false);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);

  const [editingSkills, setEditingSkills] = useState(false);

  const getUser = async () => {
    if (!userId) return;
    await apiClient.get(GET_PROFILE_URL(userId)).then((res) => {
      console.log(res.data);
      setEditable(res.data.editable);
      setUser(res.data.user);
      setSkills(res.data.skills);
      setProjects(res.data.projects.projects);
      setEmployees(res.data.projects.employees);
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

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col max-w-342 w-full gap-4 p-4">
        <div className="flex flex-col gap-2 w-full p-4 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <ArrowLeft
              className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
              onClick={goBack}
              size={22}
            />
            <p className="text-center text-2xl font-semibold tracking-wide">
              Профіль
            </p>
            <div>
              {editable ? (
                <UserPen
                  className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    navigate("/profile-edit");
                  }}
                  size={22}
                />
              ) : (
                <UserPlus
                  className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
                  size={22}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full p-4 rounded-xl shadow-md">
          <UserAvatar image={user?.image} size="xl" />
          {user?.isProfileCompleted && (
            <p className="text-lg font-semibold">
              {user.name} {user.surname}
            </p>
          )}
          <p>{user?.email}</p>
        </div>

        <div className="flex flex-col gap-2 w-full p-4 rounded-xl shadow-md">
          <div className="flex items-center gap-4">
            <p className="text-xl font-semibold">Навички:</p>
            {editable &&
              (editingSkills ? (
                <PencilOff
                  className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setEditingSkills((prev) => !prev);
                  }}
                  size={20}
                />
              ) : (
                <Pencil
                  className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setEditingSkills((prev) => !prev);
                  }}
                  size={20}
                />
              ))}
          </div>

          <div className="flex">
            {skills.length === 0 && !editingSkills ? (
              <p>Ще немає навичок</p>
            ) : editingSkills ? (
              <div className="flex flex-col gap-3 w-full max-w-120">
                <SkillSearch onSelect={addUserSkill} skillsToFilter={skills} />
                <div className="flex gap-2">
                  {skills.map((s: any) => (
                    <SkillLabel
                      id={s.id}
                      name={s.name}
                      editable={true}
                      onRemove={() => {
                        removeUserSkill(s.name);
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {skills.map((s: any) => (
                  <SkillLabel id={s.id} name={s.name} editable={false} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full p-4 rounded-xl shadow-md">
          <p className="text-xl font-semibold">Проекти:</p>

          {projects.map((p) => (
            <ProjectDisplay
              project={p}
              role={
                employees.find((e) => e.projectId === p.id)?.role || "EMPLOYEE"
              }
              inProfile={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
