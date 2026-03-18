import type { AssignmentStatus } from "../types/assignments";
import type { employeeRole } from "../types/employee-role";

export interface IAssignTaskResponse {
  message: string;
  assignment: {
    id: string;
    taskId: string;
    employeeId: string;
    status: AssignmentStatus;
    createdAt: string;
    updatedAt: string;
    employee: {
      id: string;
      role: employeeRole;
      user: {
        id: string;
        name: string | null;
        surname: string | null;
        email: string;
      };
    };
  };
}
