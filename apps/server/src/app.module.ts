import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SkillsModule } from './skills/skills.module';
import { ProjectModule } from './project/project.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [AuthModule, UserModule, SkillsModule, ProjectModule, FilesModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
