import { EntityRepository, Repository } from 'typeorm';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './tasks.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: tasksFilterDto) {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskdto: createTaskDto): Promise<Task> {
    const { title, description } = createTaskdto;
    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(newTask);
    return newTask;
  }
}
