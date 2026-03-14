import type { employeeRole, ProjectInterface } from "@flowit/shared";
import React from "react";
import ProjectLogo from "./project-logo";
import { employeeRoleToString } from "@/utils/tools";
import { useNavigate } from "react-router-dom";

interface InnerProps {
  project: ProjectInterface;
  role: employeeRole;
}

const Inner = ({ project, role }: InnerProps) => {
  return (
    <div className="flex flex-col w-full md:flex-row gap-2">
      <div className="flex items-center justify-center w-full md:w-fit">
        <ProjectLogo size="xl2" image={project?.image} />
      </div>
      <div className="flex flex-col flex-1 justify-between h-full p-2 gap-1">
        <p className="font-semibold text-xl">{project.name}</p>
        <p>{project.description}</p>
        <p className="mt-auto">{employeeRoleToString(role)}</p>
      </div>
    </div>
  );
};

interface DisplayProps {
  project: ProjectInterface;
  role: employeeRole;
  inProfile?: boolean;
}

const ProjectDisplay = ({ project, role, inProfile = false }: DisplayProps) => {
  const navigate = useNavigate();
  if (inProfile) return <Inner project={project} role={role} />;
  return (
    <div
      className="flex w-full p-4 rounded-xl shadow-md hover:bg-zinc-100 transition-all duration-300 cursor-pointer"
      onClick={() => {
        navigate(`/projects/${project.id}`);
      }}
    >
      <Inner project={project} role={role} />
    </div>
  );
};

export default ProjectDisplay;
