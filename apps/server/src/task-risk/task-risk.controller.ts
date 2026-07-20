import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { TaskRiskService } from "./task-risk.service";

@Controller("task-risk")
@UseGuards(JwtAuthGuard)
export class TaskRiskController {
  constructor(private readonly taskRiskService: TaskRiskService) {}

  @Get(":projectId/:taskId")
  getTaskRisk(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
    @Param("taskId") taskId: string,
  ) {
    return this.taskRiskService.calculateTaskRisk(
      currentUser.id,
      projectId,
      taskId,
    );
  }
}
