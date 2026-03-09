import { UpdateProfileDto } from "@flowit/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { SkillsService } from "src/skills/skills.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private skillsService: SkillsService,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const exists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!exists) {
      throw new NotFoundException("Користувача не знайдено");
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isProfileCompleted: true, name: dto.name, surname: dto.surname },
      omit: { password: true },
    });

    return { user: updatedUser };
  }

  async getProfile(userId: string, viewerId: string) {
    const editable = userId === viewerId;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      omit: { password: true },
    });

    const skills = (await this.skillsService.getUserSkills(userId)).skills;

    const userEmployees = await this.prisma.employee.findMany({
      where: { userId: userId },
    });
    const projectIds = userEmployees.map((e) => e.projectId);
    const projects = await this.prisma.project.findMany({
      where: { id: { in: projectIds } },
    });

    return { user, skills, projects, editable };
  }
}
