import React, { useEffect, useState } from "react";
import CreateProject from "./components/create-project";
import type { EmployeeInterface, ProjectInterface } from "@flowit/shared";
import ProjectDisplay from "@/components/project/project-display";
import { apiClient } from "@/utils/api-client";
import { GET_MY_PROJECTS_URL } from "@/utils/constants";
import { toast } from "sonner";
import ProjectSkeleton from "./components/project-skeleton";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);

  const getProjects = async () => {
    await apiClient
      .get(GET_MY_PROJECTS_URL)
      .then((res) => {
        setProjects(res.data.projects);
        setEmployees(res.data.employees);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        // setTimeout(() => {
        //   setLoading(false);
        // }, 1000);
        setLoading(false);
      });
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col max-w-342 w-full gap-4 p-4">
        <div className="flex flex-col gap-2 w-full p-4 rounded-xl shadow-md">
          <p className="text-center text-2xl font-semibold tracking-wide">
            Проекти
          </p>
        </div>

        <CreateProject />

        {loading ? (
          <ProjectSkeleton />
        ) : projects.length > 0 ? (
          projects.map((p) => (
            <ProjectDisplay
              project={p}
              role={
                employees.find((e) => e.projectId === p.id)?.role || "EMPLOYEE"
              }
              inProfile={false}
            />
          ))
        ) : (
          <p className="opacity-90 text-lg">Ще немає жодного проекту</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
