import { Body, Controller, Post, UseGuards } from "@nestjs/common";
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
}
