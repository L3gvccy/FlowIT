import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";
import { apiClient } from "@/utils/api-client";
import type {
  IAssignTaskResponse,
  TaskInterface,
  UpdateAssignmentStatusResponse,
} from "@flowit/shared";
import {
  assignmentStatusList,
  complexityList,
  getFullName,
} from "@/utils/tools";
import { CalendarDays, MessageSquareMore, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import TaskAttchment from "@/components/project-attachment";
import {
  DELETE_ASSIGNMENT_URL,
  DELETE_TASK_URL,
  GET_TASK_URL,
} from "@/utils/constants";
import AssignTaskDialog from "./components/assign-task-dialog";
import UserAvatar from "@/components/user-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import ChangeAssignmentStatusDialog from "./components/change-assignment-status-dialog";

const Task = () => {
  const { taskId } = useParams();
  const { project } = useOutletContext<ProjectOutletContext>();
  const navigate = useNavigate();

  const [task, setTask] = useState<TaskInterface | null>(null);
  const [editable, setEditable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState(false);
  const [deletingAssignment, setDeletingAssignment] = useState(false);

  const getTask = async () => {
    if (!taskId) return;

    try {
      setLoading(true);
      const res = await apiClient.get(GET_TASK_URL(project.id, taskId));
      setTask(res.data.task);
      setEditable(res.data.editable);
    } catch (error) {
      console.error(error);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAssigned = async (_response: IAssignTaskResponse) => {
    await getTask();
  };

  const handleStatusUpdated = async (
    _response: UpdateAssignmentStatusResponse,
  ) => {
    await getTask();
  };

  const deleteTask = async () => {
    if (!taskId) return;

    try {
      setDeleting(true);
      await apiClient.delete(DELETE_TASK_URL(project.id, taskId));
      toast.success("Задачу видалено");
      navigate(`/projects/${project.id}/tasks`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Не вдалося видалити задачу");
    } finally {
      setDeleting(false);
    }
  };

  const deleteAssignment = async () => {
    if (!task || !task.assignment?.id) return;

    try {
      setDeletingAssignment(true);

      await apiClient.delete(DELETE_ASSIGNMENT_URL(task.assignment.id), {
        withCredentials: true,
      });

      toast.success("Призначення видалено");
      await getTask();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Не вдалося видалити призначення",
      );
    } finally {
      setDeletingAssignment(false);
    }
  };

  useEffect(() => {
    if (!taskId) {
      navigate(`/projects/${project.id}/tasks`);
      return;
    }
    getTask();
  }, [taskId, project.id, navigate]);

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
    <div className="flex flex-col gap-6 w-full rounded-xl shadow-md p-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 border-b pb-3">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold">{task.title}</p>
          <p className="opacity-80">
            {complexityList[task.complexity] ?? "Складність не вказана"}
          </p>
          <div className="flex items-center gap-2 text-sm opacity-70">
            <CalendarDays size={16} />
            <p>{dayjs(task.deadline).format("LLL")}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {editable && !task.assignment && taskId && (
            <AssignTaskDialog taskId={taskId} onAssigned={handleAssigned} />
          )}

          {task.assignment && (
            <ChangeAssignmentStatusDialog
              assignmentId={task.assignment.id}
              currentStatus={task.assignment.status}
              onUpdated={handleStatusUpdated}
            />
          )}

          {editable && (
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 hover:bg-zinc-200 transition cursor-pointer"
                onClick={() =>
                  navigate(`/projects/${project.id}/tasks/${task.id}/edit`)
                }
              >
                <Pencil size={16} />
                Редагувати
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl bg-red-100 text-red-700 px-3 py-2 hover:bg-red-200 transition cursor-pointer">
                    <Trash2 size={16} />
                    Видалити
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Видалити завдання?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Цю дію неможливо скасувати. Завдання, вкладення та
                      пов’язані дані буде видалено.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Скасувати</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteTask}
                      disabled={deleting}
                      className="bg-red-600 hover:bg-red-500"
                    >
                      {deleting ? "Видалення..." : "Видалити"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col gap-2 border-b pb-3">
        <p className="font-semibold">Опис</p>
        <p className="whitespace-pre-wrap opacity-90">
          {task.description || "Опис відсутній"}
        </p>
      </div>

      {/* ASSIGNMENT */}
      <div className="flex flex-col gap-2 border-b pb-3">
        <p className="font-semibold">Призначення</p>

        {task.assignment ? (
          <>
            <div className="flex items-center gap-2">
              <UserAvatar
                size="md"
                image={task.assignment.employee.user.image}
              />
              <div className="flex flex-col">
                <p>
                  {getFullName(
                    task.assignment.employee.user.name,
                    task.assignment.employee.user.surname,
                  )}
                </p>
                <p className="text-sm opacity-80">
                  {task.assignment.employee.user.email}
                </p>
              </div>
            </div>

            <p className="text-sm">
              {assignmentStatusList[task.assignment.status] ??
                task.assignment.status}
            </p>

            {task.assignment.completedAt && (
              <p className="text-sm opacity-70">
                Завершено: {dayjs(task.assignment.completedAt).format("LLL")}
              </p>
            )}

            {editable && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center w-fit gap-2 rounded-xl bg-red-100 text-red-700 px-3 py-2 hover:bg-red-200 transition cursor-pointer">
                    Скасувати призначення
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Видалити призначення?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Виконавець буде відв’язаний від задачі. Після цього задачу
                      можна буде призначити повторно.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="transition-all duration-300 cursor-pointer">
                      Скасувати
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={deleteAssignment}
                      disabled={deletingAssignment}
                      className="bg-red-600 hover:bg-red-500 transition-all duration-300 cursor-pointer"
                    >
                      {deletingAssignment
                        ? "Видалення..."
                        : "Видалити призначення"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        ) : (
          <p className="opacity-70">Не призначено</p>
        )}
      </div>

      {/* SKILLS */}
      <div className="flex flex-col gap-2 border-b pb-3">
        <p className="font-semibold">Скіли</p>

        {task.taskSkills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {task.taskSkills.map((taskSkill) => (
              <div
                key={taskSkill.skill.id}
                className="bg-zinc-100 px-3 py-1 rounded-xl text-sm"
              >
                {taskSkill.skill.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="opacity-70">Немає</p>
        )}
      </div>

      {/* ATTACHMENTS */}
      <div className="flex flex-col gap-2 border-b pb-3">
        <p className="font-semibold">Файли</p>

        {task.attachments?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {task.attachments.map((attachment) => (
              <TaskAttchment
                key={attachment.fileUrl}
                fileName={attachment.fileName}
                fileUrl={attachment.fileUrl}
              />
            ))}
          </div>
        ) : (
          <p className="opacity-70">Немає файлів</p>
        )}
      </div>

      {/* MESSAGES */}
      <div className="flex flex-col gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareMore size={16} />
          <p className="font-semibold">Повідомлення</p>
        </div>

        {task.messages?.length > 0 ? (
          task.messages.map((message) => (
            <div
              key={message.id}
              className="bg-zinc-100 rounded-xl p-3 flex flex-col gap-2"
            >
              <div className="flex justify-between text-sm">
                <p className="font-medium">
                  {getFullName(
                    message.employee.user.name,
                    message.employee.user.surname,
                  )}
                </p>
                <p className="opacity-60">
                  {dayjs(message.timestamp).format("LLL")}
                </p>
              </div>

              {message.content && (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}

              {message.fileUrl && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline opacity-80"
                >
                  {message.fileName || "Файл"}
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="opacity-70">Немає повідомлень</p>
        )}
      </div>

      {/* STATUS HISTORY */}
      {task.assignment && task.assignment?.statusUpdates?.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Історія</p>

          {task.assignment.statusUpdates.map((update) => (
            <div
              key={update.id}
              className="bg-zinc-100 rounded-xl p-3 flex flex-col gap-2"
            >
              <div className="flex justify-between text-sm">
                <p className="font-medium">
                  {assignmentStatusList[update.newStatus]}
                </p>
                <p className="opacity-60">
                  {dayjs(update.timestamp).format("LLL")}
                </p>
              </div>

              {update.message && <p>{update.message}</p>}

              {update.attachments?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {update.attachments.map((a) => (
                    <a
                      key={a.id}
                      href={a.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      {a.fileName}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;
