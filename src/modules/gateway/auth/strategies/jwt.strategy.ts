import { Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { REDIS } from 'src/share/common/constants';
import { Cache } from 'cache-manager';

import { JwtPayload, Payload } from '../auth.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "a",
    });
  }

  public async validate(payload: JwtPayload): Promise<Payload> {
    const lastTimeUserUpdate = await this.cacheManager.get(
      `${REDIS.PREFIX}:${REDIS.USER_UPDATE_TIME}:${payload.sub}`,
    );
    console.log(payload.sub, Number(lastTimeUserUpdate));
    console.log(payload.sub, Number(payload.createdAt));
    const checkToken =
      Number(lastTimeUserUpdate) !== 0 &&
      Number(lastTimeUserUpdate) <= Number(payload.createdAt);
    if (!checkToken) {
      // const userDb = await this.userRepository.findOne({ id: payload.sub });
      // if (userDb?.isActive === 0) {
      //   throw new HttpException(
      //     {
      //       code: -1,
      //       message: 'Unauthorized',
      //       data: null,
      //       status: 'fail',
      //     },
      //     HttpStatus.UNAUTHORIZED,
      //   );
      // }
    }
    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      createdAt: payload.createdAt,
      checkToken,
    };
  }
}
