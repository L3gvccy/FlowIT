import type { EmployeeInterface } from "./employee";

export interface TaskMessageInterface {
  id: string;
  authorId: string;
  taskId: string;
  content: string | null;
  fileName: string | null;
  fileUrl: string | null;
  timestamp: string;
  employee: EmployeeInterface;
}
