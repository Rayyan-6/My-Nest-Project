import { Injectable, NestMiddleware } from "@nestjs/common";
import { isArray } from "class-validator";
import { config } from "dotenv";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

config()


declare global{
    namespace Express{
        interface Request{
            currentUser?: UserEntity
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {

    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {

        const rawHeader = req.headers.authorization;
        const authHeader = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

        // Correct logic
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (req as any).currentUser = null;
            return next();
        }

        try {
            console.log("else part exec");

            const token = authHeader.split(' ')[1];
            console.log("Token received:", token);


            const { id } = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET_KEY!
            ) as JwtPayload;

            const currentUser = await this.usersService.findOne(+id);
            req.currentUser = currentUser;

            console.log("current user:", currentUser);

            (req as any).currentUser = currentUser;
        } catch (err) {
            console.log("Invalid token");
        }

        next();
    }
}

interface JwtPayload {
    id: string;
}