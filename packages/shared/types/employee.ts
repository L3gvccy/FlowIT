import type { AssignmentInterface } from "./assignments";
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
  assignments?: AssignmentInterface[];
  _count?: {
    assignments: number;
    messages: number;
  };
}
