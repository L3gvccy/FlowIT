import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { AssignmentService } from "./assignment.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { UpdateAssignmentStatusDto } from "@flowit/shared";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("assignment")
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get(":assignmentId/available-statuses")
  @UseGuards(JwtAuthGuard)
  async getAvailableStatuses(
    @Param("assignmentId") assignmentId: string,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.assignmentService.getAvailableStatuses(
      assignmentId,
      currentUser.id,
    );
  }

  @Patch(":assignmentId/status")
  @UseGuards(JwtAuthGuard)
  async updateAssignmentStatus(
    @Param("assignmentId") assignmentId: string,
    @Body() dto: UpdateAssignmentStatusDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.assignmentService.updateAssignmentStatus(
      assignmentId,
      currentUser.id,
      dto,
    );
  }

  @Delete(":assignmentId")
  @UseGuards(JwtAuthGuard)
  async deleteAssignment(
    @Param("assignmentId") assignmentId: string,
    @CurrentUser() currentUser: { id: string },
  ) {
    return this.assignmentService.deleteAssignment(
      assignmentId,
      currentUser.id,
    );
  }
}
