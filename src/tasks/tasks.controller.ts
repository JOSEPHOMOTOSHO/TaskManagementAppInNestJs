import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { taskUpdateValidation } from './pipes/task-update-validation.pipes';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: tasksFilterDto): Task[] {
    if (Object.keys(filterDto).length) {
      return this.taskService.getTaskByFilter(filterDto);
    }
    return this.taskService.getAllTasks();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createtaskdto: createTaskDto): Task {
    return this.taskService.createTask(createtaskdto);
  }

  @Get('/:id')
  getSingleTask(@Param('id') id: string): Task {
    return this.taskService.getSingleTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Body('status', taskUpdateValidation) status: TaskStatus,
    @Param('id') id: string,
  ): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteSingleTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }
}
