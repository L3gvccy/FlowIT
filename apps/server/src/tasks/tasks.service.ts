import {
  CreateTaskDto,
  IAssignTaskResponse,
  ITaskCandidatesResponse,
} from "@flowit/shared";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "src/generated/prisma/client";
import { AssignmentStatus, EmployeeRole } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskScoreService } from "src/task-score/task-score.service";

@Injectable()
export class TasksService {
  private readonly WORKING_HOURS_PER_DAY = 8;

  constructor(
    private prisma: PrismaService,
    private taskScoreService: TaskScoreService,
  ) {}

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

  // Assignments
  async getTaskCandidates(taskId: string): Promise<ITaskCandidatesResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        taskSkills: true,
        assignment: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Задача не знайдена");
    }

    const employees = await this.prisma.employee.findMany({
      where: {
        projectId: task.projectId,
        role: {
          in: ["MANAGER", "EMPLOYEE"],
        },
      },
      include: {
        user: {
          include: {
            userSkills: true,
          },
        },
        assignments: {
          include: {
            task: {
              include: {
                taskSkills: true,
              },
            },
          },
        },
      },
    });

    const requiredSkillIds = task.taskSkills.map(
      (taskSkill) => taskSkill.skillId,
    );

    const estimatedTime = this.estimateTaskTime(task.complexity);
    const daysUntilDeadline = this.calculateDaysUntilDeadline(task.deadline);
    const availableTimeWindow = this.WORKING_HOURS_PER_DAY * daysUntilDeadline;

    const candidatesPrecalc = employees.map((employee) => {
      const userSkillIds = employee.user.userSkills.map(
        (userSkill) => userSkill.skillId,
      );

      const completedSimilarTasks = this.countCompletedSimilarTasks(
        employee.assignments,
        requiredSkillIds,
      );

      const busyTimeWindow = this.calculateBusyTimeWindow(
        employee.assignments,
        task.deadline,
      );

      return {
        employee,
        userSkillIds,
        completedSimilarTasks,
        busyTimeWindow,
      };
    });

    const maxCompletedTasks = Math.max(
      ...candidatesPrecalc.map((item) => item.completedSimilarTasks),
      0,
    );

    const maxKpi = Math.max(
      ...employees.map((employee) => Number(employee.kpi)),
      0,
    );

    const candidates = candidatesPrecalc
      .map((item) => {
        const {
          employee,
          userSkillIds,
          completedSimilarTasks,
          busyTimeWindow,
        } = item;

        const kpi = Number(employee.kpi);

        const calculated = this.taskScoreService.calculateCandidateScore({
          requiredSkillIds,
          userSkillIds,
          completedSimilarTasks,
          maxCompletedTasks,
          kpi,
          maxKpi,
          estimatedTime,
          busyTimeWindow,
          availableTimeWindow,
        });

        return {
          employeeId: employee.id,
          userId: employee.user.id,
          fullName:
            `${employee.user.name ?? ""} ${employee.user.surname ?? ""}`.trim() ||
            employee.user.email,
          email: employee.user.email,
          role: employee.role,
          kpi,
          score: calculated.score,
          skillMatch: calculated.skillMatch,
          experienceScore: calculated.experienceScore,
          performanceScore: calculated.performanceScore,
          loadFactor: calculated.loadFactor,
          penalty: calculated.penalty,
          matchedSkillsCount: calculated.matchedSkillsCount,
          totalRequiredSkillsCount: calculated.totalRequiredSkillsCount,
          completedSimilarTasks,
          maxCompletedTasks,
          busyTimeWindow,
          estimatedTime,
          availableTimeWindow,
          daysUntilDeadline,
        };
      })
      .sort((a, b) => b.score - a.score);

    return {
      taskId: task.id,
      taskTitle: task.title,
      candidates,
    };
  }

  async assignTask(
    taskId: string,
    employeeId: string,
  ): Promise<IAssignTaskResponse> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignment: true,
      },
    });

    if (!task) {
      throw new NotFoundException("Задача не знайдена");
    }

    if (task.assignment) {
      throw new BadRequestException("Задача вже призначена");
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        projectId: task.projectId,
      },
      include: {
        user: true,
      },
    });

    if (!employee) {
      throw new BadRequestException(
        "Цей користувач не належить даному проекту",
      );
    }

    const assignment = await this.prisma.assignment.create({
      data: {
        taskId,
        employeeId,
        status: AssignmentStatus.CREATED,
        statusUpdates: {
          create: {
            newStatus: AssignmentStatus.CREATED,
            message: "Задача приначена",
          },
        },
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    return {
      message: "Задача успішно призначена",
      assignment: {
        id: assignment.id,
        taskId: assignment.taskId,
        employeeId: assignment.employeeId,
        status: assignment.status,
        createdAt: assignment.createdAt.toISOString(),
        updatedAt: assignment.updatedAt.toISOString(),
        employee: {
          id: assignment.employee.id,
          role: assignment.employee.role,
          user: {
            id: assignment.employee.user.id,
            name: assignment.employee.user.name,
            surname: assignment.employee.user.surname,
            email: assignment.employee.user.email,
          },
        },
      },
    };
  }

  private estimateTaskTime(complexity: number): number {
    return complexity * 4;
  }

  private calculateDaysUntilDeadline(deadline: Date): number {
    const now = new Date();

    const diffMs = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(diffDays, 1);
  }

  private countCompletedSimilarTasks(
    assignments: Array<{
      status: AssignmentStatus;
      task: {
        taskSkills: Array<{ skillId: string }>;
      };
    }>,
    requiredSkillIds: string[],
  ): number {
    const requiredSkillSet = new Set(requiredSkillIds);

    return assignments.filter((assignment) => {
      if (assignment.status !== AssignmentStatus.APPROVED) {
        return false;
      }

      const hasCommonSkill = assignment.task.taskSkills.some((taskSkill) =>
        requiredSkillSet.has(taskSkill.skillId),
      );

      return hasCommonSkill;
    }).length;
  }

  private calculateBusyTimeWindow(
    assignments: Array<{
      status: AssignmentStatus;
      task: {
        deadline: Date;
        complexity: number;
      };
    }>,
    newTaskDeadline: Date,
  ): number {
    const activeStatuses = new Set<AssignmentStatus>([
      AssignmentStatus.CREATED,
      AssignmentStatus.IN_PROGRESS,
      AssignmentStatus.SUBMITTED,
    ]);

    return assignments
      .filter((assignment) => {
        return (
          activeStatuses.has(assignment.status) &&
          assignment.task.deadline <= newTaskDeadline
        );
      })
      .reduce((sum, assignment) => {
        return sum + this.estimateTaskTime(assignment.task.complexity);
      }, 0);
  }
}
