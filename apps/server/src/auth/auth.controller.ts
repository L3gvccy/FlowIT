import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "./jwt-auth.guard";
import type { AuthDto } from "@flowit/shared";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: AuthDto) {
    const { user, token } = await this.authService.register(dto);

    return { user, accessToken: token };
  }

  @Post("login")
  async login(@Body() dto: AuthDto) {
    const { user, token } = await this.authService.login(dto);

    return { user, accessToken: token };
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@CurrentUser() currentUser: { id: string }) {
    return await this.authService.getMe(currentUser.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("logout")
  async logout() {
    return { message: "Ви успішно вийшли з акаунту" };
  }
}
