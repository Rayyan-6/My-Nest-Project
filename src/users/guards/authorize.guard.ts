import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable } from "rxjs";

@Injectable()
export class AuthorizeGuard implements CanActivate{

    constructor(
            private readonly jwtService: JwtService,

            // @InjectRepository(authConfig.KEY)
            // private readonly authConfiguration: ConfigType<typeof authConfig>

            
        ){

        }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        
        const request = context.switchToHttp().getRequest()
        const token = request.headers.authorization?.split()[1]

        if(!token){
            throw new UnauthorizedException()
        }
        return true
    }


}