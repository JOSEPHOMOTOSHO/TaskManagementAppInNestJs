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

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: tasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }

  async getSingleTask(id: string): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`task with id of ${id} not found`);
    }

    return found;
  }

  async createTask(createTaskdto: createTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskdto);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    let taskToBeUpdated = await this.getSingleTask(id);

    taskToBeUpdated.status = status;

    await this.taskRepository.save(taskToBeUpdated);
    return taskToBeUpdated;
  }

  async deleteTask(id: string): Promise<void> {
    let deleted = await this.taskRepository.delete(id);
    if (deleted.affected === 0) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
  }
}
