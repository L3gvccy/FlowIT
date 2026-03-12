import { UpdateProfileDto } from "@flowit/shared";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ProjectService } from "src/project/project.service";
import { SkillsService } from "src/skills/skills.service";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private skillsService: SkillsService,
    private projectService: ProjectService,
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

    const projects = await this.projectService.getMyProjects(userId);

    return { user, skills, projects, editable };
  }
}
