import { AddEmployeeDto, UpdateEmployeeRoleDto } from "@flowit/shared";
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EmployeeRole } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async getEmployees(userId: string, projectId: string, search?: string) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee) {
      throw new ForbiddenException("Дія заборонена");
    }

    const editable = currentEmployee.role === EmployeeRole.OWNER;

    const employees = await this.prisma.employee.findMany({
      where: {
        projectId,
        ...(search
          ? {
              user: {
                OR: [
                  { email: { contains: search, mode: "insensitive" } },
                  { name: { contains: search, mode: "insensitive" } },
                  { surname: { contains: search, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      },
      include: {
        user: true,
        assignments: {
          include: {
            task: true,
          },
        },
        _count: {
          select: {
            assignments: true,
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { employees, editable, role: currentEmployee.role };
  }

  async addEmployee(userId: string, projectId: string, dto: AddEmployeeDto) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee || currentEmployee.role === EmployeeRole.EMPLOYEE) {
      throw new ForbiddenException("Дія заборонена");
    }

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException("Користувача не знайдено");
    }

    const exists = await this.prisma.employee.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId,
        },
      },
    });

    if (exists) {
      throw new BadRequestException("Працівник вже доданий до проєкту");
    }

    const employee = await this.prisma.employee.create({
      data: {
        userId: user.id,
        projectId,
        role: dto.role,
      },
      include: {
        user: true,
      },
    });

    return employee;
  }

  async updateEmployeeRole(
    userId: string,
    projectId: string,
    employeeId: string,
    dto: UpdateEmployeeRoleDto,
  ) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee || currentEmployee.role === EmployeeRole.EMPLOYEE) {
      throw new ForbiddenException("Дія заборонена");
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        projectId,
      },
    });

    if (!employee) {
      throw new NotFoundException("Працівника не знайдено");
    }

    if (employee.userId === userId && dto.role === EmployeeRole.EMPLOYEE) {
      throw new BadRequestException(
        "Не можна понизити власну роль до EMPLOYEE",
      );
    }

    return this.prisma.employee.update({
      where: { id: employeeId },
      data: { role: dto.role },
      include: {
        user: true,
      },
    });
  }

  async removeEmployee(userId: string, projectId: string, employeeId: string) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee || currentEmployee.role === EmployeeRole.EMPLOYEE) {
      throw new ForbiddenException("Дія заборонена");
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        projectId,
      },
    });

    if (!employee) {
      throw new NotFoundException("Працівника не знайдено");
    }

    if (employee.userId === userId) {
      throw new BadRequestException("Не можна вилучити себе з проєкту");
    }

    await this.prisma.employee.delete({
      where: { id: employeeId },
    });

    return { message: "Працівника вилучено" };
  }

  async getEmployeeById(userId: string, projectId: string, employeeId: string) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee) {
      throw new ForbiddenException("Дія заборонена");
    }

    const employee = await this.prisma.employee.findFirst({
      where: {
        id: employeeId,
        projectId,
      },
      include: {
        user: true,
        assignments: {
          include: {
            task: {
              include: {
                taskSkills: {
                  include: {
                    skill: true,
                  },
                },
                attachments: true,
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
          orderBy: {
            createdAt: "desc",
          },
        },
        messages: {
          include: {
            task: true,
          },
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException("Працівника не знайдено");
    }

    const totalTasks = employee.assignments.length;

    const overdueTasks = employee.assignments.filter((assignment) => {
      const deadline = new Date(assignment.task.deadline);
      const now = new Date();

      if (assignment.completedAt) {
        return new Date(assignment.completedAt) > deadline;
      }

      return now > deadline;
    }).length;

    const completedInTimeTasks = employee.assignments.filter((assignment) => {
      if (!assignment.completedAt) return false;

      return (
        new Date(assignment.completedAt) <= new Date(assignment.task.deadline)
      );
    }).length;

    return {
      employee,
      stats: {
        totalTasks,
        overdueTasks,
        completedInTimeTasks,
      },
      editable: currentEmployee.role !== EmployeeRole.EMPLOYEE,
    };
  }

  async searchUsers(userId: string, projectId: string, query: string) {
    const currentEmployee = await this.prisma.employee.findUnique({
      where: { userId_projectId: { userId, projectId } },
    });

    if (!currentEmployee || currentEmployee.role === "EMPLOYEE") {
      throw new ForbiddenException("Дія заборонена");
    }

    if (!query.trim()) {
      return { users: [] };
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: query, mode: "insensitive" } },
          { name: { contains: query, mode: "insensitive" } },
          { surname: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        image: true,
      },
      take: 10,
    });

    return { users };
  }
}
