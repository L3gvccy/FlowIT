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

export const complexityList = {
  1: "Легка ★",
  2: "Нижче середньої ★★",
  3: "Середня ★★★",
  4: "Висока ★★★★",
  5: "Критична ★★★★★",
};
