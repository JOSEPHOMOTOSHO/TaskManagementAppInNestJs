import { TaskStatus } from '../task.model';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class tasksFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
  status: TaskStatus;

  @IsNotEmpty()
  @IsOptional()
  search: string;
}
