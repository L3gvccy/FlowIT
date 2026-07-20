import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { SkillsModule } from './skills/skills.module';
import { ProjectModule } from './project/project.module';
import { FilesModule } from './files/files.module';
import { TasksModule } from './tasks/tasks.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskScoreModule } from './task-score/task-score.module';
import { AssignmentModule } from './assignment/assignment.module';
import { TaskRiskModule } from './task-risk/task-risk.module';

@Module({
  imports: [AuthModule, UserModule, SkillsModule, ProjectModule, FilesModule, TasksModule, EmployeeModule, TaskScoreModule, AssignmentModule, TaskRiskModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
