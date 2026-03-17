import { CreateTaskDto } from "@flowit/shared";
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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
            fileName: attachment.name,
            fileUrl: attachment.url,
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

    const editable = employee?.role !== "EMPLOYEE";

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { attachments: true, messages: true },
    });
  }
}
