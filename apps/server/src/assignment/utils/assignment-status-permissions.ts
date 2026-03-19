import { AssignmentStatus, EmployeeRole } from "src/generated/prisma/enums";

interface CanChangeAssignmentStatusParams {
  currentStatus: AssignmentStatus;
  nextStatus: AssignmentStatus;
  currentEmployeeId: string;
  assignedEmployeeId: string;
  currentEmployeeRole: EmployeeRole;
}

export const canChangeAssignmentStatus = ({
  currentStatus,
  nextStatus,
  currentEmployeeId,
  assignedEmployeeId,
  currentEmployeeRole,
}: CanChangeAssignmentStatusParams): boolean => {
  const allowedTransitions: Record<AssignmentStatus, AssignmentStatus[]> = {
    [AssignmentStatus.CREATED]: [AssignmentStatus.IN_PROGRESS],
    [AssignmentStatus.IN_PROGRESS]: [AssignmentStatus.SUBMITTED],
    [AssignmentStatus.SUBMITTED]: [
      AssignmentStatus.APPROVED,
      AssignmentStatus.REJECTED,
    ],
    [AssignmentStatus.REJECTED]: [AssignmentStatus.SUBMITTED],
    [AssignmentStatus.APPROVED]: [],
    [AssignmentStatus.CANCELLED]: [],
  };

  const isTransitionAllowed =
    allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;

  if (!isTransitionAllowed) {
    return false;
  }

  const isAssignedEmployee = currentEmployeeId === assignedEmployeeId;
  const isManagerOrOwner =
    currentEmployeeRole === EmployeeRole.MANAGER ||
    currentEmployeeRole === EmployeeRole.OWNER;

  if (
    nextStatus === AssignmentStatus.IN_PROGRESS ||
    nextStatus === AssignmentStatus.SUBMITTED
  ) {
    return isAssignedEmployee;
  }

  if (
    nextStatus === AssignmentStatus.APPROVED ||
    nextStatus === AssignmentStatus.REJECTED
  ) {
    if (!isManagerOrOwner) return false;
    if (isAssignedEmployee) return false;
    return true;
  }

  return false;
};
