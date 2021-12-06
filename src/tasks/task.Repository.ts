import { InternalServerErrorException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './tasks.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository', { timestamp: true });
  async getTasks(filterDto: tasksFilterDto, user: User) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))`,
        {
          search: `%${search}%`,
        },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error: any) {
      this.logger.error(
        `The user ${
          user.username
        } is trying to get all tasks with ${JSON.stringify(filterDto)} `,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskdto: createTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskdto;
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.save(newTask);
    return newTask;
  }
}
