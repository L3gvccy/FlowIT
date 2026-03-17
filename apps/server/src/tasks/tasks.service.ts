import { CreateTaskDto } from "@flowit/shared";
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { AssignmentStatus, EmployeeRole } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, dto: CreateTaskDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId: dto.projectId } },
    });
    if (!employee || employee.role === "EMPLOYEE") {
      throw new ForbiddenException("У вас немає прав для даної дії");
    }

    const task = await this.prisma.task.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        complexity: dto.complexity,
        deadline: dto.deadline,
      },
    });

    if (dto.skills.length > 0) {
      for (const skill of dto.skills) {
        await this.prisma.taskSkill.create({
          data: { taskId: task.id, skillId: skill.id },
        });
      }
    }

    if (dto.attachments.length > 0) {
      for (const attachment of dto.attachments) {
        await this.prisma.taskAttachment.create({
          data: {
            taskId: task.id,
            fileName: attachment.fileName,
            fileUrl: attachment.fileUrl,
          },
        });
      }
    }

    return { task };
  }

  async getTask(userId: string, projectId: string, taskId: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!employee) {
      throw new ForbiddenException("Дія заборонена");
    }

    const editable = employee.role !== "EMPLOYEE";

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        attachments: true,
        taskSkills: {
          include: {
            skill: true,
          },
        },
        assignment: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
            statusUpdates: {
              include: {
                attachments: true,
              },
              orderBy: {
                timestamp: "desc",
              },
            },
          },
        },
        messages: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    return { task, editable };
  }

  async getTasks(userId: string, projectId: string, query: any) {
    const employee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!employee) {
      throw new ForbiddenException("Дія заборонена");
    }

    const editable = employee.role !== EmployeeRole.EMPLOYEE;
    const mode = query.mode === "my" ? "my" : "all";

    const where: any = {
      projectId,
    };

    if (mode === "my") {
      where.assignment = {
        employeeId: employee.id,
      };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.status) {
      where.assignment = {
        ...(where.assignment || {}),
        status: query.status as AssignmentStatus,
      };
    }

    if (query.complexity) {
      where.complexity = Number(query.complexity);
    }

    if (query.hasAssignment === "true") {
      where.assignment = {
        ...(where.assignment || {}),
        isNot: null,
      };
    }

    if (query.hasAssignment === "false") {
      where.assignment = null;
    }

    const orderBy = this.getOrderBy(query.sortBy, query.sortOrder);

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        taskSkills: {
          include: {
            skill: true,
          },
        },
        attachments: true,
        assignment: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
            statusUpdates: {
              include: {
                attachments: true,
              },
              orderBy: {
                timestamp: "desc",
              },
            },
          },
        },
      },
      orderBy,
    });

    return {
      tasks,
      editable,
      role: employee.role,
    };
  }

  private getOrderBy(
    sortBy?: string,
    sortOrder?: string,
  ): Prisma.TaskOrderByWithRelationInput {
    const order: Prisma.SortOrder = sortOrder === "asc" ? "asc" : "desc";

    switch (sortBy) {
      case "title":
        return { title: order };
      case "complexity":
        return { complexity: order };
      case "deadline":
        return { deadline: order };
      case "createdAt":
        return { createdAt: order };
      default:
        return { createdAt: "desc" };
    }
  }
}
