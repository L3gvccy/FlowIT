import ProjectLogo from "@/components/project/project-logo";
import type { EmployeeInterface, ProjectInterface } from "@flowit/shared";
import React from "react";
import { useOutletContext } from "react-router-dom";

type ProjectOutletContext = {
  project: ProjectInterface;
  employee: EmployeeInterface;
};

const Overview = () => {
  const { project } = useOutletContext<ProjectOutletContext>();

  return (
    <div className="flex flex-col gap-2 p-2 w-full items-center rounded-xl shadow-md">
      <p className="font-semibold text-lg tracking-wide">Інформація</p>
      <ProjectLogo image={project?.image} size="xl2" />
      <p className="font-semibold text-2xl tracking-wide">{project?.name}</p>
      <p className="text-lg opacity-90">{project?.description}</p>
    </div>
  );
};

export default Overview;
