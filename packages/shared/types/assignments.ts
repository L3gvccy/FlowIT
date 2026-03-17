import type { EmployeeInterface } from "./employee";

export type AssignmentStatus =
  | "CREATED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface AssignmentStatusAttachmentInterface {
  id: string;
  statusUpdateId: string;
  fileName: string;
  fileUrl: string;
}

export interface AssignmentStatusUpdateInterface {
  id: string;
  assignmentId: string;
  newStatus: AssignmentStatus;
  message: string | null;
  timestamp: string;
  attachments: AssignmentStatusAttachmentInterface[];
}

export interface AssignmentInterface {
  id: string;
  taskId: string;
  employeeId: string;
  status: AssignmentStatus;
  completedAt: string | null;
  employee: EmployeeInterface;
  statusUpdates: AssignmentStatusUpdateInterface[];
}
