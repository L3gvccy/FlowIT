import { Module } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { TasksController } from "./tasks.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskScoreService } from "src/task-score/task-score.service";

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, TaskScoreService],
})
export class TasksModule {}
