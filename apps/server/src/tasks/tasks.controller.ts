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
import { TasksService } from "./tasks.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { CreateTaskDto } from "@flowit/shared";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createTask(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: CreateTaskDto,
  ) {
    return await this.tasksService.createTask(currentUser.id, dto);
  }

  @Get("get/:projectId/:taskId")
  @UseGuards(JwtAuthGuard)
  async getTask(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
  ) {
    return await this.tasksService.getTask(currentUser.id, projectId, taskId);
  }

  @Get("get-tasks/:projectId")
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Query() query: any,
  ) {
    return await this.tasksService.getTasks(currentUser.id, projectId, query);
  }

  // Assignments
  @Get(":taskId/candidates")
  async getTaskCandidates(@Param("taskId") taskId: string) {
    return this.tasksService.getTaskCandidates(taskId);
  }

  @Post(":taskId/assign/:employeeId")
  async assignTask(
    @Param("taskId") taskId: string,
    @Param("employeeId") employeeId: string,
  ) {
    return this.tasksService.assignTask(taskId, employeeId);
  }

  @Patch("update/:projectId/:taskId")
  async updateTask(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.updateTask(projectId, taskId, dto);
  }

  @Delete("delete/:projectId/:taskId")
  async deleteTask(
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.tasksService.deleteTask(projectId, taskId);
  }
}
