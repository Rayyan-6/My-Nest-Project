import { Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/users/events/user-created.event';

@Injectable()
export class EmailService {
  @OnEvent('user.created')
  handleUserCreatedEvent(payload: UserCreatedEvent){
    console.log("User created event received ", payload.email)
  }
}
