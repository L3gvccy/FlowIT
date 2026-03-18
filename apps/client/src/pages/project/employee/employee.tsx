import React, { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";
import { apiClient } from "@/utils/api-client";
import { EMPLOYEE_URL, GET_EMPLOYEE_URL } from "@/utils/constants";
import type { EmployeeInterface, AssignmentInterface } from "@flowit/shared";
import UserAvatar from "@/components/user-avatar";
import dayjs from "dayjs";
import {
  assignmentStatusList,
  complexityList,
  getFullName,
} from "@/utils/tools";
import { Link } from "react-router-dom";

interface EmployeeDetailsResponse {
  employee: EmployeeInterface & {
    assignments: AssignmentInterface[];
  };
  stats: {
    totalTasks: number;
    overdueTasks: number;
    completedInTimeTasks: number;
  };
  editable: boolean;
}

const EmployeePage = () => {
  const { project } = useOutletContext<ProjectOutletContext>();
  const { employeeId } = useParams();

  const [employee, setEmployee] = useState<
    EmployeeDetailsResponse["employee"] | null
  >(null);
  const [stats, setStats] = useState<EmployeeDetailsResponse["stats"] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const getEmployee = async () => {
    if (!employeeId) return;

    try {
      setLoading(true);

      const res = await apiClient.get<EmployeeDetailsResponse>(
        GET_EMPLOYEE_URL(project.id, employeeId),
      );

      setEmployee(res.data.employee);
      setStats(res.data.stats);
    } catch (error) {
      console.error(error);
      setEmployee(null);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [project.id, employeeId]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-3 w-full rounded-xl shadow-md">
        <p className="text-center">Завантаження...</p>
      </div>
    );
  }

  if (!employee || !stats) {
    return (
      <div className="flex flex-col gap-2 p-3 w-full rounded-xl shadow-md">
        <p className="text-center">Працівника не знайдено</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 w-full rounded-xl shadow-md">
      <div className="flex flex-col gap-4 border-b pb-3 md:flex-row md:items-start">
        <UserAvatar size="xl2" image={employee.user.image || undefined} />

        <div className="flex flex-col gap-2">
          <p className="font-semibold text-lg tracking-wide">
            {getFullName(employee.user.name, employee.user.surname)}
          </p>
          <p className="opacity-80">{employee.user.email}</p>
          <p className="text-sm">Роль: {employee.role}</p>
          <p className="text-sm">KPI: {employee.kpi}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b pb-3">
        <p className="font-semibold">Статистика</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-sm opacity-70">Всього задач</p>
            <p className="font-semibold text-lg">{stats.totalTasks}</p>
          </div>

          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-sm opacity-70">Не завершені вчасно</p>
            <p className="font-semibold text-lg">{stats.overdueTasks}</p>
          </div>

          <div className="rounded-xl bg-zinc-100 p-3">
            <p className="text-sm opacity-70">Завершені вчасно</p>
            <p className="font-semibold text-lg">
              {stats.completedInTimeTasks}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-semibold">Задачі працівника</p>

        {employee.assignments.length > 0 ? (
          employee.assignments.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/projects/${project.id}/tasks/${assignment.task.id}`}
              className="rounded-xl bg-zinc-100 p-3 flex flex-col gap-2 hover:bg-zinc-200 transition-all duration-300"
            >
              <p className="font-semibold">{assignment.task.title}</p>
              <p className="text-sm opacity-80">
                {assignment.task.description || "Опис відсутній"}
              </p>
              <p className="text-sm">
                Складність:{" "}
                {complexityList[assignment.task.complexity] ??
                  assignment.task.complexity}
              </p>
              <p className="text-sm">
                Статус:{" "}
                {assignmentStatusList[assignment.status] ?? assignment.status}
              </p>
              <p className="text-sm opacity-70">
                Дедлайн:{" "}
                {dayjs(assignment.task.deadline).format("DD.MM.YYYY HH:mm")}
              </p>
            </Link>
          ))
        ) : (
          <p className="opacity-70">У працівника немає задач</p>
        )}
      </div>
    </div>
  );
};

export default EmployeePage;
