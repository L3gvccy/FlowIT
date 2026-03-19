import { AssignmentStatus, EmployeeRole } from "src/generated/prisma/enums";
import { canChangeAssignmentStatus } from "./assignment-status-permissions";

interface GetAvailableStatusTransitionsParams {
  currentStatus: AssignmentStatus;
  currentEmployeeId: string;
  assignedEmployeeId: string;
  currentEmployeeRole: EmployeeRole;
}

export const getAvailableStatusTransitions = ({
  currentStatus,
  currentEmployeeId,
  assignedEmployeeId,
  currentEmployeeRole,
}: GetAvailableStatusTransitionsParams): AssignmentStatus[] => {
  const allStatuses: AssignmentStatus[] = [
    AssignmentStatus.CREATED,
    AssignmentStatus.IN_PROGRESS,
    AssignmentStatus.SUBMITTED,
    AssignmentStatus.APPROVED,
    AssignmentStatus.REJECTED,
    AssignmentStatus.CANCELLED,
  ];

  return allStatuses.filter((nextStatus) =>
    canChangeAssignmentStatus({
      currentStatus,
      nextStatus,
      currentEmployeeId,
      assignedEmployeeId,
      currentEmployeeRole,
    }),
  );
};
