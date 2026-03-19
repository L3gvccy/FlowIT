import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";
import CreateTaskBtn from "./components/create-task-btn";
import { apiClient } from "@/utils/api-client";
import { GET_TASKS_URL } from "@/utils/constants";
import type { TaskInterface } from "@flowit/shared";
import TaskCard from "./components/task-card";
import TaskBoardColumn from "./components/task-board-column";

type ViewMode = "list" | "board";
type TabMode = "all" | "my";

interface GetTasksResponse {
  tasks: TaskInterface[];
  editable: boolean;
  role: "OWNER" | "MANAGER" | "EMPLOYEE";
}

const Tasks = () => {
  const { employee, project } = useOutletContext<ProjectOutletContext>();

  const role = employee.role;
  const editable = role !== "EMPLOYEE";

  const [activeTab, setActiveTab] = useState<TabMode>(
    role === "EMPLOYEE" ? "my" : "all",
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [complexity, setComplexity] = useState("");
  const [hasAssignment, setHasAssignment] = useState("");
  const [sortBy, setSortBy] = useState("deadline");
  const [sortOrder, setSortOrder] = useState("asc");

  const getTasks = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("mode", activeTab);

      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (complexity) params.set("complexity", complexity);
      if (hasAssignment) params.set("hasAssignment", hasAssignment);
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);

      const res = await apiClient.get<GetTasksResponse>(
        GET_TASKS_URL(project.id, params.toString()),
      );

      setTasks(res.data.tasks);
    } catch (error) {
      console.error(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, [
    project.id,
    activeTab,
    search,
    status,
    complexity,
    hasAssignment,
    sortBy,
    sortOrder,
  ]);

  const groupedTasks = useMemo(() => {
    return {
      CREATED: tasks.filter((task) => task.assignment?.status === "CREATED"),
      IN_PROGRESS: tasks.filter(
        (task) => task.assignment?.status === "IN_PROGRESS",
      ),
      SUBMITTED: tasks.filter(
        (task) => task.assignment?.status === "SUBMITTED",
      ),
      APPROVED: tasks.filter((task) => task.assignment?.status === "APPROVED"),
      REJECTED: tasks.filter((task) => task.assignment?.status === "REJECTED"),
      CANCELLED: tasks.filter(
        (task) => task.assignment?.status === "CANCELLED",
      ),
      UNASSIGNED: tasks.filter((task) => !task.assignment),
    };
  }, [tasks]);

  const boardColumns = useMemo(() => {
    const columns = [
      {
        key: "CREATED",
        title: "Створено",
        tasks: groupedTasks.CREATED,
      },
      {
        key: "IN_PROGRESS",
        title: "В процесі",
        tasks: groupedTasks.IN_PROGRESS,
      },
      {
        key: "SUBMITTED",
        title: "Надіслано",
        tasks: groupedTasks.SUBMITTED,
      },
      {
        key: "APPROVED",
        title: "Підтверджено",
        tasks: groupedTasks.APPROVED,
      },
      {
        key: "REJECTED",
        title: "Відхилено",
        tasks: groupedTasks.REJECTED,
      },
      {
        key: "CANCELLED",
        title: "Скасовано",
        tasks: groupedTasks.CANCELLED,
      },
    ];

    if (activeTab === "all") {
      return [
        {
          key: "UNASSIGNED",
          title: "Без виконавця",
          tasks: groupedTasks.UNASSIGNED,
        },
        ...columns,
      ];
    }

    return columns;
  }, [activeTab, groupedTasks]);

  return (
    <div className="flex flex-col gap-4 p-3 w-full rounded-xl shadow-md">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="font-semibold text-lg tracking-wide">Задачі</p>
        {editable && <CreateTaskBtn projectId={project.id} />}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {role !== "EMPLOYEE" && (
          <>
            <button
              className={`rounded-xl px-3 py-2 transition-all duration-300 cursor-pointer ${
                activeTab === "all" ? "bg-violet-600 text-white" : "bg-zinc-100"
              }`}
              onClick={() => setActiveTab("all")}
            >
              Всі задачі
            </button>
            <button
              className={`rounded-xl px-3 py-2 transition-all duration-300 cursor-pointer ${
                activeTab === "my" ? "bg-violet-600 text-white" : "bg-zinc-100"
              }`}
              onClick={() => setActiveTab("my")}
            >
              Мої задачі
            </button>
          </>
        )}

        {role === "EMPLOYEE" && (
          <div className="rounded-xl bg-violet-600 px-3 py-2 text-white">
            Мої задачі
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-zinc-50 p-3">
        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук"
            className="rounded-xl bg-white px-3 py-2 outline-0 min-w-52"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 outline-0"
          >
            <option value="">Всі статуси</option>
            <option value="CREATED">Створено</option>
            <option value="IN_PROGRESS">В процесі</option>
            <option value="SUBMITTED">Надіслано</option>
            <option value="APPROVED">Підтверджено</option>
            <option value="REJECTED">Відхилено</option>
            <option value="CANCELLED">Скасовано</option>
          </select>

          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 outline-0"
          >
            <option value="">Вся складність</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <select
            value={hasAssignment}
            onChange={(e) => setHasAssignment(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 outline-0"
          >
            <option value="">Всі призначення</option>
            <option value="true">Призначені</option>
            <option value="false">Без виконавця</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 outline-0"
          >
            <option value="deadline">За дедлайном</option>
            <option value="createdAt">За датою створення</option>
            <option value="title">За назвою</option>
            <option value="complexity">За складністю</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="rounded-xl bg-white px-3 py-2 outline-0"
          >
            <option value="asc">За зростанням</option>
            <option value="desc">За спаданням</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className={`rounded-xl px-3 py-2 transition-all duration-300 cursor-pointer ${
              viewMode === "list" ? "bg-violet-600 text-white" : "bg-white"
            }`}
            onClick={() => setViewMode("list")}
          >
            Список
          </button>
          <button
            className={`rounded-xl px-3 py-2 transition-all duration-300 cursor-pointer ${
              viewMode === "board" ? "bg-violet-600 text-white" : "bg-white"
            }`}
            onClick={() => setViewMode("board")}
          >
            Дошка
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <p className="opacity-70">Завантаження...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex justify-center py-10">
          <p className="opacity-70">Задач не знайдено</p>
        </div>
      ) : viewMode === "board" ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {boardColumns.map((column) => (
            <TaskBoardColumn key={column.key} title={column.title}>
              {column.tasks.map((task) => (
                <TaskCard key={task.id} projectId={project.id} task={task} />
              ))}
            </TaskBoardColumn>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} projectId={project.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
