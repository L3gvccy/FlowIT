import { CalendarDays, User2 } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import type { TaskInterface } from "@flowit/shared";
import {
  assignmentStatusList,
  complexityList,
  getFullName,
} from "@/utils/tools";

interface Props {
  projectId: string;
  task: TaskInterface;
}

const TaskCard = ({ projectId, task }: Props) => {
  return (
    <Link
      to={`/projects/${projectId}/tasks/${task.id}`}
      className="flex flex-col gap-2 rounded-xl bg-zinc-100 p-3 hover:bg-zinc-200 transition-all duration-300"
    >
      <div className="flex flex-col gap-1">
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
