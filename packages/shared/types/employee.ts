import type { employeeRole } from "./employee-role";
import type { UserInterface } from "./user";

export interface EmployeeInterface {
  id: string;
  userId: string;
  projectId: string;
  role: employeeRole;
  kpi: number;
  createdAt: Date;
  user: UserInterface;
}
