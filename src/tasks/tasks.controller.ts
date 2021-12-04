import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { updateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: tasksFilterDto): Promise<Task[]> {
    return this.taskService.getTasks(filterDto);
  }

  @Post()
  createTask(@Body() createtaskdto: createTaskDto): Promise<Task> {
    return this.taskService.createTask(createtaskdto);
  }

  @Get('/:id')
  getSingleTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.getSingleTask(id);
  }

  @Patch('/:id/status')
  updateTask(
    @Body() updatetaskDto: updateTaskDto,
    @Param('id') id: string,
  ): Promise<Task> {
    const { status } = updatetaskDto;
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteSingleTask(@Param('id') id: string): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
