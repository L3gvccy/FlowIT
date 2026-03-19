import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AssignmentStatus, EmployeeRole } from "src/generated/prisma/enums";
import { canChangeAssignmentStatus } from "./utils/assignment-status-permissions";
import {
  UpdateAssignmentStatusDto,
  UpdateAssignmentStatusResponse,
} from "@flowit/shared";
import { getAvailableStatusTransitions } from "./utils/get-available-status-transitions";
import { PrismaService } from "src/prisma/prisma.service";
import { EmployeeService } from "src/employee/employee.service";

@Injectable()
export class AssignmentService {
  constructor(
    private readonly prisma: PrismaService,
    private employeeService: EmployeeService,
  ) {}

  async getAvailableStatuses(assignmentId: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        employee: true,
        task: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    const currentEmployee = await this.prisma.employee.findFirst({
      where: {
        userId,
        projectId: assignment.task.projectId,
      },
    });

    if (!currentEmployee) {
      throw new ForbiddenException("You are not a member of this project");
    }

    const availableStatuses = getAvailableStatusTransitions({
      currentStatus: assignment.status,
      currentEmployeeId: currentEmployee.id,
      assignedEmployeeId: assignment.employeeId,
      currentEmployeeRole: currentEmployee.role,
    });

    return {
      assignmentId: assignment.id,
      currentStatus: assignment.status,
      availableStatuses,
    };
  }

  async updateAssignmentStatus(
    assignmentId: string,
    userId: string,
    dto: UpdateAssignmentStatusDto,
  ): Promise<UpdateAssignmentStatusResponse> {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        task: true,
        employee: true,
        statusUpdates: {
          include: {
            attachments: true,
          },
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    const currentEmployee = await this.prisma.employee.findFirst({
      where: {
        userId,
        projectId: assignment.task.projectId,
      },
    });

    if (!currentEmployee) {
      throw new ForbiddenException("You are not a member of this project");
    }

    const nextStatus = dto.newStatus as AssignmentStatus;

    const isAllowed = canChangeAssignmentStatus({
      currentStatus: assignment.status,
      nextStatus,
      currentEmployeeId: currentEmployee.id,
      assignedEmployeeId: assignment.employeeId,
      currentEmployeeRole: currentEmployee.role,
    });

    if (!isAllowed) {
      throw new ForbiddenException("You cannot change assignment status");
    }

    const attachments = dto.attachments ?? [];
    const message = dto.message?.trim() || null;

    const updateData: {
      status: AssignmentStatus;
      completedAt?: Date;
    } = {
      status: nextStatus,
    };

    if (nextStatus === AssignmentStatus.SUBMITTED) {
      updateData.completedAt = new Date();
    }

    await this.prisma.assignment.update({
      where: { id: assignmentId },
      data: updateData,
    });

    await this.prisma.assignmentStatusUpdate.create({
      data: {
        assignmentId,
        newStatus: nextStatus,
        message,
        attachments: attachments.length
          ? {
              create: attachments.map((attachment) => ({
                fileName: attachment.fileName,
                fileUrl: attachment.fileUrl,
              })),
            }
          : undefined,
      },
    });

    const updatedAssignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        statusUpdates: {
          include: {
            attachments: true,
          },
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    if (!updatedAssignment) {
      throw new BadRequestException("Failed to reload assignment");
    }

    if (nextStatus === "APPROVED") {
      await this.employeeService.recalculateEmployeeKpi(
        assignment.employeeId,
        assignment.taskId,
      );
    }

    return {
      message: "Assignment status updated successfully",
      assignment: {
        id: updatedAssignment.id,
        taskId: updatedAssignment.taskId,
        employeeId: updatedAssignment.employeeId,
        status: updatedAssignment.status,
        completedAt: updatedAssignment.completedAt
          ? updatedAssignment.completedAt.toISOString()
          : null,
        updatedAt: updatedAssignment.updatedAt.toISOString(),
        statusUpdates: updatedAssignment.statusUpdates.map((update) => ({
          id: update.id,
          newStatus: update.newStatus,
          message: update.message,
          timestamp: update.timestamp.toISOString(),
          attachments: update.attachments.map((attachment) => ({
            id: attachment.id,
            fileName: attachment.fileName,
            fileUrl: attachment.fileUrl,
          })),
        })),
      },
    };
  }

  async deleteAssignment(assignmentId: string, userId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        task: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }

    const currentEmployee = await this.prisma.employee.findFirst({
      where: {
        userId,
        projectId: assignment.task.projectId,
      },
    });

    if (!currentEmployee) {
      throw new ForbiddenException("You are not a member of this project");
    }

    const isManagerOrOwner =
      currentEmployee.role === EmployeeRole.MANAGER ||
      currentEmployee.role === EmployeeRole.OWNER;

    if (!isManagerOrOwner) {
      throw new ForbiddenException(
        "Only manager or owner can delete assignment",
      );
    }

    if (
      assignment.status === AssignmentStatus.SUBMITTED ||
      assignment.status === AssignmentStatus.APPROVED
    ) {
      throw new BadRequestException(
        "Cannot delete assignment with submitted or approved status",
      );
    }

    await this.prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return {
      message: "Assignment deleted successfully",
    };
  }
}
