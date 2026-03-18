import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ProjectOutletContext } from "../types/project-outlet-context";
import { apiClient } from "@/utils/api-client";
import { EMPLOYEE_URL } from "@/utils/constants";
import type { EmployeeInterface } from "@flowit/shared";
import EmployeeCard from "./components/employee-card";
import EmployeeSearch from "./components/employee-search";

interface EmployeesResponse {
  employees: EmployeeInterface[];
  editable: boolean;
  role: "OWNER" | "MANAGER" | "EMPLOYEE";
}

interface FoundUser {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  image: string | null;
}

const Employees = () => {
  const { project, employee: currentEmployee } =
    useOutletContext<ProjectOutletContext>();

  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const getEmployees = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());

      const res = await apiClient.get<EmployeesResponse>(
        `${EMPLOYEE_URL}/${project.id}${
          params.toString() ? `?${params.toString()}` : ""
        }`,
      );

      setEmployees(res.data.employees);
      setEditable(res.data.editable);
    } catch (error) {
      console.error(error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (user: FoundUser, role: string) => {
    try {
      await apiClient.post(`${EMPLOYEE_URL}/${project.id}`, {
        email: user.email,
        role,
      });

      getEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRoleChange = async (employeeId: string, role: string) => {
    try {
      await apiClient.patch(
        `${EMPLOYEE_URL}/${project.id}/${employeeId}/role`,
        {
          role,
        },
      );

      getEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (employeeId: string) => {
    try {
      await apiClient.delete(`${EMPLOYEE_URL}/${project.id}/${employeeId}`);
      getEmployees();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEmployees();
  }, [project.id, search]);

  return (
    <div className="flex flex-col gap-4 p-3 w-full rounded-xl shadow-md">
      <p className="font-semibold text-lg tracking-wide text-center">
        Персонал
      </p>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Пошук працівника проекту"
        className="rounded-xl bg-zinc-100 px-3 py-2 outline-0 w-full"
      />

      {editable && (
        <div className="flex gap-2 flex-wrap items-start">
          <div className="flex-1 min-w-72">
            <EmployeeSearch
              projectId={project.id}
              usersToFilter={employees.map((employee) => ({
                userId: employee.userId,
              }))}
              onAdd={handleAddEmployee}
            />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center opacity-70">Завантаження...</p>
      ) : employees.length > 0 ? (
        <div className="flex flex-col gap-3 w-full">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              projectId={project.id}
              employee={employee}
              editable={editable}
              isCurrentUser={employee.id === currentEmployee.id}
              onRoleChange={handleRoleChange}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <p className="text-center opacity-70">Працівників не знайдено</p>
      )}
    </div>
  );
};

export default Employees;
