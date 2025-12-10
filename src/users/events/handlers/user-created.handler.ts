import { EventsHandler, IEventHandler, } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../user-created.event';
import { EventPattern, Payload } from '@nestjs/microservices';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  handle(event: UserCreatedEvent) {
    // send welcome email, audit log, etc.
    console.log('User created, id:', event.id);
  }

  @EventPattern('user_created')
  handleUserCreated(@Payload() data: any) {
    console.log('New user event received:', data);
    // perform async actions like sending email, logging, etc.
  }
}
