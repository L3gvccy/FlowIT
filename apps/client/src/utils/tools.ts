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
