import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectOutletContext } from "../../types/project-outlet-context";
import { apiClient } from "@/utils/api-client";
import { GET_TASK_URL, UPDATE_TASK_URL } from "@/utils/constants";
import { toast } from "sonner";
import type {
  CreateTaskDto,
  SkillInterface,
  TaskInterface,
} from "@flowit/shared";
import dayjs from "dayjs";
import TaskForm from "./task-form";

const EditTask = () => {
  const { taskId } = useParams();
  const { project } = useOutletContext<ProjectOutletContext>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const getTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const res = await apiClient.get(GET_TASK_URL(project.id, taskId));
      setTask(res.data.task);
    } catch (err) {
      console.error(err);
      toast.error("Не вдалося завантажити задачу");
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTask();
  }, [taskId, project.id]);

  const updateTask = async (data: CreateTaskDto) => {
    if (!taskId) return;

    try {
      setUpdating(true);
      await apiClient.patch(UPDATE_TASK_URL(project.id, taskId), data);
      toast.success("Задачу оновлено");
      navigate(`/projects/${project.id}/tasks/${taskId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Не вдалося оновити задачу");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-xl shadow-md p-4">
        <p className="text-center font-semibold">Завантаження...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="w-full rounded-xl shadow-md p-4">
        <p className="text-center font-semibold">Завдання не знайдено</p>
      </div>
    );
  }

  return (
    <TaskForm
      mode="edit"
      submitting={updating}
      initialValues={{
        title: task.title,
        description: task.description,
        complexity: task.complexity,
        deadline: dayjs(task.deadline).format("YYYY-MM-DDTHH:mm"),
        skills: task.taskSkills.map(
          (taskSkill) => taskSkill.skill as SkillInterface,
        ),
        attachments: task.attachments,
      }}
      onSubmit={updateTask}
    />
  );
};

export default EditTask;
