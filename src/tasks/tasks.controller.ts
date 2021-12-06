import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { updateTaskDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TaskController', { timestamp: true });
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: tasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `The user ${
        user.username
      } is trying to retrieve all tasks using a filter: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Post()
  createTask(
    @Body() createtaskdto: createTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `The user ${
        user.username
      } is trying to create a task with these details  ${JSON.stringify(
        createtaskdto,
      )}`,
    );
    return this.taskService.createTask(createtaskdto, user);
  }

  @Get('/:id')
  getSingleTask(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.taskService.getSingleTask(id, user);
  }

  @Patch('/:id/status')
  updateTask(
    @Body() updatetaskDto: updateTaskDto,
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updatetaskDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  @Delete('/:id')
  deleteSingleTask(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }
}
