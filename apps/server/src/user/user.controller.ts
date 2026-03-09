import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import type { UpdateProfileDto } from "@flowit/shared";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post("update-profile")
  async updateProfile(
    @CurrentUser() currentUser: { id: string },
    @Body() dto: UpdateProfileDto,
  ) {
    return await this.userService.updateProfile(currentUser.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("get/:userId")
  async getProfile(
    @CurrentUser() currentUser: { id: string },
    @Param("userId") userId: string,
  ) {
    return await this.userService.getProfile(userId, currentUser.id);
  }
}
