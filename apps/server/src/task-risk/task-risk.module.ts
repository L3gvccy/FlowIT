import { Module } from "@nestjs/common";
import { TaskRiskService } from "./task-risk.service";
import { TaskRiskController } from "./task-risk.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [TaskRiskController],
  providers: [TaskRiskService, PrismaService],
})
export class TaskRiskModule {}
