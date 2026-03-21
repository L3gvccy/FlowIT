import { CalendarDays, User2 } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import type { TaskInterface } from "@flowit/shared";
import {
  assignmentStatusList,
  complexityList,
  getFullName,
} from "@/utils/tools";
import ProjectLogo from "@/components/project/project-logo";

interface Props {
  projectId: string;
  task: TaskInterface;
  showProjectInfo?: boolean;
}

const TaskCard = ({ projectId, task, showProjectInfo = false }: Props) => {
  const getBG = () => {
    if (!task.assignment) {
      return "bg-zinc-100 hover:bg-zinc-200";
    }
    switch (task.assignment.status) {
      case "CREATED":
        return "bg-sky-100 hover:bg-sky-200";
      case "IN_PROGRESS":
        return "bg-amber-100 hover:bg-amber-200";
      case "SUBMITTED":
        return "bg-violet-100 hover:bg-violet-200";
      case "APPROVED":
        return "bg-emerald-100 hover:bg-emerald-200";
      case "REJECTED":
        return "bg-rose-100 hover:bg-rose-200";
      case "CANCELLED":
        return "bg-zinc-200 hover:bg-zinc-300";
      default:
        return "bg-zinc-100 hover:bg-zinc-200";
    }
  };
  return (
    <Link
      to={`/projects/${projectId}/tasks/${task.id}`}
      className={`flex flex-col gap-2 p-3 rounded-xl transition-all duration-300 ${getBG()}`}
    >
      <div className="flex flex-col gap-1">
        {showProjectInfo && (
          <div className="flex items-center gap-2">
            <ProjectLogo size="xs" image={task.project?.image} />
            <p className="font-semibold line-clamp-2">{task.project?.name}</p>
          </div>
        )}

        <p className="font-semibold line-clamp-2">{task.title}</p>
        <p className="text-sm opacity-70">
          {complexityList[task.complexity] ?? "Складність не вказана"}
        </p>
      </div>

      <p className="text-sm opacity-80 line-clamp-2">
        {task.description || "Опис відсутній"}
      </p>

      <div className="flex items-center gap-2 text-sm opacity-70">
        <CalendarDays size={16} />
        <p>{dayjs(task.deadline).format("DD.MM.YYYY HH:mm")}</p>
      </div>

      {task.assignment && (
        <>
          <div className="flex items-center gap-2 text-sm opacity-80">
            <User2 size={16} />
            <p>
              {getFullName(
                task.assignment.employee.user.name,
                task.assignment.employee.user.surname,
              )}
            </p>
          </div>

          <p className="text-sm opacity-80">
            {assignmentStatusList[task.assignment.status] ??
              task.assignment.status}
          </p>
        </>
      )}

      {task.taskSkills?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.taskSkills.slice(0, 3).map((taskSkill) => (
            <div
              key={taskSkill.skill.id}
              className="rounded-xl bg-white px-2 py-1 text-xs"
            >
              {taskSkill.skill.name}
            </div>
          ))}
        </div>
      )}
    </Link>
  );
};

export default TaskCard;
