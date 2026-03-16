import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { SkillsService } from "./skills.service";
import type { UserSkillDto, SearchSkillDto } from "@flowit/shared";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

@Controller("skills")
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post("search-skills")
  async searchSkills(@Body() dto: SearchSkillDto) {
    return await this.skillsService.searchSkills(dto.query);
  }

  @Post("find-by-name")
  async findByName(@Body() dto: { name: string }) {
    const skill = await this.skillsService.getOrCreateSkill(dto.name);
    return { skill };
  }

  @UseGuards(JwtAuthGuard)
  @Post("add-user-skill")
  async addUserSkill(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: UserSkillDto,
  ) {
    return await this.skillsService.addSkillToUser(
      currentUser.id,
      dto.skillName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post("remove-user-skill")
  async removeUserSkill(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: UserSkillDto,
  ) {
    return await this.skillsService.removeSkillFromUser(
      currentUser.id,
      dto.skillName,
    );
  }
}
