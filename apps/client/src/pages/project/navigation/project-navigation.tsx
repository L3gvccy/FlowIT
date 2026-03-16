import React from "react";
import ProjectNavLink from "./components/project-nav-link";
import { CalendarCheck, Info } from "lucide-react";
import type { employeeRole } from "@flowit/shared";

const ProjectNavigation = ({
  projectId,
  role,
}: {
  projectId: string;
  role?: employeeRole;
}) => {
  return (
    <div className="flex flex-col w-full p-2 rounded-xl shadow-md md:max-w-72 h-fit">
      <ProjectNavLink to={`/projects/${projectId}`} end>
        <Info />
        <p>Інформація</p>
      </ProjectNavLink>
      <ProjectNavLink to={`/projects/${projectId}/tasks`}>
        <CalendarCheck />
        <p>Задачі</p>
      </ProjectNavLink>

      {role === "OWNER" && <></>}
    </div>
  );
};

export default ProjectNavigation;
