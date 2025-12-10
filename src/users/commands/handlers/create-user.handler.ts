import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../create-user.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { hash } from 'bcrypt';
import { UserCreatedEvent } from 'src/users/events/user-created.event';
// import { UserCreatedEvent } from '../../events/user-created.event';


@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly eventBus: EventBus, // optional, to publish events
  ) {}

  async execute(command: CreateUserCommand) {
    const { name, email, password } = command;

    const exists = await this.usersRepo.findOneBy({ email });
    if (exists) throw new Error('Email already exists');

    const hashed = await hash(password, 10);
    const user = this.usersRepo.create({
      name,
      email,
      password: hashed,
      
    });

    const saved = await this.usersRepo.save(user);

    // publish an event (optional)
    this.eventBus.publish(new UserCreatedEvent(saved.email, saved.id));

    // remove password before returning
    // convert to plain object if desired
    delete (saved as any).password;
    return saved;
  }
}
