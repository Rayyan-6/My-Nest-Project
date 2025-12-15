import { AuthGuard } from '@nestjs/passport';

export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user) {
    console.log('🛡 Auth Guard called');
    console.log('User:', user);
    console.log('Error:', err);
    return user;
  }
}
