import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import ProjectNavigation from "./navigation/project-navigation";
import type { EmployeeInterface, ProjectInterface } from "@flowit/shared";
import { ArrowLeft, Info } from "lucide-react";
import Loader from "@/components/loader";
import { apiClient } from "@/utils/api-client";
import { GET_PROJECT_URL } from "@/utils/constants";
import { toast } from "sonner";

const Project = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<ProjectInterface | undefined>(
    undefined,
  );
  const [employee, setEmployee] = useState<EmployeeInterface | undefined>(
    undefined,
  );

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const getProject = async () => {
    if (!projectId) return;
    await apiClient
      .get(GET_PROJECT_URL(projectId))
      .then((res) => {
        setProject(res.data.project);
        setEmployee(res.data.employee);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getProject();
  }, []);

  if (loading || !projectId) {
    return (
      <div className="flex flex-1 w-full justify-center items-center">
        <Loader size={24} />
      </div>
    );
  }

  return (
    <div className="flex gap-2 p-2 w-full justify-center items-center">
      <div className="flex flex-col gap-4 max-w-342 w-full justify-center items-center">
        <div className="flex gap-2 w-full p-4 rounded-xl shadow-md items-center justify-between">
          <ArrowLeft
            className="opacity-65 hover:opacity-80 transition-all duration-300 cursor-pointer"
            onClick={goBack}
            size={22}
          />
          <p className="text-center text-2xl font-semibold tracking-wide">
            Проект
          </p>
          <Info className="opacity-0" size={22} />
        </div>
        {/* <div>project {projectId}</div> */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <ProjectNavigation projectId={projectId} role={employee?.role} />
          <Outlet context={{ project, employee }} />
        </div>
      </div>
    </div>
  );
};

export default Project;
