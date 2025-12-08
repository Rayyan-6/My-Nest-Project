// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Observable } from "rxjs";

// @Injectable()
// export class AuthorizeGuard implements CanActivate{

//     constructor(
//             private readonly jwtService: JwtService,

            

            
//         ){

//         }

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        
//         const request = context.switchToHttp().getRequest()
//         const token = request.headers.authorization?.split()[1]

//         if(!token){
//             throw new UnauthorizedException()
//         }
//         return true
//     }


// }



import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthorizeGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        console.log("👉 AuthorizeGuard executing...");

        const request = context.switchToHttp().getRequest();

        console.log("👉 Request Headers:", request.headers);

        // 1. Extract authorization header
        const authHeader = request.headers.authorization;
        console.log("👉 Authorization Header:", authHeader);

        if (!authHeader) {
            console.log("❌ No Authorization header found");
            throw new UnauthorizedException("Authorization header missing");
        }

        // 2. Must be in format: "Bearer <token>"
        const headerParts = authHeader.split(" ");
        console.log("👉 Auth header parts:", headerParts);

        const [type, token] = headerParts;

        if (type !== "Bearer") {
            console.log("❌ Invalid token type. Expected 'Bearer', got:", type);
            throw new UnauthorizedException("Invalid authorization format");
        }

        if (!token) {
            console.log("❌ Token missing after Bearer");
            throw new UnauthorizedException("Token missing");
        }

        console.log("👉 Token extracted:", token);

        try {
            // 3. Verify token
            console.log("👉 Verifying token...");
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: process.env.ACCESS_TOKEN_SECRET_KEY
            });

            console.log("✅ Token verified! Decoded data:", decoded);

            // 4. Attach user data to request (so @CurrentUser() can use it)
            request.currentUser = decoded;

            return true;
        } 
        catch (error) {
            console.log("❌ Token verification failed:", error.message);
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
}
