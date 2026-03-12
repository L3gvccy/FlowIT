import { CreateProjectDto } from "@flowit/shared";
import { Injectable } from "@nestjs/common";
import { EmployeeRole } from "src/generated/prisma/enums";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async getMyProjects(userId: string) {
    const employees = await this.prisma.employee.findMany({
      where: { userId },
    });
    const projectIds = employees.map((e) => e.projectId);
    const projects = await this.prisma.project.findMany({
      where: { id: { in: projectIds } },
    });

    return { employees, projects };
  }

  async createProject(userId: string, dto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: { name: dto.name, description: dto.description, image: dto.image },
    });

    const employee = await this.prisma.employee.create({
      data: { userId, projectId: project.id, role: EmployeeRole.OWNER },
    });

    return { project, employee };
  }
}
