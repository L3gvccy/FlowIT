import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { SkillsService } from "src/skills/skills.service";

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, SkillsService],
})
export class UserModule {}
