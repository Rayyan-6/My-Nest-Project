import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });




describe('UserService', () => {
  let service: UsersService;

  // Runs before each test
  beforeEach(async () => {
    // Create a testing module (like a small fake NestJS module)
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService], // Register the service we want to test
    }).compile();

    // Get an instance of the service from the testing module
    service = module.get<UsersService>(UsersService);
  });

  // A simple test case
  it('should return a greeting message', () => {
    const result = service.getGreeting('Rayyan');
    expect(result).toBe('Hello, Rayyan'); 
  });
});
