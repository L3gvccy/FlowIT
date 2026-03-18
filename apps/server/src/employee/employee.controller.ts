import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { AddEmployeeDto, UpdateEmployeeRoleDto } from "@flowit/shared";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get(":projectId")
  @UseGuards(JwtAuthGuard)
  async getEmployees(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Query("search") search?: string,
  ) {
    return this.employeeService.getEmployees(currentUser.id, projectId, search);
  }

  @Post(":projectId")
  @UseGuards(JwtAuthGuard)
  async addEmployee(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Body() dto: AddEmployeeDto,
  ) {
    return this.employeeService.addEmployee(currentUser.id, projectId, dto);
  }

  @Patch(":projectId/:employeeId/role")
  @UseGuards(JwtAuthGuard)
  async updateEmployeeRole(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Param("employeeId") employeeId: string,
    @Body() dto: UpdateEmployeeRoleDto,
  ) {
    return this.employeeService.updateEmployeeRole(
      currentUser.id,
      projectId,
      employeeId,
      dto,
    );
  }

  @Delete(":projectId/:employeeId")
  @UseGuards(JwtAuthGuard)
  async removeEmployee(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Param("employeeId") employeeId: string,
  ) {
    return this.employeeService.removeEmployee(
      currentUser.id,
      projectId,
      employeeId,
    );
  }

  @Get(":projectId/:employeeId")
  @UseGuards(JwtAuthGuard)
  async getEmployeeById(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Param("employeeId") employeeId: string,
  ) {
    return this.employeeService.getEmployeeById(
      currentUser.id,
      projectId,
      employeeId,
    );
  }

  @Post("search-users/:projectId")
  @UseGuards(JwtAuthGuard)
  async searchUsers(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Body("query") query: string,
  ) {
    return this.employeeService.searchUsers(currentUser.id, projectId, query);
  }
}
