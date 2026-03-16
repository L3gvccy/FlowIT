import { Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CreateTaskBtnProps {
  projectId: string;
}

const CreateTaskBtn = ({ projectId }: CreateTaskBtnProps) => {
  const navigate = useNavigate();
  return (
    <button
      className="flex w-fit gap-2 py-2 px-4 rounded-xl bg-violet-600 text-white hover:bg-violet-500 font-semibold cursor-pointer transition-all duration-300"
      onClick={() => {
        navigate(`/projects/${projectId}/tasks/create`);
      }}
    >
      <Plus />
      <p>Нова задача</p>
    </button>
  );
};

export default CreateTaskBtn;
