import { Link } from "react-router-dom";
import type { EmployeeInterface } from "@flowit/shared";
import { getFullName } from "@/utils/tools";
import UserAvatar from "@/components/user-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserMinus } from "lucide-react";

interface Props {
  projectId: string;
  employee: EmployeeInterface;
  editable: boolean;
  isCurrentUser: boolean;
  onRoleChange: (employeeId: string, role: string) => void;
  onRemove: (employeeId: string) => void;
}

const EmployeeCard = ({
  projectId,
  employee,
  editable,
  isCurrentUser,
  onRoleChange,
  onRemove,
}: Props) => {
  return (
    <div className="flex w-full flex-col gap-3 rounded-xl bg-zinc-100 p-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <UserAvatar size="md" image={employee.user.image || undefined} />

          <div className="flex flex-col gap-1">
            <Link
              to={`/projects/${projectId}/employees/${employee.id}`}
              className="font-semibold hover:underline"
            >
              {getFullName(employee.user.name, employee.user.surname)}
              {isCurrentUser && " (Ви)"}
            </Link>
            <p className="text-sm opacity-70">{employee.user.email}</p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-1">
          <p className="text-sm">Роль: {employee.role}</p>
          <p className="text-sm">KPI: {employee.kpi}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm">
          Задач:{" "}
          {employee._count?.assignments ?? employee.assignments?.length ?? 0}
        </p>
        <p className="text-sm">Повідомлень: {employee._count?.messages ?? 0}</p>
      </div>

      {editable && !isCurrentUser && (
        <div className="flex gap-2 flex-wrap">
          <Select
            value={employee.role}
            onValueChange={(value) => onRoleChange(employee.id, value)}
          >
            <SelectTrigger className="w-40 border-0 outline-0 bg-white rounded-xl">
              <SelectValue placeholder="Роль" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OWNER">OWNER</SelectItem>
              <SelectItem value="MANAGER">MANAGER</SelectItem>
              <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => onRemove(employee.id)}
            className="flex gap-2 items-center rounded-xl bg-red-500 px-3 py-2 text-white hover:bg-red-600 transition-all duration-300 cursor-pointer"
          >
            <UserMinus size={18} />
            Вилучити
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
