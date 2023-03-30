import {
  Injectable,
  HttpException,
  HttpStatus,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BaseService } from 'src/share/common/base.service';
import { REDIS } from 'src/share/common/constants';
import { UtilService } from 'src/share/common/providers/util.service';
import { PrismaService } from 'src/share/prisma/prisma.service';
import { Cache } from 'cache-manager';

import { JwtPayload, Payload } from '../auth.interface';
import { LoginInput } from '../dtos/login.input';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private jwt: JwtService,
    private util: UtilService,
    prismaService: PrismaService,
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(prismaService, 'user', 'User', configService);
    //this.cacheManager.on('error', this.handleCacheError);
  }

  /* Validate user by email
  @Param: email
  @Return: user/null
  */
  public async validateUser(email: string): Promise<any> {
    const user = await this.prismaService.user.findFirst({
      where: { email: email },
    });

    if (user) {
      const { password: pass, ...result } = user;
      return result;
    }

    return null;
  }

  public signJwt(user: Payload): string {
    this.setTokenTime(user.userId);
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      roles: user.roles,
      createdAt: Math.round(Date.now() / 1000),
    };
    return this.jwt.sign(payload);
  }

  public async setTokenTime(id: string): Promise<void> {
    const checkUserChangeTime = await this.cacheManager.get(
      `${REDIS.PREFIX}:${REDIS.USER_UPDATE_TIME}:${id}`,
    );
    console.log(`${REDIS.PREFIX}:${REDIS.USER_UPDATE_TIME}:${id}`);
    if (!checkUserChangeTime) {
      await this.cacheManager.set(
        `${REDIS.PREFIX}:${REDIS.USER_UPDATE_TIME}:${id}`,
        String(Math.round(Date.now() / 1000) - 1),
        REDIS.EXPIRED_ACCOUNT,
      );
    }
  }

  /* Sign in
  @Param: LoginInput
  @Return:
  */
  public async signIn(body: LoginInput): Promise<any> {
    const { email, password } = body;
    console.log(body);
    const checkUserExist = await this.prismaService.user.findFirst({
      where: { email: email },
    });
    if (checkUserExist) {
      // if (checkUserExist.isActive === 0)
      //   throw new HttpException('user is not active', HttpStatus.BAD_REQUEST);
      const checkPassword = await this.util.comparePassword(
        password,
        checkUserExist?.password,
      );
      if (checkPassword) {
        return this.util.buildSuccessResponse({
          twoFactor: false,
          role: checkUserExist.role,
          token: this.signJwt({
            userId: checkUserExist.id.toString() || '',
            email,
            roles: [checkUserExist.role],
          }),
        });
      }
      throw new HttpException(
        this.util.buildCustomResponse(2, null, 'Incorrect password'),
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      this.util.buildCustomResponse(1, null, 'Email not found'),
      HttpStatus.BAD_REQUEST,
    );
  }

  // public getRedisResendType(type: number, user: User): string {
  //   switch (type) {
  //     case REDIS_EXPIRE_RESEND.LOGIN_EMAIL_VERIFICATION:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.LOGIN_EMAIL_VERIFICATION}:${user.email}`;
  //     case REDIS_EXPIRE_RESEND.REMOVE_AUTHENTICATOR_EMAIL_VERIFICATION:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.REMOVE_AUTHENTICATOR_EMAIL_VERIFICATION}:${user.email}`;
  //     case REDIS_EXPIRE_RESEND.REMOVE_TWO_FA_EMAIL_VERIFICATION:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.REMOVE_TWO_FA_EMAIL_VERIFICATION}:${user.email}`;
  //     case REDIS_EXPIRE_RESEND.REQUEST_CHANGE_PASSWORD:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.REQUEST_CHANGE_PASSWORD}:${user.email}`;
  //     case REDIS_EXPIRE_RESEND.ENABLE_2FA_GOOGLE:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.ENABLE_2FA_GOOGLE}:${user.id}`;
  //     case REDIS_EXPIRE_RESEND.ENABLE_2FA:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.ENABLE_2FA}:${user.email}`;
  //     default:
  //       return `${REDIS.RESEND_EXPIRED}:${REDIS.LOGIN_EMAIL_VERIFICATION}:${user.email}`;
  //   }
  //}

  async register(dto: any) {
    let user = await this.prismaService.user.findFirst({
      where: {
        email: dto.email,
      },
    });
    if (user) {
      throw new HttpException('User Exists', HttpStatus.BAD_REQUEST);
    }
    dto.dateOfBirth = new Date(Date.now());
    let createUser = await this.prismaService.user.create({
      data: dto,
    });
    if (createUser) {
      return {
        statusCode: 200,
        message: 'Register success',
      };
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }
}
