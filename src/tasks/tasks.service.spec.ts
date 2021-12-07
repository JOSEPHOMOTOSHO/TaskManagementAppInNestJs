import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.Repository';
import { title } from 'process';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const user = {
  id: '1',
  username: 'Omotosho Joseph',
  password: '123456',
  tasks: [],
};

describe('Testing the Tasks Service', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls the taskRepository.getTasks and it should return a result', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, user);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTask by Id', () => {
    it('calls the taskRepository.findOne and it should return a result', async () => {
      let mockTask = {
        id: '1',
        title: 'we doing great',
        description: 'yea we are',
        status: TaskStatus.OPEN,
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getSingleTask('someId', user);
      expect(result).toEqual(mockTask);
    });
    it('calls the taskRepository.findOne  and it should throw an error', async () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(taskService.getSingleTask('someid', user)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
