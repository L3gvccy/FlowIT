import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { CreateProjectDto } from "@flowit/shared";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get("get-my-projects")
  @UseGuards(JwtAuthGuard)
  async getMyProjects(@CurrentUser() currentUser: { id: string }) {
    return await this.projectService.getMyProjects(currentUser.id);
  }

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createProject(
    @Body() dto: CreateProjectDto,
    @CurrentUser() currentUser: { id: string },
  ) {
    return await this.projectService.createProject(currentUser.id, dto);
  }

  @Get("get/:projectId")
  @UseGuards(JwtAuthGuard)
  async getProject(
    @CurrentUser() currentUser: { id: string },
    @Param("projectId") projectId: string,
  ) {
    return await this.projectService.getProject(currentUser.id, projectId);
  }
}
