import type { employeeRole } from "@flowit/shared";

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
