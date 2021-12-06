import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { TaskRepository } from './task.Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/auth/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: tasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getSingleTask(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, user });
    if (!found) {
      throw new NotFoundException(`task with id of ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskdto: createTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskdto, user);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    let taskToBeUpdated = await this.getSingleTask(id, user);

    taskToBeUpdated.status = status;

    await this.taskRepository.save(taskToBeUpdated);
    return taskToBeUpdated;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    let deleted = await this.taskRepository.delete({ id, user });
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }
}
