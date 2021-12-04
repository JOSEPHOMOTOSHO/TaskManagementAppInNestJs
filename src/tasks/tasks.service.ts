import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { tasksFilterDto } from './dto/tasks-filters.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskByFilter(filterTaskDto: tasksFilterDto) {
    const { search, status } = filterTaskDto;
    let tasks = this.getAllTasks();
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    return tasks;
  }

  getSingleTask(id: string) {
    let taskIndex: number = this.tasks.findIndex((task) => {
      return task.id === id;
    });
    let task: Task = this.tasks[taskIndex];
    if (!task) {
      throw new NotFoundException(`task with id of ${id} not found`);
    }
    return task;
  }

  createTask(createtaskdto: createTaskDto): Task {
    const { title, description } = createtaskdto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    let taskToBeUpdated = this.getSingleTask(id);
    taskToBeUpdated.status = status;
    return taskToBeUpdated;
  }

  deleteTask(id: string): void {
    let found = this.getSingleTask(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }
}
