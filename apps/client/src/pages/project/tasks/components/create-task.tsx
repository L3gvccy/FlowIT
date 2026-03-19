import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/utils/api-client";
import { CREATE_TASK_URL } from "@/utils/constants";
import { toast } from "sonner";
import type { CreateTaskDto, TaskInterface } from "@flowit/shared";
import TaskForm from "./task-form";

const CreateTask = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const createTask = async (data: CreateTaskDto) => {
    try {
      setCreating(true);
      const res = await apiClient.post(CREATE_TASK_URL, data);
      const task: TaskInterface = res.data.task;
      navigate(`../${task.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Не вдалося створити задачу");
    } finally {
      setCreating(false);
    }
  };

  return <TaskForm mode="create" submitting={creating} onSubmit={createTask} />;
};

export default CreateTask;
