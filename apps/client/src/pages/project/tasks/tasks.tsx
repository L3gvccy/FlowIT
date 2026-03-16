import React from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";
import CreateTaskBtn from "./components/create-task-btn";

const Tasks = () => {
  const { employee } = useOutletContext<ProjectOutletContext>();
  const role = employee.role;
  const editable = role !== "EMPLOYEE";
  return (
    <div className="flex flex-col gap-2 p-2 w-full rounded-xl shadow-md">
      <p className="font-semibold text-lg tracking-wide text-center">Задачі</p>
      {editable && <CreateTaskBtn />}
    </div>
  );
};

export default Tasks;
