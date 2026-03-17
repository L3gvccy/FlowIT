import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";

const Task = () => {
  const { taskId } = useParams();
  const { project } = useOutletContext<ProjectOutletContext>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!taskId) {
      navigate(`/projects/${project.id}/tasks`);
    }
  }, []);
  return <div>Task {taskId}</div>;
};

export default Task;
