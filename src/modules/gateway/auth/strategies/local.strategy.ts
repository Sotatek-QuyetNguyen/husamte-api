/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { Payload } from '../auth.interface';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private auth: AuthService) {
    super();
  }

  public async validate(email: string): Promise<Payload> {
    const user = await this.auth.validateUser(email);
    if (!user) {
      throw new UnauthorizedException('NotFoundUser');
    }

    return { userId: user.id.toString(), email: user.email, roles: [] };
  }
}
