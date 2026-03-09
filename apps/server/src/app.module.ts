import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SkillsModule } from './skills/skills.module';

@Module({
  imports: [AuthModule, UserModule, SkillsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
