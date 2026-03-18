import { Module } from '@nestjs/common';
import { TaskScoreService } from './task-score.service';
import { TaskScoreController } from './task-score.controller';

@Module({
  controllers: [TaskScoreController],
  providers: [TaskScoreService],
})
export class TaskScoreModule {}
