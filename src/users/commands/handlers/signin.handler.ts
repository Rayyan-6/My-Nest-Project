import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SignInCommand } from '../signin.command';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sign, SignOptions } from 'jsonwebtoken';
import { config } from 'dotenv';


config()

@CommandHandler(SignInCommand)
export class SignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: SignInCommand) {
    const { email, password } = command;

    const user = await this.usersRepo.createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .getOne();

    if (!user) throw new Error('Bad credentials');

    const ok = await compare(password, (user as any).password);
    if (!ok) throw new Error('Bad credentials');

    const payload = { id: user.id, email: user.email, role: (user as any).role };
    const accessToken = this.jwtService.sign(
    //     payload, {
    //   secret: process.env.ACCESS_TOKEN_SECRET_KEY,
    //   expiresIn: process.env.ACCESS_TOKEN_EXPIRE_LIMIT || '1h',
    // }


    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET_KEY as string,
    {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_LIMIT || "1h",
    } 
    as SignOptions

);

    delete (user as any).password;
    return { user, accessToken };
  }
}
