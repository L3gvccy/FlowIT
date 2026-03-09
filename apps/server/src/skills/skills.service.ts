import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  normalizeSkillName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .replace(/[.\-_]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s/g, "");
  }

  async findByName(name: string) {
    const normalizedName = this.normalizeSkillName(name);

    return await this.prisma.skill.findUnique({ where: { normalizedName } });
  }

  async getOrCreateSkill(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new BadRequestException("Skill name is required");
    }

    const normalizedName = this.normalizeSkillName(trimmedName);

    const existingSkill = await this.prisma.skill.findUnique({
      where: { normalizedName },
    });

    if (existingSkill) {
      return existingSkill;
    }

    return this.prisma.skill.create({
      data: {
        name: trimmedName,
        normalizedName,
      },
    });
  }

  async addSkillToUser(userId: string, skillName: string) {
    const skill = await this.getOrCreateSkill(skillName);

    const existingUserSkill = await this.prisma.userSkill.findUnique({
      where: { userId_skillId: { userId, skillId: skill.id } },
    });

    if (existingUserSkill) {
      throw new BadRequestException("Ця навичка вже додана до користувача");
    }

    await this.prisma.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
      },
    });

    const skills = (await this.getUserSkills(userId)).skills;

    return { skill, skills };
  }

  async removeSkillFromUser(userId: string, skillName: string) {
    const skill = await this.getOrCreateSkill(skillName);
    await this.prisma.userSkill.delete({
      where: { userId_skillId: { userId, skillId: skill.id } },
    });

    const skills = (await this.getUserSkills(userId)).skills;

    return { skill, skills };
  }

  async getUserSkills(userId: string) {
    const skills = await this.prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    return { skills };
  }

  async searchSkills(query?: string) {
    const skills = await this.prisma.skill.findMany({
      where: query
        ? {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                normalizedName: {
                  contains: this.normalizeSkillName(query),
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,
      orderBy: {
        name: "asc",
      },
      take: 20,
    });

    return { skills };
  }
}
