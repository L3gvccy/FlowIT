import type { AssignmentStatus, employeeRole } from "@flowit/shared";

export const employeeRoleToString = (role: employeeRole) => {
  switch (role) {
    case "OWNER":
      return "Власник";
    case "MANAGER":
      return "Менеджер";
    case "EMPLOYEE":
      return "Працівник";

    default:
      break;
  }
};

export const complexityList: Record<number, string> = {
  1: "Легка ★",
  2: "Нижче середньої ★★",
  3: "Середня ★★★",
  4: "Висока ★★★★",
  5: "Критична ★★★★★",
};

export const assignmentStatusList: Record<string, string> = {
  CREATED: "Створено",
  IN_PROGRESS: "В процесі",
  SUBMITTED: "Надіслано на перевірку",
  APPROVED: "Підтверджено",
  REJECTED: "Відхилено",
  CANCELLED: "Скасовано",
};

export const getFullName = (
  name?: string | null,
  surname?: string | null,
): string => {
  const fullName = `${name ?? ""} ${surname ?? ""}`.trim();
  return fullName || "Користувач";
};

interface CanChangeAssignmentStatusOnFrontendParams {
  currentStatus: AssignmentStatus;
  nextStatus: AssignmentStatus;
  currentEmployeeId?: string;
  assignedEmployeeId: string;
  currentEmployeeRole?: employeeRole;
}

export const canChangeAssignmentStatusOnFrontend = ({
  currentStatus,
  nextStatus,
  currentEmployeeId,
  assignedEmployeeId,
  currentEmployeeRole,
}: CanChangeAssignmentStatusOnFrontendParams): boolean => {
  if (!currentEmployeeId || !currentEmployeeRole) return false;

  const allowedTransitions: Record<AssignmentStatus, AssignmentStatus[]> = {
    CREATED: ["IN_PROGRESS"],
    IN_PROGRESS: ["SUBMITTED"],
    SUBMITTED: ["APPROVED", "REJECTED"],
    REJECTED: ["SUBMITTED"],
    APPROVED: [],
    CANCELLED: [],
  };

  const isTransitionAllowed =
    allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;

  if (!isTransitionAllowed) {
    return false;
  }

  const isAssignedEmployee = currentEmployeeId === assignedEmployeeId;
  const isManagerOrOwner =
    currentEmployeeRole === "MANAGER" || currentEmployeeRole === "OWNER";

  if (nextStatus === "IN_PROGRESS" || nextStatus === "SUBMITTED") {
    return isAssignedEmployee;
  }

  if (nextStatus === "APPROVED" || nextStatus === "REJECTED") {
    if (!isManagerOrOwner) return false;
    if (isAssignedEmployee) return false;
    return true;
  }

  return false;
};
