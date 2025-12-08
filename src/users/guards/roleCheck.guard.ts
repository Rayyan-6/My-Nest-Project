import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/utility/decorators/role-check.decorator";

@Injectable()
export class RoleCheckGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // 1) Get allowed roles from decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Route has no role restriction
    }

    // 2) Get user injected by your AuthorizeGuard / middleware
    const request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user) {
      throw new ForbiddenException("Not authenticated.");
    }

    // 3) Check role
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Access denied for role: ${user.role}`);
    }

    return true;
  }
}
