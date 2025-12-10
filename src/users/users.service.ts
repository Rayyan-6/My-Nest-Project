import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { instanceToPlain } from 'class-transformer';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from './events/user-created.event';
import { RedisClientService } from 'src/redis-client.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisClientService




  ){}

  async signup(userSignUpDto:UserSignUpDto): Promise<UserEntity>{

      const userExists = await  this.findUserByEmail(userSignUpDto.email);
      if(userExists) throw new BadRequestException('Email is not available')

      userSignUpDto.password = await hash(userSignUpDto.password,10)
      let user= this.usersRepository.create(userSignUpDto)
      user = await this.usersRepository.save(user)

      this.redisService.getClient().emit('user-created', userSignUpDto)
      console.log("Redis event emitter")

      this.eventEmitter.emit('user.created', new UserCreatedEvent(userSignUpDto.email))
      console.log("CQRS event emitter")
    
      return user

      
  }

  async signin(UserSignInDto: UserSignInDto):Promise<UserEntity>{
    const userExists = await this.usersRepository.createQueryBuilder('users')
    .addSelect('users.password').where('users.email=:email',{email:UserSignInDto.email}).getOne();
    if(!userExists) throw new BadRequestException('Bad credentials')

    const matchPasswords = await compare(UserSignInDto.password, userExists.password)
    if(!matchPasswords) throw new BadRequestException('Bad credentials')
    return userExists
  }




  findAll() {
    const users = this.usersRepository.find()
    return users;
  }

  async findOne(id: number) {
    const user= await this.usersRepository.findOne({where: {id}});
    if(!user) throw new NotFoundException('User not found')
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findUserByEmail(email: string){
    return await this.usersRepository.findOneBy({email})
  }

async accessToken(user: UserEntity):Promise<string> {
  if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
    throw new Error('ACCESS_TOKEN_SECRET_KEY is not defined');
  }

  return sign(
  { id: user.id, email: user.email },
  process.env.ACCESS_TOKEN_SECRET_KEY as string,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_LIMIT || "1h",
  } as SignOptions

  
);


}





}
