import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: 'https://nest-api', // API Identifier
      issuer: 'https://dev-ahd1yqaukfuepkv6.us.auth0.com/', // Auth0 domain
      algorithms: ['RS256'],
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-ahd1yqaukfuepkv6.us.auth0.com/.well-known/jwks.json',
      }),
    });
  }

  async validate(payload: any) {
    console.log('✅ JWT VALIDATED');
    console.log('Payload:', payload);
    return payload;
  }
}
