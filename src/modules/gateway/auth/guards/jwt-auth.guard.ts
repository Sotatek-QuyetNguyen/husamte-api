/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus, CACHE_MANAGER } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
// import { Cache } from 'cache-manager';



@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  override handleRequest(_err: never, user: any): any {
    // don't throw 401 error when unauthenticated
    if (!user) {
      throw new HttpException(
        {
          code: -1,
          message: 'Unauthorized',
          data: null,
          status: 'fail',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!user.checkToken) {
      throw new HttpException(
        {
          code: -2,
          message: 'The session has expired, please relogin.',
          data: null,
          status: 'fail',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    // console.log(lastUpdateTime);
    return user;
  }

  public getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {}
      const ctx = GqlExecutionContext.create(context).getContext();
      return <Request>ctx.req;
    // }
    return context.switchToHttp().getRequest<Request>();
  }
}
