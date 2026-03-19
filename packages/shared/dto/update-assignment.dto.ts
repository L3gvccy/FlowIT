import type { AssignmentStatus } from "../types/assignments";
import { AttachmentInterface } from "../types/attachment";

export interface UpdateAssignmentStatusDto {
  newStatus: AssignmentStatus;
  message?: string;
  attachments?: AttachmentInterface[];
}

export interface UpdateAssignmentStatusResponse {
  message: string;
  assignment: {
    id: string;
    taskId: string;
    employeeId: string;
    status: AssignmentStatus;
    completedAt: string | null;
    updatedAt: string;
    statusUpdates: {
      id: string;
      newStatus: AssignmentStatus;
      message: string | null;
      timestamp: string;
      attachments: AttachmentInterface[];
    }[];
  };
}
