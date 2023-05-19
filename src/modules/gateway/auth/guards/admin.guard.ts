/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { USER_ROLES } from 'src/share/common/constants';

import { Payload } from '..';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  override handleRequest(_err: never, user: Payload): any {
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

    if (
      user.roles &&
      !user.roles.includes(USER_ROLES.ADMIN) &&
      !user.roles.includes(USER_ROLES.SUPPER_ADMIN)
    ) {
      throw new HttpException(
        {
          code: 1,
          message: 'Not admin',
          data: null,
          status: 'fail',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  public getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return <Request>ctx.req;
    }
    console.log(context.switchToHttp().getRequest<Request>().user);
    return context.switchToHttp().getRequest<Request>();
  }
}
