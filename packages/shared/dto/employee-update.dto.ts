import type { employeeRole } from "../types/employee-role";

export interface AddEmployeeDto {
  email: string;
  role: employeeRole;
}

export interface UpdateEmployeeRoleDto {
  role: employeeRole;
}
