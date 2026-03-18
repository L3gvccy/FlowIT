import { Controller } from '@nestjs/common';
import { TaskScoreService } from './task-score.service';

@Controller('task-score')
export class TaskScoreController {
  constructor(private readonly taskScoreService: TaskScoreService) {}
}
