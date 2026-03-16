import type { employeeRole } from "./employee-role";

export interface EmployeeInterface {
  id: string;
  userId: string;
  projectId: string;
  role: employeeRole;
  kpi: number;
  createdAt: Date;
}
