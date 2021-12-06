import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.Repository';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
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
      taskRepository.getTasks.mockResolvedValue('resolved-Value');
      const result = await taskRepository.getTasks(null, user);
      expect(result).toEqual('resolved-Value');
    });
  });
});
